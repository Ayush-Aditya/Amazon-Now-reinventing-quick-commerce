# ml-mock — Pattern-Based Cart Prediction (Design Only)

Everything in this folder is **mockup / design code**. None of it runs from the
live app; it is here so you can study how a real pattern-mining recommender
would slot into Amazon Fresh AI.

## The Problem

A user reorders the same things on a rhythm:

> "Every Tuesday, Thursday and Saturday morning Aditya buys milk + bread.
>  One Saturday he forgets — we should ping him before the day ends."

We want a system that:

1. **Records** every order event with rich context (time, weather, weekday).
2. **Mines** that history for repeating patterns per (user × product).
3. **Scores** how reliable each pattern is.
4. **Predicts** the next expected occurrence.
5. **Fires a notification or preloads a cart** when an expected pattern is
   about to be missed.

## Pipeline at a glance

```
   ┌─────────────────────┐
   │ 1. Event Collector  │  every order → append to event log
   └─────────┬───────────┘
             ▼
   ┌─────────────────────┐
   │ 2. Pattern Miner    │  nightly cron → discover patterns
   └─────────┬───────────┘  (periodic, weekday, co-occurrence, seasonal)
             ▼
   ┌─────────────────────┐
   │ 3. Pattern Scorer   │  assign confidence + support
   └─────────┬───────────┘
             ▼
   ┌─────────────────────┐
   │ 4. Recommender      │  on-demand → preloaded carts for the home page
   └─────────┬───────────┘
             ▼
   ┌─────────────────────┐
   │ 5. Notif Scheduler  │  every 30 min → fire push if pattern overdue
   └─────────────────────┘
```

## Files

| File | What it represents |
| ---- | ------------------ |
| `schemas/order-event.schema.json` | Canonical shape of one order event |
| `schemas/learned-pattern.schema.json` | Canonical shape of one learned pattern |
| `sample-data/order-events.json` | A handful of realistic events for one user |
| `sample-data/learned-patterns.json` | What patterns ought to fall out of those events |
| `pipelines/01-event-collector.mock.js` | Where new orders get appended to the event log |
| `pipelines/02-pattern-miner.mock.js` | The pattern-mining job (FP-Growth + weekday histogram + autocorrelation) |
| `pipelines/03-pattern-scorer.mock.js` | Confidence scoring with recency decay |
| `pipelines/04-recommender.mock.js` | Builds preloaded carts from the highest-confidence patterns |
| `pipelines/05-notification-scheduler.mock.js` | Cron that detects missed-pattern moments and fires push notifications |
| `server-routes.mock.js` | The HTTP surface that the React app would call |
| `architecture.md` | Deeper notes on choice of algorithm, scaling, privacy |

Open them in roughly that order — they read like a design doc.

## What is *not* here

- Real ML training code. All learning is pseudocode + comments.
- Persistence (DynamoDB / Postgres / S3 layouts are described, not wired).
- Auth, multi-tenancy, telemetry.

When this graduates from mock to real, the natural progression is:

1. Event collector → AWS Kinesis / Kafka topic
2. Event log → S3 (raw) + Athena (queryable) or a time-series DB
3. Pattern miner → SageMaker batch job or Lambda on a schedule
4. Patterns store → DynamoDB keyed by `userId#productId`
5. Notification scheduler → EventBridge cron + SNS push
