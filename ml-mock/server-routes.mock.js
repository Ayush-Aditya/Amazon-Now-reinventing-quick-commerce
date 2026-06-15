/**
 * server-routes.mock.js  (MOCK / DESIGN ONLY)
 * ---------------------------------------------------------------
 * The HTTP surface that the React app would call once the ML
 * pipeline is real. Mounted next to the existing OpenRouter routes
 * in `fresh-ai/server/index.js`.
 *
 * None of these handlers actually run in this mock — the function
 * bodies show what they would do.
 */

// import express from 'express';
// import { recordOrder } from './pipelines/01-event-collector.mock.js';
// import { minePatternsForUser } from './pipelines/02-pattern-miner.mock.js';
// import { scorePatterns } from './pipelines/03-pattern-scorer.mock.js';
// import { buildHomePicks, buildSmartCart } from './pipelines/04-recommender.mock.js';
// import { runScheduler } from './pipelines/05-notification-scheduler.mock.js';

// export const router = express.Router();


// =============================================================
// 1. Ingestion
// =============================================================
//
// POST /api/ml/orders/event
// Called by the order-confirmation flow as soon as a user pays.
// Body: rawOrder (see 01-event-collector.mock.js).
// Returns: { eventId } once durably persisted.
//
// router.post('/orders/event', async (req, res) => {
//   const event = await recordOrder(req.body);
//   res.json({ eventId: event.eventId });
// });


// =============================================================
// 2. Read learned patterns for the home page
// =============================================================
//
// GET /api/ml/users/:userId/patterns
// Optional ?type=periodic_weekday filter.
// Returns: LearnedPattern[]   sorted by confidence desc.
//
// router.get('/users/:userId/patterns', async (req, res) => {
//   const patterns = await db.queryPatterns(req.params.userId, req.query.type);
//   res.json(patterns);
// });


// =============================================================
// 3. Home picks (replaces the hardcoded list in OrderAgain.jsx)
// =============================================================
//
// GET /api/ml/users/:userId/home-picks?limit=6
// Returns: HomePick[] (productId, qty, reason, score).
//
// router.get('/users/:userId/home-picks', async (req, res) => {
//   const patterns = await db.queryPatterns(req.params.userId);
//   const picks = buildHomePicks(req.params.userId, patterns, +req.query.limit || 6);
//   res.json(picks);
// });


// =============================================================
// 4. Smart cart for a specific trigger
// =============================================================
//
// POST /api/ml/users/:userId/smart-cart
// Body: { trigger: { type: 'rainy_evening' } }
// Returns: SmartCart | { empty: true }
//
// router.post('/users/:userId/smart-cart', async (req, res) => {
//   const patterns = await db.queryPatterns(req.params.userId);
//   const cart = buildSmartCart(req.params.userId, patterns, req.body.trigger);
//   res.json(cart ?? { empty: true });
// });


// =============================================================
// 5. Internal: re-train one user's patterns on demand
// =============================================================
//
// POST /api/ml/internal/users/:userId/retrain
// Used by support tooling and tests. Production has a nightly
// EventBridge cron that does this for every active user.
//
// router.post('/internal/users/:userId/retrain', async (req, res) => {
//   const events = await db.queryEvents(req.params.userId, { lookbackDays: 90 });
//   const candidates = minePatternsForUser(req.params.userId, events);
//   const scored = scorePatterns(candidates);
//   await db.replaceUserPatterns(req.params.userId, scored);
//   res.json({ count: scored.length });
// });


// =============================================================
// 6. Internal: notification cron tick
// =============================================================
//
// POST /api/ml/internal/cron/notifications
// EventBridge calls this every 30 minutes.
// For each user whose timezone is currently inside quiet hours
// the function returns []. Otherwise it returns notifications
// for SNS to fan out.
//
// router.post('/internal/cron/notifications', async (req, res) => {
//   const users = await db.activeUsers();
//   const all = [];
//   for (const u of users) {
//     const patterns = await db.queryPatterns(u.userId);
//     const recent = await db.recentPurchaseKeys(u.userId, '24h');
//     const notifs = runScheduler(u.userId, patterns, { recentEventTimestamps: recent });
//     for (const n of notifs) await sns.publish(n);
//     all.push(...notifs);
//   }
//   res.json({ pushed: all.length });
// });


/* ===============================================================
 * What the React app calls
 * ===============================================================
 *
 * Replace static data in `OrderAgain.jsx`:
 *     const picks = await fetch(`/api/ml/users/${uid}/home-picks`).then(r => r.json());
 *
 * Replace `preloadedCarts` in `NotificationsPage.jsx`:
 *     const cart = await fetch(`/api/ml/users/${uid}/smart-cart`, {
 *       method: 'POST',
 *       body: JSON.stringify({ trigger: { type: 'rainy_evening' } })
 *     }).then(r => r.json());
 *
 * Capture ad-hoc telemetry from the AI chat:
 *     await fetch('/api/ml/orders/event', { method: 'POST', body: JSON.stringify(rawOrder) });
 */
