# Architecture Notes

Deeper rationale that didn't fit in the per-file headers. Read this if you
want to actually go build the real thing.

## 1. Why a hand-rolled detector zoo instead of one big neural net

For a daily-essentials darkstore the patterns we care about are sparse and
extremely interpretable: weekday cycles, fixed intervals, calendar dates,
co-occurrence pairs. A bunch of small specialised detectors gives us:

- **Explainability.** Every recommendation ships with one human-readable
  reason ("you usually buy this on Tue / Thu / Sat"). That builds trust
  faster than a black box. Trust is the bottleneck for adoption — users
  who *understand* a suggestion are dramatically more likely to accept it.
- **Cheap retraining.** A weekday histogram is a `GROUP BY`. The whole
  miner runs in seconds per user.
- **Safe cold-start.** A new user gets useful suggestions after 3-4 weeks
  of orders, not after we've collected a million sessions.

If/when scale or quality demands it, the natural next step is a transformer
sequence model on the tokenised event stream, with the detector outputs
as features. The pipeline above feeds it; nothing is wasted.

## 2. How quantities are inferred

Each pattern carries `params.avgQty`. We use a *trimmed mean* (drop top &
bottom 10%) to ignore one-off bulk buys. A future refinement is to predict
quantity conditional on recent context (bigger party-pack on weekends) but
for v1 the trimmed mean is good enough.

## 3. Why we discount AI-suggested orders

Pattern mining on purchases that the AI itself suggested causes a feedback
loop: the model recommends X, the user accepts X, the model sees X and gets
*more* confident about X, recommends it harder, etc. We tag every order
with `source` at write time (manual / ai-cart / preloaded-cart / reorder /
voice). The miner counts `manual` and `voice` at full weight, `reorder` at
0.7, AI-suggested orders at 0.3. The user's *intent* is what we want to
learn, not our own past recommendations.

## 4. Privacy

The whole pipeline is per-user. There is no cross-user learning here. That
keeps the mental model simple, makes deletion easy (`DELETE WHERE userId =
?` and the model is gone), and side-steps differential-privacy questions
that would otherwise be required if we trained on shared data. Cross-user
patterns (collaborative filtering, "people like you") are a separate
service that lives behind its own API and is opt-in.

## 5. Storage sketch

| Store          | Layout                                                       | Why |
| -------------- | ------------------------------------------------------------ | --- |
| Event log hot  | DynamoDB pk=`userId`, sk=`timestamp` desc                    | range scans for "last 90 days" |
| Event log cold | S3 `s3://fresh-events/yyyy/mm/dd/userId.parquet`             | Athena + SageMaker batch jobs |
| Patterns       | DynamoDB pk=`userId`, sk=`patternId`                         | one round-trip per user |
| Notifications  | DynamoDB pk=`userId#yyyymmdd`, sk=`productId` with TTL=2d    | cooldown enforcement |

## 6. The cron schedule

| Job                                        | Cadence       | Latency budget |
| ------------------------------------------ | ------------- | -------------- |
| Event collector (always running)           | per request   | < 50 ms p99    |
| Pattern miner (per active user)            | nightly 03:00 | 5 minutes      |
| Notification scheduler                     | every 30 min  | < 1 minute     |
| Weather / holiday cache refresh            | hourly        | n/a            |

## 7. Failure modes & graceful degradation

- **No patterns yet** (cold-start user): home page falls back to the
  curated `preloadedCarts.js` list. The recommender returns `null` for
  everyone for the first few weeks, and the React app renders the static
  carts as today.
- **Patterns store down**: same thing — fall back to static carts.
  Preserve the *experience*, not the personalisation.
- **Notification scheduler down**: silent degradation. We don't push a
  notification — we don't push a wrong notification. Quiet failure beats
  noisy failure here.

## 8. Eval / how we'd know it works

- Offline: replay the event log, hide the last week of orders, see how
  many we'd have suggested in time. Precision @ k=5 per user, recall
  on the suggested catalog.
- Online: A/B with a holdout group that gets the static `preloadedCarts`
  only. Primary metric: re-order rate within 24h of notification.
  Secondary: notification dismissal rate (we want this *low*).
