/**
 * 02 — Pattern Miner  (MOCK / DESIGN ONLY)
 * ---------------------------------------------------------------
 * Responsibility: read the event log, learn repeating patterns
 * per (user × product), and write LearnedPattern rows.
 *
 * Runs as a nightly batch job:
 *   - input:  event log for the last N days (90 is a good default)
 *   - output: replaces or upserts patterns in the patterns store
 *
 * Why batch instead of streaming
 *   - patterns need a stable window of history to be meaningful
 *   - batch lets us retrain end-to-end on schema changes
 *   - latency budget (overnight) is fine for "what to suggest tomorrow"
 *
 * The miner runs *several detectors in parallel* on the same per-user
 * event slice. Each detector emits zero or more candidate patterns.
 * The scorer (stage 03) then ranks and filters them.
 */

/**
 * @typedef {import('./01-event-collector.mock.js').OrderEvent} OrderEvent
 *
 * @typedef {Object} LearnedPattern
 * @property {string} patternId
 * @property {string} userId
 * @property {string} productId
 * @property {string} patternType
 * @property {object} params
 * @property {number} support
 * @property {number} confidence
 * @property {number} lift
 * @property {number} recencyScore
 * @property {string} firstSeen
 * @property {string} lastSeen
 * @property {string|null} nextExpected
 * @property {number} graceMinutes
 * @property {string|null} missedThreshold
 */


// =============================================================
// Top-level orchestrator
// =============================================================

/**
 * Mine all patterns for one user.
 *
 * @param {string} userId
 * @param {OrderEvent[]} events    user's events sorted ascending by timestamp
 * @returns {LearnedPattern[]}
 */
export function minePatternsForUser(userId, events) {
  // 1. Pre-process: bucket events by productId since most detectors
  //    operate per-product.
  const byProduct = groupByProduct(events);

  const candidates = [
    ...detectPeriodicWeekday(userId, byProduct),
    ...detectPeriodicInterval(userId, byProduct),
    ...detectMonthly(userId, byProduct),
    ...detectCooccurrence(userId, events),
    ...detectContextualWeather(userId, events),
    ...detectSeasonal(userId, events)
  ];

  // De-duplicate: a (user, product) might be picked up by multiple
  // detectors. Keep the highest-confidence variant.
  return dedupeKeepBest(candidates);
}


// =============================================================
// Detector 1: periodic_weekday
// "Every Tue/Thu/Sat morning, milk."
// =============================================================
//
// Idea: build a histogram of weekdays the product was bought on.
// If a few weekdays carry the bulk of the mass and the chi-square
// test rejects the uniform null at p < 0.05, those weekdays form
// a pattern.
function detectPeriodicWeekday(userId, byProduct) {
  const out = [];

  for (const [productId, events] of byProduct) {
    if (events.length < 4) continue;                 // not enough data

    // weekday histogram
    const histogram = new Array(7).fill(0);
    for (const e of events) histogram[e.context.dayOfWeek]++;

    // pick the weekdays whose count is materially above average
    const avg = events.length / 7;
    const dominantDays = histogram
      .map((c, d) => (c >= avg * 1.5 ? d : null))
      .filter(d => d !== null);

    if (dominantDays.length === 0 || dominantDays.length > 4) continue;

    // chi-square against uniform — pseudocode
    // const { p } = chiSquareGoodnessOfFit(histogram, /* expected uniform */);
    // if (p > 0.05) continue;

    // Find the typical hour (median of all events)
    const hours = events.map(e => e.context.hourLocal).sort((a, b) => a - b);
    const expectedHourLocal = hours[Math.floor(hours.length / 2)];

    // Average qty
    const avgQty = mean(events.map(e =>
      (e.items.find(it => it.productId === productId)?.qty) ?? 1
    ));

    out.push(buildPattern({
      userId,
      productId,
      patternType: 'periodic_weekday',
      params: { weekdays: dominantDays, expectedHourLocal, avgQty },
      events,
      // confidence: sum of mass on dominant days / total mass
      rawConfidence: dominantDays.reduce((s, d) => s + histogram[d], 0) / events.length
    }));
  }

  return out;
}


