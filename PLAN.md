# Amazon Fresh AI - HackOn with Amazon Season 6.0

## Theme: Amazon Now – Reimagining Urgent Shopping

## 🎯 Core Concept

A stunning mockup of Amazon Fresh (quick-commerce) with two AI-powered features:
1. **Conversational AI Cart Builder** – Users tap a mic/AI button, describe what they need in natural language, the AI cross-questions 2-3 times, then builds a cart with real products from the mock darkstore.
2. **Preloaded Smart Cart Notifications** – Context-aware push notifications with pre-built carts (Valentine's Day, daily groceries, weekend party packs, etc.)

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + Tailwind CSS + Framer Motion | Smooth animations, fast dev, production-quality UI |
| Backend | Node.js + Express | Simple API layer for mock darkstore |
| AI/Conversational | Amazon Bedrock (Claude via API) | Required AWS service, handles multi-turn conversation |
| Notifications | Mock notification system (frontend) | Simulates push notifications |
| Payment | Mock payment gateway | Slide-to-pay animation → order confirmation |
| Maps | Static mock map with delivery animation | Simulates real-time delivery tracking |

---

## 📱 Screens & User Flow

### Screen 1: Home Page (Amazon Fresh Clone)
- Top banner with location + delivery time ("10 min delivery")
- Search bar
- Category icons row (Fruits, Veggies, Snacks, Drinks, etc.)
- "Previously Ordered" section with past cart cards
- "Deals of the Day" section
- **Floating AI/Mic Button** (bottom-right, pulsing animation)
- **Notification bell** with badge count

### Screen 2: AI Conversation Mode
- Full-screen overlay with chat bubbles
- Typing indicator animation
- Voice input button (mic icon with pulse)
- AI asks clarifying questions (2-3 rounds max)
- Smooth transition to cart when conversation ends

### Screen 3: Smart Cart View
- "Here's your cart" header with item count
- Product cards with images, quantities, prices
- Cart total with savings highlight
- **"Swipe to Buy" slider** (smooth haptic-feel animation)
- Edit/remove items option

### Screen 4: Payment Confirmation
- Brief loading animation
- "Order Placed!" success screen
- Order details summary

### Screen 5: Delivery Tracking
- Mock map with animated delivery route
- Driver icon moving on path
- "Arriving in ~10 minutes" with countdown
- Order summary below map

### Screen 6: Notification Center
- List of preloaded cart notifications
- Each notification expandable → shows cart contents
- "Add All to Cart" button per notification

---

## 🤖 Conversational AI Examples (Mock Darkstore Scenarios)

### Scenario 1: Friends Coming Over
```
User: "Some friends are coming over, add snacks and drinks for 4-5 people"
AI: "Got it! Would you prefer cold drinks or juices?"
User: "Cold drinks"
AI: "Any preference on snacks — chips & dips, or a mix of namkeen and cookies?"
User: "Mix of everything"
AI: "Anything else you'd like to add?"
User: "No, that's it"
→ Cart: Coca-Cola 1.5L x2, Sprite 1.5L, Lay's Party Pack, Kurkure x3, Hide & Seek cookies, Haldiram's Namkeen Mix, Paper cups x10
→ Total: ₹847
```

### Scenario 2: Stomach Upset / Khichdi
```
User: "My stomach is upset, I want to cook khichdi. Which pulses should I use?"
AI: "For khichdi, moong dal (yellow lentils) works best — it's light and easy to digest. Should I add rice and basic spices too?"
User: "Yes please"
AI: "I'll add moong dal, basmati rice, turmeric, cumin, and ghee. Want me to add ORS or any digestive medicine?"
User: "Add ORS"
→ Cart: Moong Dal 500g, Basmati Rice 1kg, Turmeric powder, Cumin seeds, Ghee 200ml, Electral ORS x3
→ Total: ₹412
```

### Scenario 3: Hangover Recovery
```
User: "I'm suffering from a hangover, create a cart to help me"
AI: "I'll put together a recovery kit. Do you prefer lime water or coconut water for hydration?"
User: "Coconut water"
AI: "Got it. Adding hydration, electrolytes, light carbs, and a painkiller. Anything else?"
User: "No"
→ Cart: Coconut Water x3, Gatorade Lemon x2, White Bread, Bananas 6pc, Crocin Advance x1, Maggi x2
→ Total: ₹523
```

### Scenario 4: Hyderabadi Biryani
```
User: "I'm cooking Hyderabadi biryani, which rice should I use? Add it to cart"
AI: "For authentic Hyderabadi biryani, use aged Basmati rice (long grain). Shall I add the complete biryani masala kit too?"
User: "Yes, full kit"
AI: "Adding rice, whole spices, yogurt, onions, mint, and saffron. For how many people?"
User: "6 people"
→ Cart: Aged Basmati Rice 2kg, Biryani Masala, Yogurt 400g, Onions 1kg, Fresh Mint, Saffron 1g, Bay leaves, Cardamom, Cloves, Cinnamon sticks, Ghee 500ml
→ Total: ₹934
```

---

## 🔔 Preloaded Cart Notifications (Examples)

| Event/Context | Notification Text | Cart Contents |
|---------------|------------------|---------------|
| Valentine's Day | "💝 Valentine's Day is tomorrow! We've got a gift cart ready for your special someone" | Red Roses bouquet, Ferrero Rocher box, Greeting Card, Scented Candle |
| Daily Grocery | "🥛 Good morning! Your daily essentials are ready — tap to reorder" | Milk 1L, Bread, Eggs 6pc, Bananas |
| Weekend Party | "🎉 Weekend plans? Party cart ready for 6 people" | Chips x4, Cold drinks x6, Dips, Napkins, Ice |
| Rainy Day | "🌧️ Rainy evening! Hot chai & pakora kit ready" | Tea leaves, Ginger, Besan, Onions, Green chillies, Biscuits |
| Exam Season | "📚 Late night study session? Brain food cart ready" | Coffee sachets x5, Dark chocolate, Almonds, Instant noodles x3, Energy bars |
| Monday Morning | "☀️ Start your week right — breakfast cart ready" | Oats, Milk, Fruits, Juice, Honey |

---

## 🎨 Design Requirements (Critical for Video Demo)

### Animations & Transitions
1. **AI Button** – Floating button with subtle pulse/glow animation
2. **Chat Overlay** – Slides up from bottom with backdrop blur
3. **Message Bubbles** – Appear with spring animation (like iMessage)
4. **Cart Reveal** – Items slide in one-by-one from right
5. **Swipe to Pay** – Slider with gradient trail + haptic feedback visual
6. **Order Confirmation** – Confetti/checkmark animation
7. **Map Delivery** – Animated dot moving along a curved path
8. **Notifications** – Slide in from top with bell shake

### Color Palette
- Primary: Amazon Orange (#FF9900)
- Secondary: Dark Blue (#232F3E)
- Background: White (#FFFFFF)
- Cards: Light Gray (#F5F5F5)
- Success: Green (#00A651)
- AI Accent: Gradient (Orange → Yellow)

### Typography
- Headers: Bold, 24-32px
- Body: Regular, 14-16px
- Font: Inter or Amazon Ember (use Inter as substitute)

---

## 📁 Project Structure

```
amazon-fresh-ai/
├── public/
│   ├── images/
│   │   ├── products/          # Product photos (mock)
│   │   ├── banners/           # Homepage banners
│   │   ├── categories/        # Category icons
│   │   ├── map/               # Mock delivery map
│   │   └── icons/             # UI icons
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   └── FloatingAIButton.jsx
│   │   ├── Home/
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── CategoryRow.jsx
│   │   │   ├── PreviousOrders.jsx
│   │   │   ├── DealsSection.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── AI/
│   │   │   ├── ChatOverlay.jsx
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── VoiceInput.jsx
│   │   │   └── AICartTransition.jsx
│   │   ├── Cart/
│   │   │   ├── CartView.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── SwipeToPay.jsx
│   │   ├── Order/
│   │   │   ├── OrderConfirmation.jsx
│   │   │   └── DeliveryTracking.jsx
│   │   └── Notifications/
│   │       ├── NotificationBell.jsx
│   │       ├── NotificationPanel.jsx
│   │       └── PreloadedCartCard.jsx
│   ├── data/
│   │   ├── products.js         # Mock product catalog (darkstore)
│   │   ├── conversations.js    # AI conversation flows
│   │   ├── preloadedCarts.js   # Notification cart data
│   │   └── previousOrders.js   # Past order history
│   ├── hooks/
│   │   ├── useConversation.js  # AI chat logic
│   │   └── useCart.js          # Cart state management
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CartPage.jsx
│   │   ├── OrderPage.jsx
│   │   └── NotificationsPage.jsx
│   ├── services/
│   │   ├── bedrockService.js   # Amazon Bedrock integration
│   │   └── darkstoreAPI.js     # Mock darkstore product matching
│   ├── utils/
│   │   ├── productMatcher.js   # Strict product ID matching (anti-hallucination)
│   │   └── animations.js       # Shared animation configs
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── index.js                # Express server
│   ├── routes/
│   │   ├── products.js         # Product catalog API
│   │   ├── conversation.js     # Bedrock conversation proxy
│   │   └── notifications.js    # Push notification mock
│   └── data/
│       └── darkstore.json      # Full product database
├── package.json
├── tailwind.config.js
├── vite.config.js
├── PLAN.md
└── README.md
```

---

## 🛡️ Anti-Hallucination Strategy

The AI MUST NOT invent products. Enforcement:
1. AI conversation prompt includes: "Only recommend products from the provided catalog"
2. Backend validates every product against darkstore DB by `productId`
3. If AI suggests something not in catalog → fallback to closest match
4. Final cart is assembled server-side using strict product ID lookup
5. User sees actual product names, images, and prices from our mock DB

---

## 🔑 Amazon Bedrock Integration (Structured JSON Output)

### Can Bedrock Be Used? YES — Here's How:

Even though you don't need raw text output from the LLM, Bedrock models (Claude 3.5 Sonnet/Haiku) excel at **Structured JSON Output**. You feed the LLM your Mock Darkstore Catalog as part of its system prompt. Instead of making up text, the LLM:
1. Processes the user's conversational intent
2. Maps it to precise `product_id`s in your catalog
3. Returns a clean JSON array with product IDs and quantities

Your frontend takes those IDs, instantly matches them against your local database to grab the **mock image URLs, prices, and titles**, and renders them dynamically in the UI alongside the suggestions.

### Flow:
1. User speaks/types their need
2. Frontend sends message to backend `/api/conversation`
3. Backend calls Amazon Bedrock (Claude via `InvokeModel` API) with:
   - System prompt containing: conversation rules, product catalog JSON, strict matching instructions
   - Conversation history
   - Output format: `{ "action": "ask" | "cart", "message": "...", "products": [{"id": "SD-001", "qty": 2}] }`
4. Bedrock responds with structured JSON:
   - `action: "ask"` → Frontend shows AI question, continues conversation
   - `action: "cart"` → Frontend uses product IDs to pull images/prices from local DB and renders cart
5. **Images come from YOUR local darkstore database** (matched by product_id), NOT from the LLM
6. Backend validates every product_id against darkstore before returning to frontend

### System Prompt for Bedrock:
```
You are an Amazon Fresh shopping assistant. You help users build grocery carts.

RULES:
1. ONLY suggest products from the provided catalog (below)
2. Ask 2-3 clarifying questions max before building the cart
3. Always respond in JSON format: {"action": "ask"|"cart", "message": "string", "products": [{"id": "string", "qty": number}]}
4. Never invent product names or IDs not in the catalog
5. Be conversational and helpful in your messages

PRODUCT CATALOG:
[... your darkstore JSON here ...]
```

### Fallback (if Bedrock unavailable during demo):
- Pre-scripted conversation flows in `conversations.js`
- Frontend can run entirely on mock data for smooth demo video
- The HTML prototype already works standalone without any API

---

## 📋 Implementation Priority

### Phase 1: Foundation (First 4-6 hours)
- [ ] Project setup (Vite + React + Tailwind + Framer Motion)
- [ ] Mock product database with images
- [ ] Home page UI (header, categories, products, banners)
- [ ] Bottom navigation

### Phase 2: Core AI Feature (Next 6-8 hours)
- [ ] Floating AI button with animation
- [ ] Chat overlay with message bubbles
- [ ] Conversation flow logic (mock first, Bedrock later)
- [ ] Cart generation from conversation
- [ ] Smooth transition from chat → cart view

### Phase 3: Cart & Payment (Next 4-6 hours)
- [ ] Cart page with product cards
- [ ] Swipe-to-pay animation
- [ ] Order confirmation screen
- [ ] Delivery tracking with mock map

### Phase 4: Notifications (Next 3-4 hours)
- [ ] Notification bell with badge
- [ ] Notification panel
- [ ] Preloaded cart cards (Valentine, daily, etc.)
- [ ] "Add All to Cart" functionality

### Phase 5: Polish & Integration (Remaining time)
- [ ] Amazon Bedrock integration (real API)
- [ ] Smooth all animations
- [ ] Add product images
- [ ] Record demo video
- [ ] Test all flows end-to-end

---

## 🎬 Demo Video Script (2-3 min)

1. **Open app** → Show beautiful homepage (2 sec)
2. **Tap AI button** → Chat opens with animation (2 sec)
3. **Type/speak**: "Friends coming over, add snacks for 5" (3 sec)
4. **AI asks**: "Cold drinks or juices?" → User: "Cold drinks" (4 sec)
5. **AI asks**: "Anything else?" → User: "No" (3 sec)
6. **Cart appears** → Items slide in with prices (3 sec)
7. **Swipe to pay** → Smooth slider animation (2 sec)
8. **Order confirmed** → Map shows delivery route, "10 min" (3 sec)
9. **Show notification** → "Valentine's cart ready!" → Tap → See pre-built cart (4 sec)
10. **End** → Quick montage of other scenarios (khichdi, biryani, hangover) (5 sec)

---

## 📸 Images Needed

### Products (can use placeholder/stock images)
- Beverages: Coca-Cola, Sprite, Gatorade, Coconut Water, Juice boxes
- Snacks: Lay's, Kurkure, Cookies, Namkeen, Chocolates
- Groceries: Rice, Dal, Bread, Milk, Eggs, Fruits, Vegetables
- Spices: Turmeric, Cumin, Biryani masala, Bay leaves
- Medicine: Crocin, ORS, Paracetamol
- Special: Roses, Greeting cards, Candles

### UI Assets
- Amazon Fresh logo (mock)
- Category icons (fruits, veggies, snacks, drinks, medicine, etc.)
- Homepage banners (deals, offers)
- Delivery person avatar
- Map background

### Approach for Images
- Use high-quality product images from free stock photo sites
- Generate category icons using simple SVGs
- For the map, use a static screenshot styled image
- Banners can be designed in-app with gradients and text

---

## ⚡ Key Technical Decisions

1. **Mobile-first design** – Build as if it's a mobile app (375px viewport, use phone frame for video)
2. **Framer Motion for all animations** – Consistent, smooth, 60fps
3. **Zustand for state management** – Lightweight, perfect for this scope
4. **Mock-first, real-later** – Everything works on mock data; Bedrock is additive
5. **No authentication** – Skip login for hackathon (assume logged-in user)
6. **SVG/emoji for icons** – Fast, no external icon library bloat

---

## 🚀 Commands to Get Started

```bash
npm create vite@latest amazon-fresh-ai -- --template react
cd amazon-fresh-ai
npm install tailwindcss @tailwindcss/vite framer-motion zustand
npm install express cors  # for backend
npm run dev
```

---

## 📄 Solution Document Mapping (for Jury Submission)

### Innovativeness & Theme Alignment
- Directly addresses "How might we help customers discover, decide, and purchase in the fastest way possible?"
- Novel: Conversational commerce + contextual pre-built carts = zero-friction shopping
- No existing quick-commerce app does AI-powered contextual cart building

### Quality of Implementation
- End-to-end working prototype with all flows
- Real Amazon Bedrock integration for AI conversations
- Smooth animations that demonstrate production readiness

### Tech Architecture
- Amazon Bedrock for conversational AI
- Strict product matching prevents hallucination
- Scalable: darkstore API pattern works with real inventory systems

### Scalability
- Architecture supports adding real inventory APIs
- Notification engine can integrate with ML models for personalization
- Multi-language support possible via Bedrock

### Futuristic Vision
- Voice-first shopping becomes default for quick-commerce
- Predictive carts based on calendar, weather, health data
- Social carts (friends can collaboratively build party carts)
- Integration with IoT (smart fridge detects low milk → auto-suggest cart)
