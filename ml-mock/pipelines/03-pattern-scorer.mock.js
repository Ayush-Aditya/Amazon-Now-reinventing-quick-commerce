/**
 * 03 — Pattern Scorer  (MOCK / DESIGN ONLY)
 * ---------------------------------------------------------------
 * Responsibility: take the raw candidate patterns from the miner and
 *   1. assign a final `confidence` blended from support, recency, and lift,
 *   2. compute the next-expected timestamp + missed-threshold,
 *   3. drop low-quality patterns below a global threshold.
 *
 * Why this is a separate stage
 *   - The miner cares about "is this real?". The scorer cares about
 *     "should we act on this *now*?". Recency, decay and freshness
 *     belong in scoring, not detection.
 *   - Easy to A/B test the scorer without touching detection logic.
 */

const HALF_LIFE_DAYS = 21;       // older signals decay; tweak to taste
const MIN_CONFIDENCE = 0.55;     // hard floor to publish a pattern

/**
 * @param {import('./02-pattern-miner.mock.js').LearnedPattern[]} candidates
 * @returns {import('./02-pattern-miner.mock.js').LearnedPattern[]} scored & filtered
 */
export function scorePatterns(candidates) {
  const now = Date.now();
  return candidates
    .map(p => {
      const recency  = recencyScore(p.lastSeen, now);
      const support  = supportScore(p.support);
      const conf     = Math.min(1, p.confidence * 0.6 + support * 0.25 + recency * 0.15);

      const { nextExpected, graceMinutes } = predictNext(p, now);

      return {
        ...p,
        recencyScore: recency,
        confidence:   round(conf),
        nextExpected,
        graceMinutes,
        missedThreshold: nextExpected
          ? new Date(new Date(nextExpected).getTime() + graceMinutes * 60_000).toISOString()
          : null,
        updatedAt: new Date(now).toISOString()
      };
    })
    .filter(p => p.confidence >= MIN_CONFIDENCE);
}

// ---------------------------------------------------------------
// Recency: exponential decay with half-life HALF_LIFE_DAYS
// ---------------------------------------------------------------
function recencyScore(lastSeenIso, now) {
  const ageDays = (now - new Date(lastSeenIso).getTime()) / 86_400_000;
  return Math.pow(0.5, ageDays / HALF_LIFE_DAYS);   // 0..1, fresher = higher
}

// ---------------------------------------------------------------
// Support: log-saturating curve. 4 obs ≈ 0.5, 12 obs ≈ 0.85.
// We don't want raw count to dominate — a 50-time pattern is not
// 5× more reliable than a 10-time pattern.
// ---------------------------------------------------------------
function supportScore(n) {
  return n <= 0 ? 0 : Math.min(1, Math.log10(1 + n) / Math.log10(20));
}

// ---------------------------------------------------------------
// Next-expected prediction depends on pattern type
// ---------------------------------------------------------------
function predictNext(pattern, now) {
  switch (pattern.patternType) {
    case 'periodic_weekday':
      return predictWeekday(pattern, now);
    case 'periodic_interval':
      return predictInterval(pattern, now);
    case 'monthly':
      return predictMonthly(pattern, now);
    case 'cooccurrence':
    case 'contextual_weather':
    case 'seasonal':
    default:
      // Some patterns don't have a "next expected" — they fire when
      // a trigger event happens (e.g. "user added bread → suggest butter").
      return { nextExpected: null, graceMinutes: 0 };
  }
}

function predictWeekday(pattern, now) {
  // Find the soonest weekday in pattern.params.weekdays at expectedHour
  const { weekdays, expectedHourLocal } = pattern.params;
  const today = new Date(now);
  for (let offset = 0; offset < 8; offset++) {
    const d = new Date(today.getTime() + offset * 86_400_000);
    if (weekdays.includes(d.getDay())) {
      d.setHours(expectedHourLocal, 0, 0, 0);
      if (d.getTime() > now) {
        return { nextExpected: d.toISOString(), graceMinutes: 6 * 60 };
      }
    }
  }
  return { nextExpected: null, graceMinutes: 0 };
}

function predictInterval(pattern, now) {
  const lastSeen = new Date(pattern.lastSeen).getTime();
  const ms = pattern.params.intervalDaysMean * 86_400_000;
  // Grace = 2σ (covers ~95% of expected variance)
  const grace = Math.round(2 * pattern.params.intervalDaysStd * 1440);
  return {
    nextExpected: new Date(lastSeen + ms).toISOString(),
    graceMinutes: grace
  };
}

function predictMonthly(pattern, _now) {
  // TODO: take the dominant day-of-month from params, schedule for next month
  return { nextExpected: null, graceMinutes: 0 };
}

const round = (x) => Math.round(x * 100) / 100;
