/**
 * 05 — Notification Scheduler  (MOCK / DESIGN ONLY)
 * ---------------------------------------------------------------
 * Responsibility: this is the "Saturday morning, milk wasn't ordered
 * yet, ping the user" cron. It runs every N minutes, scans patterns
 * whose `missedThreshold` has passed without a matching purchase,
 * and emits one notification per overdue pattern.
 *
 * Trigger taxonomy
 *   - PATTERN_OVERDUE        : pattern's missed-threshold has passed
 *   - PATTERN_DUE_SOON       : nextExpected within next 30 minutes (pre-empt)
 *   - CONTEXTUAL_FIRE        : weather/calendar state matches a contextual pattern
 *   - SEASONAL_FIRE          : annual calendar match (Valentine's, Diwali)
 *
 * Cooldown rules (so we don't spam users)
 *   - one notification per (userId, productId) per 24h
 *   - global cap: 3 ML-driven notifications per user per day
 *   - never push between 22:00 and 07:00 user-local time
 */

import { buildSmartCart } from './04-recommender.mock.js';

/**
 * @typedef {Object} PushNotification
 * @property {string} userId
 * @property {string} title
 * @property {string} body
 * @property {string} deeplink         "/cart?source=smart-cart-id"
 * @property {string} triggerType
 */


/**
 * Cron entry point. Run every 30 minutes.
 *
 * @param {string} userId
 * @param {import('./02-pattern-miner.mock.js').LearnedPattern[]} patterns
 * @param {{ now?: number, recentEventTimestamps?: Set<string> }} [opts]
 * @returns {PushNotification[]}
 */
export function runScheduler(userId, patterns, opts = {}) {
  const now = opts.now ?? Date.now();
  const out = [];

  for (const p of patterns) {
    // ----- 1. Overdue pattern: should have happened, hasn't -----
    if (p.missedThreshold && new Date(p.missedThreshold).getTime() < now) {
      const alreadyOrdered = recentlyOrdered(p, opts.recentEventTimestamps);
      if (alreadyOrdered) continue;

      const cart = buildSmartCart(userId, patterns, {
        type: 'pattern_overdue',
        patternId: p.patternId
      });
      if (!cart) continue;

      out.push({
        userId,
        title:  `Did you forget the ${friendlyProductName(p.productId)}?`,
        body:   `${cart.body} Tap to load and slide to pay.`,
        deeplink: `/cart?source=${cart.cartId}`,
        triggerType: 'PATTERN_OVERDUE'
      });
      continue;
    }

    // ----- 2. Due-soon pre-emption -----
    if (p.nextExpected) {
      const minutesUntil = (new Date(p.nextExpected).getTime() - now) / 60_000;
      if (minutesUntil > 0 && minutesUntil <= 30) {
        out.push({
          userId,
          title:  'Your usual is ready when you are',
          body:   `${friendlyProductName(p.productId)} preloaded — same time as last week.`,
          deeplink: `/home?highlight=${p.patternId}`,
          triggerType: 'PATTERN_DUE_SOON'
        });
      }
    }
  }

  return applyCooldownAndQuietHours(userId, out, now);
}


/**
 * Was an event matching this pattern already recorded recently?
 *
 * In production: query the event log for events in the window
 *   [nextExpected - graceMinutes/2, missedThreshold]
 * matching this pattern's productId. If found, the pattern fired
 * naturally — do not notify.
 */
function recentlyOrdered(pattern, recentEventTimestamps) {
  if (!recentEventTimestamps || recentEventTimestamps.size === 0) return false;
  // mock: caller passes a set of "recent purchase keys"
  return recentEventTimestamps.has(`${pattern.userId}:${pattern.productId}`);
}


/**
 * Cooldowns:
 *   - one notif per product per 24h
 *   - global cap of 3 ML notifs per user per day
 *   - quiet hours 22:00–07:00 local time
 */
function applyCooldownAndQuietHours(userId, candidates, now) {
  // TODO: read a notifications-sent log keyed by (userId, productId, day)
  //       and drop duplicates. For mock we just return the candidates.
  const userLocalHour = new Date(now).getHours();
  if (userLocalHour < 7 || userLocalHour >= 22) return [];
  return candidates.slice(0, 3);
}


const friendlyProductName = (id) => id;   // catalog lookup at render time
