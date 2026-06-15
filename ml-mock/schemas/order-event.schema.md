# OrderEvent — schema reference

> Source of truth for what a single placed order looks like as it enters the
> ML pipeline. One event per confirmed order, written exactly once.

```jsonc
{
  "eventId":   "01HZ8...",                       // ULID, globally unique
  "userId":    "u_001",                          // stable customer id
  "orderId":   "ord_2026_06_13_001",             // commerce order id
  "timestamp": "2026-06-13T07:42:00Z",           // ISO-8601 UTC
  "items": [
    { "productId": "DF-001", "qty": 1, "unitPrice": 60 },
    { "productId": "DF-002", "qty": 1, "unitPrice": 40 }
  ],

  // Cheap features captured at event time so the miner does not have to
  // look them up later. Keeping them denormalized on the event makes
  // backfills and replays trivial.
  "context": {
    "dayOfWeek":       6,           // 0=Sun .. 6=Sat
    "hourLocal":       7,           // 24h local time
    "weather":         "rainy",     // clear|rainy|cold|hot|stormy|unknown
    "isHoliday":       false,
    "isPayday":        true,
    "deliveryPincode": "835215"
  },

  // How the cart was assembled. Used to downweight AI-built carts during
  // pattern mining so we don't learn from our own suggestions.
  "source": "manual"                // manual|ai-cart|preloaded-cart|reorder|voice
}
```

## Why these fields?

| Field          | Why we keep it                                                                 |
| -------------- | ------------------------------------------------------------------------------ |
| `eventId`      | Idempotency key for the event sink — replays don't double-count.               |
| `timestamp`    | The single most important feature. Everything else is derived from it.         |
| `context.dayOfWeek` / `hourLocal` | Periodic patterns (Tue/Thu/Sat morning) need this without timezone math at training time. |
| `context.weather` / `isHoliday`   | Lets us learn contextual triggers ("chai on rainy evenings"). |
| `source`       | If a user accepts a Cart-AI cart that suggested milk, we should not count that as an independent signal that the user "intended" milk on that day. We discount it. |
