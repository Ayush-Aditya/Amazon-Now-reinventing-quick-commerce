# LearnedPattern — schema reference

> One row per (user × productId × patternType). Written by the pattern miner,
> read by the recommender and the notification scheduler. Keyed by
> `userId#productId#patternType` in the patterns store.

```jsonc
{
  "patternId":   "pat_u_001_DF-001_periodic_weekday",
  "userId":      "u_001",
  "productId":   "DF-001",                     // the catalog id this pattern is about
  "patternType": "periodic_weekday",           // see "Pattern types" below

  // ----- Pattern parameters (vary by type) -----
  "params": {
    "weekdays": [2, 4, 6],                      // Tue, Thu, Sat
    "expectedHourLocal": 7,                     // morning purchase
    "avgQty": 1,
    "intervalDaysMean": 2.34,                   // optional, used by periodic_interval
    "intervalDaysStd":  0.41
  },

  // ----- Statistics from the miner -----
  "support":      18,                           // observed N times
  "confidence":   0.92,                         // see scorer
  "lift":         3.1,                          // vs base rate
  "recencyScore": 0.97,                         // recent observations weighted up
  "lastSeen":     "2026-06-11T07:30:00Z",
  "firstSeen":    "2025-12-04T08:10:00Z",

  // ----- Derived predictions used downstream -----
  "nextExpected":     "2026-06-13T07:30:00Z",   // when we expect the next purchase
  "graceMinutes":     360,                       // window before we treat as missed
  "missedThreshold":  "2026-06-13T13:30:00Z",   // nextExpected + graceMinutes

  "createdAt":  "2026-06-12T03:00:00Z",
  "updatedAt":  "2026-06-12T03:00:00Z"
}
```

## Pattern types

| Type                  | Example                                                       | Detector |
| --------------------- | ------------------------------------------------------------- | -------- |
| `periodic_weekday`    | "Milk every Tue / Thu / Sat morning"                          | weekday histogram + chi-square |
| `periodic_interval`   | "Atta every ~14 days"                                         | inter-arrival time gaussian fit |
| `cooccurrence`        | "Whenever they buy bread, they buy butter"                    | FP-Growth / association rules |
| `seasonal`            | "Roses on Feb 14"                                             | calendar matching, year-over-year |
| `contextual_weather`  | "Chai + pakora on rainy evenings"                             | weather-conditional support |
| `monthly`             | "Detergent on the 1st of every month"                         | day-of-month histogram |

## Why it's split this way

- The schema is **uniform across types**, so the recommender doesn't need to
  branch — it just sorts by `confidence × recencyScore` and renders.
- `params` is a JSON object so we can add new pattern types later without
  rewriting the store.
- `nextExpected` and `missedThreshold` are precomputed at write time so the
  notification scheduler is just a cheap range scan.