// =============================================================
// Detector 2: periodic_interval
// "Atta every ~14 days." Independent of weekday.
// =============================================================
//
// Idea: compute inter-arrival times. If the standard deviation is
// much smaller than the mean (low coefficient of variation), it's
// periodic. Mean → next-expected, sigma → grace window.
function detectPeriodicInterval(userId, byProduct) {
  const out = [];

  for (const [productId, events] of byProduct) {
    if (events.length < 4) continue;
    const intervals = [];
    for (let i = 1; i < events.length; i++) {
      const dt = (date(events[i]) - date(events[i - 1])) / 86_400_000; // days
      intervals.push(dt);
    }
    const mu = mean(intervals);
    const sigma = stddev(intervals);

    // skip uniform / chaotic — coefficient of variation > 0.4 means noisy
    if (mu < 1 || sigma / mu > 0.4) continue;

    out.push(buildPattern({
      userId,
      productId,
      patternType: 'periodic_interval',
      params: { intervalDaysMean: mu, intervalDaysStd: sigma, avgQty: 1 },
      events,
      // confidence = 1 - coefficient_of_variation
      rawConfidence: clamp01(1 - sigma / mu)
    }));
  }

  return out;
}


// =============================================================
// Detector 3: monthly
// "Detergent on the 1st of every month."
// =============================================================
function detectMonthly(userId, byProduct) {
  // TODO: build day-of-month histogram, look for peaks ≥ 50% of mass
  //       on a single day or a 3-day window.
  return [];
}


// =============================================================
// Detector 4: cooccurrence
// "Whenever they buy bread, they buy butter."
// =============================================================
//
// Classic market-basket analysis. We use an FP-Growth pass over the
// user's order baskets and emit pairs with lift > 1.5.
function detectCooccurrence(userId, events) {
  // 1. Treat each order as a transaction = set of productIds.
  // 2. Run FP-Growth (or Apriori) with min support = 2 and
  //    min confidence = 0.5.
  // 3. Emit one pattern per (anchor → consequent) pair.
  //
  // We anchor on the *more-frequent* item so the rule reads naturally:
  //   "you bought DF-001 (milk) → likely also DF-002 (bread)".
  //
  // For mock purposes we'd just return pseudo-results.
  return [];
}


// =============================================================
// Detector 5: contextual_weather
// "Chai + pakora kit on rainy evenings."
// =============================================================
//
// For each productId, compute its support conditional on weather.
// If P(buy | rainy) >> P(buy), it's a weather-contextual pattern.
function detectContextualWeather(userId, events) {
  // TODO:
  //   const baseRate = events.length / totalDays;
  //   for each (productId, weather) bucket:
  //     conditionalRate = bucketCount / weatherDayCount
  //     if conditionalRate / baseRate > 2.0  → emit pattern
  return [];
}


// =============================================================
// Detector 6: seasonal
// "Roses on Feb 14 / Diwali sweets last year."
// =============================================================
//
// Use the calendar match across multiple years if available, plus the
// preloadedCarts curated calendar as a prior. Single-year evidence is
// not enough to call it seasonal (treat as cold-start until we see it
// repeat).
function detectSeasonal(userId, events) {
  return [];
}


// =============================================================
// Shared helpers
// =============================================================

function groupByProduct(events) {
  const m = new Map();
  for (const e of events) {
    for (const it of e.items) {
      if (!m.has(it.productId)) m.set(it.productId, []);
      m.get(it.productId).push(e);
    }
  }
  return m;
}

function buildPattern({ userId, productId, patternType, params, events, rawConfidence }) {
  const lastSeenIso = events[events.length - 1].timestamp;
  const firstSeenIso = events[0].timestamp;
  return {
    patternId: `pat_${userId}_${productId}_${patternType}`,
    userId,
    productId,
    patternType,
    params,
    support: events.length,
    confidence: rawConfidence,        // refined by stage 03
    lift: 1,                          // refined by stage 03
    recencyScore: 1,                  // refined by stage 03
    firstSeen: firstSeenIso,
    lastSeen: lastSeenIso,
    nextExpected: null,               // set by stage 03 (it knows pattern type)
    graceMinutes: 0,
    missedThreshold: null
  };
}

function dedupeKeepBest(patterns) {
  const map = new Map();
  for (const p of patterns) {
    const key = `${p.userId}#${p.productId}`;
    const existing = map.get(key);
    if (!existing || p.confidence > existing.confidence) map.set(key, p);
  }
  return [...map.values()];
}

const date = (e) => new Date(e.timestamp).getTime();
const mean = (arr) => arr.reduce((s, x) => s + x, 0) / arr.length;
const stddev = (arr) => {
  const m = mean(arr);
  return Math.sqrt(mean(arr.map(x => (x - m) ** 2)));
};
const clamp01 = (x) => Math.max(0, Math.min(1, x));
