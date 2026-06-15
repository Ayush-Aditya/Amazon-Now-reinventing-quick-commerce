# Amazon Fresh AI

> A reimagining of urgent shopping: instead of searching for products, you describe a *moment*
> ("friends coming over", "I'm hungover", "rainy evening") and the assistant builds the cart for you.
> Built for **HackOn with Amazon Season 6** under the *Amazon Now* theme.

```
 ┌───────────────────────────────────────────────────────────────────────────┐
 │  Cart AI                                            LIVE  ▶              │
 │  ─────────────────────────────────────────────────────────────────────── │
 │  > Friends coming over, snacks for 5                                     │
 │                                                                          │
 │  Here's a quick party cart — cold drinks, chips, and namkeen.            │
 │  ┌────────┬────────┬──────────┬──────────┬────────┐                      │
 │  │  Coke  │  Lays  │ Kurkure  │ Haldiram │  Cups  │  Add all to cart ₹523 │
 │  └────────┴────────┴──────────┴──────────┴────────┘                      │
 └───────────────────────────────────────────────────────────────────────────┘
```

---

## Table of contents

- [The pitch](#the-pitch)
- [What's in the box](#whats-in-the-box)
- [Demo flow](#demo-flow)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Project layout](#project-layout)
- [How the prototype works](#how-the-prototype-works)
- [Pattern-based recommender (`ml-mock/`)](#pattern-based-recommender-ml-mock)
- [From hackathon prototype to production on AWS](#from-hackathon-prototype-to-production-on-aws)
- [Migration Map](#migration-map)
- [Reference Architecture](#reference-architecture)
- [What Gets Cached, What Sits Cold, What Streams](#what-gets-cached-what-sits-cold-what-streams)
- [Roadmap & Next Iterations](#roadmap--next-iterations)
- [Honest hackathon context](#honest-hackathon-context)

---

## The pitch

Quick-commerce search is a search problem. *"How do I get bread, milk, eggs and bananas in 10 minutes?"*
You type four queries, ADD four times, then check out. Fine for staples, exhausting for situations.

The pitch here flips the interface. You tell the assistant the **situation**:

> *"Some friends are dropping by, we need snacks and drinks for five."*
> *"I'm hungover, can you help me recover?"*
> *"Cooking Hyderabadi biryani tonight, what do I need?"*

…and a verified cart from the nearest darkstore lands ready to slide-to-pay. Two reusable ideas
power the experience:

1. **Conversational cart builder** : a multi-turn chat where the LLM asks at most one or two
   clarifying questions, then commits a cart of real product IDs.
2. **Smart preloaded carts** : context-aware notifications (Valentine's Day, rainy evening, exam
   week, missed Saturday milk run) that pre-build a cart for an upcoming moment. Today they're
   curated; the [`ml-mock/`](./ml-mock) package shows how a per-user pattern miner would drive them.

---

## What's in the box

| Folder | Contents |
| ------ | -------- |
| `src/`               | React 18 application — pages, components, Zustand store, mock catalog. |
| `server/`            | Express backend that talks to OpenRouter and validates LLM output. |
| `public/images/`     | Local product photos (used by the catalog when present). |
| `ml-mock/`           | Design-only scaffolding for the future pattern-based recommender. Not wired to the running app — read it as a spec, not as code. |

---

## Demo flow

![Demo Flow](public/images/Demo%20Flow%20Amazon%20fresh.png)

---

## Tech stack

| Layer            | What we use today                          | Why |
| ---------------- | ------------------------------------------ | --- |
| UI framework     | React 18 + Vite 6                          | Fast dev loop, small footprint. |
| Styling          | Tailwind CSS 4 + inline tokens             | Tailwind for layout, inline `style={{}}` for dark-theme tokens. |
| Animation        | Framer Motion                              | Springs and AnimatePresence for pages and overlays. |
| State            | Zustand                                    | Single flat store, no Redux ceremony for an app this size. |
| Icons            | lucide-react                               | Consistent stroke icons, no emoji anywhere. |
| Backend          | Node 18+ / Express 4                       | One file (`server/index.js`), one process. |
| LLM gateway      | OpenRouter (default model: `deepseek/deepseek-chat`) | OpenAI-compatible API; switching models is an env var. |
| Catalog          | Static JSON-ish module (`src/data/products.js`) | 55 products, 12 with real local photos. |
| Tooling          | ESLint via Vite, no test runner yet        | Hackathon scope. |

---

## Quick start

### Prerequisites

- Node 18 or newer
- An [OpenRouter](https://openrouter.ai/keys) API key (free tier works for low traffic)

### Steps

```bash
# 1. install
git clone https://github.com/Ayush-Aditya/Amazon-Now-reinventing-quick-commerce.git
cd Amazon-Now-reinventing-quick-commerce
npm install
cd server && npm install && cd ..

# 2. configure the LLM
cp server/.env.example server/.env
# edit server/.env and paste your OPENROUTER_API_KEY

# 3. run two processes (two terminals)
cd server && npm start          # Express on :3001
npm run dev                     # Vite on :3000  (auto-opens the browser)
```

Vite proxies `/api/*` to `http://localhost:3001`, so the frontend just calls relative URLs.
Health check: <http://localhost:3001/api/health>.

### Environment variables

```ini
# server/.env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=deepseek/deepseek-chat   # any OpenAI-compatible model on OpenRouter
PORT=3001                                  # optional
```

---

## Project layout

```
├── public/
│   └── images/                    # real product photos (URL-encoded filenames)
├── src/
│   ├── App.jsx                    # phone-frame container + screen switcher
│   ├── main.jsx                   # entry
│   ├── index.css                  # tailwind + a few keyframes
│   ├── store/
│   │   └── useStore.js            # zustand store: navigation / cart / chat / order
│   ├── data/
│   │   ├── products.js            # mock darkstore catalog + local image overrides
│   │   └── preloadedCarts.js      # curated smart carts shown on the notifications page
│   ├── pages/
│   │   ├── HomePage.jsx           # composes the home sections
│   │   ├── CartPage.jsx           # Blinkit-style checkout
│   │   ├── TrackingPage.jsx       # delivery tracking with stylized map
│   │   └── NotificationsPage.jsx  # smart-carts list
│   └── components/
│       ├── Layout/FloatingAIButton.jsx
│       ├── Home/                  # Header, NotificationBanner, DeliveryBanner,
│       │                          # CategoryGrid, PromoBanner, OrderAgain, HotDeals
│       ├── AI/ChatOverlay.jsx     # Gemini-style chat sheet
│       ├── Cart/SlideToPay.jsx    # drag-to-pay button
│       ├── Cart/PaymentSuccess.jsx
│       └── ProductImage.jsx       # smart <img> with SVG fallback on error
├── server/
│   ├── index.js                   # Express app + OpenRouter call + validation
│   ├── data/
│   │   └── darkstore.js           # server-side mirror of the catalog (id, name, price)
│   └── .env.example
├── ml-mock/                       # design notes for the pattern-based recommender
│   ├── README.md                  # pipeline overview
│   ├── architecture.md            # deeper notes (storage, privacy, eval)
│   ├── schemas/
│   ├── sample-data/
│   ├── pipelines/                 # 5 stub stages (collector → miner → scorer → recommender → notifier)
│   └── server-routes.mock.js
├── PLAN.md                        # detailed hackathon planning document
├── package.json
├── vite.config.js
└── README.md
```

---

## How the prototype works

### Frontend

A single `<App>` renders one of four screens (`home | cart | tracking | notifications`) inside a
hard 390 × 844 phone-frame `<div>`. Page switching is driven by a string in the Zustand store,
not by URLs — clean for a prototype, but a known production gap (see [Roadmap](#roadmap--next-iterations)).

Visual themes:

- **Home / cart / tracking** → light, Blinkit-inspired (`#F4F6F8` page, white cards, green accents).
- **Chat overlay** → Gemini-inspired (`#131314` canvas, sharp top edge, soft radial glow at the
  bottom, a single Amazon-orange accent).
- **Notification banner** (Valentine's) → pink gradient with floating animated hearts.

All product imagery routes through `<ProductImage>`, which tries the catalog `image` URL first and
falls back to an inline-SVG branded card on error. That means the UI never shows a broken image
icon, even if a CDN goes flaky.

### Backend & the LLM contract

The server is one Express file. The conversational endpoint is intentionally stateless — the
client posts the running message history each turn, so we never have to reconcile sessions:

```
POST /api/conversation
  body:  { messages: [ { role: 'user' | 'assistant', content: string } ] }
  reply: { action: 'ask' | 'cart',
           message: string,
           products: [{ id, qty }],
           enrichedProducts: [{ id, name, price, image, qty }],
           suggestions: [string] }
```

The system prompt is built once at boot. It instructs the model to:

- act as "Cart AI" for a 10-minute Indian darkstore;
- ask at most one or two clarifying questions before committing a cart;
- recommend **only** product IDs from the catalog, which we attach to the prompt as a compact
  list of `{id, name, category, price}` (no images, ever — see below);
- return strict JSON matching the schema.

Auxiliary endpoints (used for tests and a future native client):

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET    | `/api/products`              | full catalog (or `?category=` filter) |
| GET    | `/api/products/:id`          | single product by id |
| POST   | `/api/validate-products`     | given `{ ids: [] }`, return which ones exist |
| GET    | `/api/health`                | liveness + which model is in use |

### Anti-hallucination

LLMs invent products if you let them. Three layers stop it from ever reaching the UI:

1. **Prompt scope** — the model only sees IDs, names, categories and prices. It never sees images.
2. **Server-side filter** — every ID the model returns is checked against `darkstoreCatalog`.
   Unknown IDs are silently dropped before the response is sent.
3. **Schema downgrade** — if the model said `action: "cart"` but every ID was invalid, the server
   downgrades to `"ask"` so the UI doesn't render an empty cart card.

A fourth layer in the frontend: `useStore.setCart()` runs the same id-check before the cart is
even rendered. By the time you can tap an item, it has been validated twice.

### State management

Zustand, single store, no slicing. Sections are grouped with comments rather than files:

- **navigation** — `currentScreen`, `setScreen()`
- **cart** — `cartItems` (resolved product objects, not just ids), `cartSource`, `setCart()`,
  `updateQty()`, `removeItem()`, `getCartTotal()`
- **chat overlay** — only the open/close flag is global; messages live in `<ChatOverlay>` local
  state because they don't need to survive a route change
- **order tracking** — `orderActive`, `orderStep` (0 = ordered, 1 = packing, 2 = out for delivery)
- **payment success** — `paymentSuccess` flag for the confetti overlay

---

## Pattern-based recommender (`ml-mock/`)

Today, smart carts are curated. Tomorrow, we want them **earned**: a per-user pattern miner that
learns rhythms ("milk every Tue/Thu/Sat morning", "atta every ~14 days", "chai-and-pakora kit on
rainy evenings") and acts on them — pre-load the cart on Saturday morning, ping the user if the
milk run was missed by lunch.

`ml-mock/` is the **design** for that system. Nothing in it runs in the live app. It exists so
the architecture is committed to before code is, and so contributors can read the pipeline
top-to-bottom in one sitting.

### Pipeline

```
                     ┌─────────────────────┐
                     │ 1. Event Collector  │  every order  →  append to event log
                     └─────────┬───────────┘
                               ▼
                     ┌─────────────────────┐
                     │ 2. Pattern Miner    │  nightly  →  six detectors run in parallel
                     └─────────┬───────────┘  (weekday / interval / monthly /
                               ▼               co-occurrence / weather / seasonal)
                     ┌─────────────────────┐
                     │ 3. Pattern Scorer   │  blend support + recency + lift,
                     └─────────┬───────────┘  compute next-expected timestamps
                               ▼
                     ┌─────────────────────┐
                     │ 4. Recommender      │  on demand  →  home picks + smart carts
                     └─────────┬───────────┘
                               ▼
                     ┌─────────────────────┐
                     │ 5. Notif Scheduler  │  cron every 30 min  →  push notifications
                     └─────────────────────┘
```

### Pattern types

| Type                  | Example                                                          |
| --------------------- | ---------------------------------------------------------------- |
| `periodic_weekday`    | "Milk every Tue / Thu / Sat morning"                             |
| `periodic_interval`   | "Atta roughly every 14 days"                                     |
| `monthly`             | "Detergent on the 1st of every month"                            |
| `cooccurrence`        | "Whenever they buy bread, they buy butter"                       |
| `contextual_weather`  | "Chai + pakora kit on rainy evenings"                            |
| `seasonal`            | "Roses on Feb 14, sweets around Diwali"                          |

The detectors are intentionally specialised and explainable, not one big neural net — see
[`ml-mock/architecture.md`](./ml-mock/architecture.md) for the rationale. Every pattern carries a
human-readable reason (`"You usually buy this on Tue / Thu / Sat"`) that ships with the
recommendation, because trust is the bottleneck for adoption.

### Schema highlights

Two canonical shapes hold the whole pipeline together:

- **`OrderEvent`** — one immutable record per confirmed order, with denormalized context
  (weekday, hour, weather, holiday, payday flag, source). See
  [`ml-mock/schemas/order-event.schema.md`](./ml-mock/schemas/order-event.schema.md).
- **`LearnedPattern`** — one row per (user × product × patternType), with `confidence`,
  `recencyScore`, `nextExpected`, and a precomputed `missedThreshold`. See
  [`ml-mock/schemas/learned-pattern.schema.md`](./ml-mock/schemas/learned-pattern.schema.md).

The notification scheduler is cheap because `missedThreshold` is precomputed: a range scan finds
overdue patterns; a quick lookup against the recent event log decides whether to push.

---

## From hackathon prototype to production on AWS

Every component that currently lives in a JSON file or localhost process has a real AWS-shaped successor.
Nothing about the frontend or the LLM contract needs to change to get there.

## Migration Map

![Migration Map](public/images/migration%20map%20amazon.png)

| Hackathon (today)                          | Production on AWS                                                            |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| Static catalog in `src/data/products.js`   | **DynamoDB** single-table `Products` (PK `productId`), with stream replication to **OpenSearch** for search & vector lookups |
| Server-side mirror in `server/data/`       | Removed : server reads from DynamoDB / OpenSearch directly |
| Product images in `public/images/`         | **S3** bucket fronted by **CloudFront**, with image-optimisation Lambda@Edge |
| OpenRouter for the LLM                     | **Amazon Bedrock** (Claude 3.5 Haiku via `InvokeModel`); same JSON contract, only the SDK call changes |
| `server/index.js` Express on `localhost`   | **ECS Fargate** behind **API Gateway** + **WAF**, autoscaled by target tracking on RPS |
| Frontend served by Vite dev server         | **S3 static hosting** + **CloudFront** with HTTPS, SPA fallback to `index.html` |
| `preloadedCarts.js` curated list           | **DynamoDB** `SmartCarts` table, written by the recommender (stage 4 of the ml pipeline) |
| `ml-mock/` design package                  | Real implementation: see the per-component plan below |
| No auth                                    | **Cognito** user pools + hosted UI, SDK on the client, signed JWT to the API |
| Plain-text `.env` for the API key          | **AWS Secrets Manager** for the Bedrock IAM role; nothing on disk in the container |
| `console.log` for everything               | **CloudWatch Logs** + **CloudWatch Metrics** + **X-Ray** for tracing the chat round-trip |

## Reference Architecture

![Architecture Diagram](public/images/fresh%20architecture%20diagram.png)

```
                                            ┌──────────────────────┐
       ┌──────────────────┐                  │   Amazon Bedrock     │
       │   Cognito User   │                  │   (Claude 3.5 Haiku) │
       │      Pools       │                  └──────────┬───────────┘
       └────────┬─────────┘                             │
                │ JWT                                   │ InvokeModel
                ▼                                       │
   ┌──────────────────────┐    HTTPS    ┌──────────────────────────┐
   │  CloudFront + WAF    │ ─────────▶  │   API Gateway → Fargate   │ ◀─── Secrets Manager
   │  (S3 static SPA)     │             │   (Express container)     │      (Bedrock IAM role)
   └──────────────────────┘             └─────────┬─────────────────┘
                                                  │
              ┌───────────────────────────────────┼─────────────────────────────────┐
              ▼                                   ▼                                 ▼
   ┌──────────────────────┐         ┌──────────────────────┐           ┌──────────────────────┐
   │   ElastiCache Redis  │ hot     │  DynamoDB            │ catalog   │   OpenSearch         │
   │   - product cache    │ reads   │  - Products          │  +        │   - product search   │
   │   - hot patterns     │         │  - SmartCarts        │  patterns │   - vector embedding │
   │   - session state    │         │  - LearnedPatterns   │           │     for RAG          │
   └──────────────────────┘         │  - OrderEvents (hot) │           └──────────────────────┘
                                    └──────────┬───────────┘
                                               │ DynamoDB Streams
                                               ▼
                                    ┌──────────────────────┐
                                    │  Kinesis Data Streams │ ◀── confirm-order events
                                    └──────────┬───────────┘
                                               ▼
                          ┌────────────────────┴────────────────────┐
                          ▼                                         ▼
                ┌──────────────────────┐                  ┌──────────────────────┐
                │  Firehose → S3 (raw  │                  │  Lambda → SNS Push   │
                │  Parquet, partitioned│                  │  / Pinpoint Campaigns│
                │  by yyyy/mm/dd/user) │                  └──────────────────────┘
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  SageMaker Processing │ ◀── EventBridge schedule (nightly 03:00)
                │  (pattern miner)     │
                └──────────┬───────────┘
                           │ writes patterns
                           ▼
                  back to DynamoDB / Redis
```

## What Gets Cached, What Sits Cold, What Streams

| Tier                | Store              | What lives there                                                | TTL / lifecycle |
| ------------------- | ------------------ | ---------------------------------------------------------------- | ----------------- |
| **Hot cache**       | ElastiCache Redis  | top-N home picks per user, full catalog rows, weather/holiday flags, in-flight chat session keys | seconds to minutes; rebuilt from DynamoDB on miss |
| **Warm operational**| DynamoDB           | `Products`, `LearnedPatterns`, `SmartCarts`, last 30 days of `OrderEvents` (hot partition) | unbounded, with on-demand capacity |
| **Cold archive**    | S3 (Parquet)       | full `OrderEvents` history, partitioned `yyyy/mm/dd/userId` for Athena + SageMaker | lifecycle to Glacier after 1 year |
| **Search / vector** | OpenSearch         | product full-text + embedding index used by the AI for grounding | refreshed via DynamoDB Streams |
| **Image CDN**       | CloudFront → S3    | every product photo, served with long cache headers              | versioned object keys, cache-busted on update |
| **Stream**          | Kinesis Data Streams | live `OrderEvents` between the API and the analytics fan-out  | 24-hour retention, fan-out to multiple consumers |
| **Chunk store**     | S3 (text chunks) + OpenSearch vectors | per-product description chunks, ingredient lists, brand pages fed to Bedrock for RAG | rebuilt nightly |

The chunk store turns Cart AI from a *catalog-faithful* assistant into a
*nutrition-and-ingredient-aware* one: instead of pasting the whole catalog into the prompt,
we embed each product's textual context, retrieve the top-K chunks by similarity, and pass only those into Bedrock.

### Per-component plan

#### 1. Conversational AI: OpenRouter → Amazon Bedrock

The OpenRouter call in `server/index.js` is a single `fetch` to an OpenAI-compatible endpoint.
Switching to Bedrock changes only the SDK call; the system prompt, schema, anti-hallucination
filter, and frontend stay byte-identical.

```js
// today (OpenRouter)
const aiResp = await fetch(OPENROUTER_URL, { headers: { Authorization: `Bearer ${KEY}` }, ... });

// production (Bedrock)
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });
const out = await bedrock.send(new InvokeModelCommand({
  modelId: 'anthropic.claude-3-5-haiku-20241022-v1:0',
  body: JSON.stringify({ anthropic_version: 'bedrock-2023-05-31',
                          max_tokens: 1024,
                          system: SYSTEM_PROMPT,
                          messages: formatted })
}));
```

Bedrock gives us: provisioned throughput when traffic justifies it, IAM-based auth instead of API
keys, CloudWatch metrics out of the box, and the option to fine-tune Claude on accepted
conversations once we have data.

#### 2. Catalog: JSON module → DynamoDB + OpenSearch

`src/data/products.js` becomes a build-time export of seed data. The runtime catalog lives in
DynamoDB (`Products` table, `productId` as PK, GSI on `category`). DynamoDB Streams replicate
every write to OpenSearch for full-text search and vector similarity. The frontend's compile-time
import becomes a `GET /api/products` call, with ETag caching.

#### 3. Order events: write-once log

Every confirmed order writes one immutable `OrderEvent` to Kinesis Data Streams. Two consumers
fan out:

- Firehose → S3 (Parquet, partitioned by date and user) for analytics and the SageMaker miner.
- Lambda → DynamoDB (hot 30-day window) for the home page "based on your past orders" rail.

This is exactly the boundary `ml-mock/pipelines/01-event-collector.mock.js` describes.

#### 4. Patterns: nightly SageMaker job

Stages 2 and 3 of the ml-mock pipeline (miner + scorer) become a single SageMaker Processing
job triggered by EventBridge at 03:00 local time per region. Input: the last 90 days of events
from S3. Output: a fresh `LearnedPatterns` table in DynamoDB, plus a top-N projection in Redis
for sub-millisecond reads on the home page.

For small scale (the first 100k users) this can run as a Lambda fan-out instead of SageMaker;
the choice is purely about cost vs throughput.

#### 5. Notifications: EventBridge cron + SNS / Pinpoint

Stage 5 of the ml-mock pipeline becomes:

- An EventBridge rule that triggers a Lambda every 30 minutes.
- The Lambda scans `LearnedPatterns` for `missedThreshold < now`, joins against the recent-event
  partition to skip patterns the user already fulfilled, applies cooldown rules.
- Surviving notifications are handed to **Pinpoint** (for engagement campaigns and segmentation)
  or **SNS** (for raw push). Pinpoint is the better choice once we want analytics on which
  notification copy converts.

#### 6. Frontend hosting

`npm run build` produces a static SPA in `dist/`. That goes to an S3 bucket fronted by
CloudFront. SPA fallback (`/cart`, `/tracking` 404s rewrite to `/index.html`). Bundle size today
is ~108 KB gzipped — well within a single CloudFront request.

#### 7. Auth, secrets, observability

- **Cognito** user pools for sign-in (Google/Apple/email). Issues JWTs. API Gateway validates them
  before they reach Fargate.
- **Secrets Manager** holds the Bedrock IAM credentials and any third-party tokens. Containers
  read at boot and on rotation events.
- **CloudWatch + X-Ray** trace each chat round-trip end-to-end. Latency budget: 1.5 seconds at
  p95 for the model call; everything else within 200 ms.

#### 8. Privacy

The pattern miner is per-user. Cross-user training is opt-in and lives behind a separate service.
Order data is encrypted at rest with KMS-managed keys; PII fields (delivery address, phone) are
never copied into the OrderEvent payload — only a hashed `userId` and a coarse pincode. Macie
watches the S3 bucket for accidental PII leaks.

---

## Roadmap & Next Iterations

| Priority | Milestone | What it unlocks |
| -------- | --------- | --------------- |
| 🔴 P0 | **Migrate LLM to Amazon Bedrock** | Drop OpenRouter dependency, gain IAM auth, provisioned throughput, CloudWatch metrics |
| 🔴 P0 | **Authentication via Cognito** | Protect the `/api/conversation` route, enable per-user order history |
| 🟠 P1 | **Real-time catalog from DynamoDB + OpenSearch** | Replace static JSON with a live, searchable product database |
| 🟠 P1 | **Implement the pattern-based recommender** | Ship the `ml-mock/` pipeline as a SageMaker Processing job, power personalized smart carts |
| 🟡 P2 | **Voice input** | Enable speech-to-text in the chat via Web Speech API for hands-free cart building |
| 🟡 P2 | **Telemetry & analytics** | Track AI suggestion accept rate, time-to-cart, notification conversion to measure real impact |
| 🟢 P3 | **TypeScript migration** | Gradual type safety starting from the store and server for long-term maintainability |
| 🟢 P3 | **Test suite** | Unit tests for JSON parsing, cart validation, and anti-hallucination rules |

---

## Honest hackathon context

This is a **two-day hackathon prototype** built on a vague brief, with no access to real
darkstore APIs or order data. Everything you see is mocked or simulated:

- the catalog is a hand-written JSON literal of 55 products;
- the AI is a thin wrapper around OpenRouter — the schema, the validation, and the UI are the
  novel parts;
- the order-tracking timer is a `setInterval`;
- the pattern recommender is a design package with stubbed pipelines;
- there's no auth, no real database, no payment gateway.

What it **is**, and what I think holds up:

- A working end-to-end conversational shopping flow with strict anti-hallucination guarantees.
- A polished, animated UI that reads as a real product, not a wireframe.
- A clear architecture story for graduating each mocked component to AWS without rewriting the
  frontend or the LLM contract.
- A serious design pass on the recommender, with the algorithms, schemas, and failure modes
  written down before any code gets baked in.

If this were the start of a real product instead of a hackathon submission, the
[Roadmap](#roadmap--next-iterations) and the
[per-component AWS plan](#per-component-plan) above are the path forward.
