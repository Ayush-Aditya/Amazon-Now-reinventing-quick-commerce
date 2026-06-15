/**
 * 04 — Recommender  (MOCK / DESIGN ONLY)
 * ---------------------------------------------------------------
 * Responsibility: read the patterns store and produce concrete
 * preloaded carts that the home screen and notifications can render.
 *
 * Two entry points:
 *
 *   buildHomePicks(userId)
 *     → list of suggested products for the "Based on your past orders"
 *       section. Sorted by (confidence × recencyScore).
 *
 *   buildSmartCart(userId, trigger)
 *     → a fully assembled cart for a specific trigger (e.g. "rainy
 *       evening", "Saturday morning replenishment").
 */

/**
 * @typedef {import('./02-pattern-miner.mock.js').LearnedPattern} LearnedPattern
 *
 * @typedef {Object} HomePick
 * @property {string} productId
 * @property {number} qty
 * @property {string} reason     human-readable explainer ("you usually buy on Tuesdays")
 * @property {number} score      0..1
 *
 * @typedef {Object} SmartCart
 * @property {string} cartId
 * @property {string} title
 * @property {string} body
 * @property {Array<{productId: string, qty: number}>} items
 * @property {number} score
 * @property {string} triggerType
 */


/**
 * Top-N picks for the home screen.
 *
 * @param {string} userId
 * @param {LearnedPattern[]} patterns   scored patterns for this user
 * @param {number} limit
 * @returns {HomePick[]}
 */
export function buildHomePicks(userId, patterns, limit = 6) {
  return patterns
    .filter(p => p.confidence >= 0.6)
    .map(p => ({
      productId: p.productId,
      qty: Math.round(p.params.avgQty ?? 1),
      reason: explain(p),
      score: round(p.confidence * p.recencyScore)
    }))
    // de-dupe products in case both periodic and cooccurrence fire
    .reduce((acc, pick) => {
      if (!acc.find(x => x.productId === pick.productId)) acc.push(pick);
      return acc;
    }, [])
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}


/**
 * Build a smart cart in response to a trigger.
 *
 * Triggers come from:
 *   - the cron in stage 05 ("milk pattern overdue")
 *   - the calendar / weather service
 *   - the AI chat saying "the user asked for hangover stuff"
 *
 * @param {string} userId
 * @param {LearnedPattern[]} patterns
 * @param {{ type: string, [k: string]: any }} trigger
 * @returns {SmartCart|null}
 */
export function buildSmartCart(userId, patterns, trigger) {
  switch (trigger.type) {
    case 'pattern_overdue':       return cartFromOverduePattern(patterns, trigger);
    case 'rainy_evening':         return cartFromRainContext(patterns);
    case 'weekend_party':         return cartFromCooccurrenceCluster(patterns, ['SD-001','SD-003','SD-005']);
    case 'monday_replenishment':  return cartFromWeeklyReplenishments(patterns);
    case 'valentine':             return staticOccasionCart(/* curated */);
    default: return null;
  }
}


// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

function cartFromOverduePattern(patterns, trigger) {
  const main = patterns.find(p => p.patternId === trigger.patternId);
  if (!main) return null;

  // Add the missed product, plus any products that frequently co-occur
  // with it (e.g. milk + bread).
  const items = [{ productId: main.productId, qty: Math.round(main.params.avgQty ?? 1) }];
  const partners = patterns
    .filter(p => p.patternType === 'cooccurrence' && p.params.anchorProductId === main.productId)
    .filter(p => p.confidence >= 0.65);
  for (const partner of partners) {
    items.push({ productId: partner.productId, qty: 1 });
  }

  return {
    cartId: `sc_${main.userId}_overdue_${Date.now()}`,
    title: 'You usually order this around now',
    body:  `${friendlyProductName(main.productId)} is part of your routine — looks like it slipped today.`,
    items,
    score: main.confidence,
    triggerType: 'pattern_overdue'
  };
}

function cartFromRainContext(patterns) {
  const rainy = patterns.filter(p => p.patternType === 'contextual_weather'
                                  && p.params.weather === 'rainy'
                                  && p.confidence >= 0.6);
  if (rainy.length === 0) return null;
  // pick the highest-confidence anchor and pull in its co-occurring items
  const anchor = rainy.sort((a, b) => b.confidence - a.confidence)[0];
  const items = [
    { productId: anchor.productId, qty: 1 },
    ...(anchor.params.cooccursWith || []).map(id => ({ productId: id, qty: 1 }))
  ];
  return {
    cartId: `sc_rain_${Date.now()}`,
    title: 'Rainy evening kit',
    body:  'Your usual chai-and-pakora setup, ready to ship in 10 minutes.',
    items,
    score: anchor.confidence,
    triggerType: 'rainy_evening'
  };
}

function cartFromCooccurrenceCluster(patterns, seedIds) {
  // TODO: starting from the seed products, walk the co-occurrence graph
  //       1-2 steps and assemble a cart. Useful for things like
  //       "weekend party" where we know the seed and want neighbours.
  return null;
}

function cartFromWeeklyReplenishments(patterns) {
  // TODO: aggregate all periodic_weekday + periodic_interval patterns
  //       whose nextExpected falls in the next 24h, dedupe, return.
  return null;
}

function staticOccasionCart() {
  // TODO: return a curated cart for a calendar holiday. The mining
  //       pipeline doesn't need to invent these — they live in
  //       data/preloadedCarts.js and just borrow this code path.
  return null;
}


// ---------------------------------------------------------------
// Explainability
// ---------------------------------------------------------------
//
// Every recommendation should ship with a one-line reason. This is
// what we print on the home tile and the notification body so the
// user trusts the suggestion.
function explain(pattern) {
  switch (pattern.patternType) {
    case 'periodic_weekday':
      return `You usually buy this on ${pattern.params.weekdays.map(weekdayName).join(' / ')}.`;
    case 'periodic_interval':
      return `You restock this roughly every ${Math.round(pattern.params.intervalDaysMean)} days.`;
    case 'monthly':
      return `You buy this around the same date every month.`;
    case 'cooccurrence':
      return `Often paired with ${friendlyProductName(pattern.params.anchorProductId)}.`;
    case 'contextual_weather':
      return `You tend to order this when it's ${pattern.params.weather}.`;
    case 'seasonal':
      return `Seasonal pick from your past orders.`;
    default:
      return 'Based on your past orders.';
  }
}


// Helpers (would resolve from the catalog at render time)
const weekdayName = (d) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d];
const friendlyProductName = (id) => id;   // mock — real impl looks up darkstoreDB
const round = (x) => Math.round(x * 100) / 100;
