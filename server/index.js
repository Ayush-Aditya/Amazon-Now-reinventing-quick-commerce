import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { darkstoreCatalog, getProductById } from './data/darkstore.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// OpenRouter is OpenAI-compatible, so we just call /chat/completions with a
// bearer token. Pick any model you like via OPENROUTER_MODEL — DeepSeek-Chat
// is the current default because it returns valid JSON reliably and the free
// Llama tiers were rate-limiting upstream.
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL   = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat';
const OPENROUTER_URL     = 'https://openrouter.ai/api/v1/chat/completions';

// The whole anti-hallucination strategy is in this prompt + the post-call
// validation below. The model never sees images or full product objects —
// only ids, names, categories and prices. Whatever ids it returns get
// filtered against the catalog before the frontend sees them, so a made-up
// id physically cannot reach the UI.
const compactCatalog = darkstoreCatalog.map(p => ({
  id: p.id, name: p.name, category: p.category, price: p.price
}));

const SYSTEM_PROMPT = `You are "Cart AI", Amazon Fresh's conversational shopping assistant for a 10-minute darkstore in India.

YOUR JOB
- Understand what the user needs (a meal, a party, recovery from a hangover, late-night study, daily groceries, etc.).
- Ask AT MOST 1-2 short clarifying questions before recommending a cart. If intent is already clear, skip straight to the cart.
- Recommend ONLY products that exist in the CATALOG below. Never invent product names or IDs.
- Keep messages short, professional and helpful. Indian English tone.
- Do NOT use emojis or decorative symbols anywhere in your replies, suggestions, or messages. Plain text only.

OUTPUT FORMAT (STRICT)
You MUST respond with a single valid JSON object and nothing else. The schema is:
{
  "action": "ask" | "cart",
  "message": string,            // Conversational reply shown to the user
  "products": [                 // Empty array when action="ask"
    { "id": "<CATALOG_ID>", "qty": <integer> >= 1 }
  ],
  "suggestions": [string]       // Optional: 2-3 short reply chips for the user (max 4 words each). Empty array if none.
}

RULES
- Use action="ask" while you still need info or want to offer choices via "suggestions".
- Use action="cart" when you are ready to commit a final recommendation. The frontend will render product cards and let the user confirm.
- Quantities should be sensible for the use-case. Don't overstock.
- Prefer 5-10 items per cart unless the user asks for less.
- If the user asks for something outside groceries/snacks/health/celebration, politely steer back.

CATALOG (only valid product IDs):
${JSON.stringify(compactCatalog)}
`;

// Some models still wrap JSON in ``` fences or add a stray sentence.
// We try a strict parse, then a fenced-block parse, then a desperate
// regex grab. Returns null only if all three fail.
function safeParseJson(text) {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  try { return JSON.parse(candidate); } catch { /* fall through */ }
  const m = candidate.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch { /* fall through */ } }
  return null;
}

// Coerce whatever the model returned into our schema and drop any product
// id that isn't in the catalog. If the model said "cart" but every id was
// invalid, downgrade to "ask" so the UI doesn't render an empty cart card.
function normalizeAiPayload(parsed, fallbackMessage) {
  const out = {
    action: parsed?.action === 'cart' ? 'cart' : 'ask',
    message: typeof parsed?.message === 'string' && parsed.message.trim()
      ? parsed.message.trim()
      : fallbackMessage || 'Tell me a bit more about what you need.',
    products: [],
    suggestions: Array.isArray(parsed?.suggestions)
      ? parsed.suggestions.filter(s => typeof s === 'string').slice(0, 4)
      : []
  };

  if (Array.isArray(parsed?.products)) {
    out.products = parsed.products
      .map(p => ({ id: String(p?.id || '').trim(), qty: Math.max(1, parseInt(p?.qty, 10) || 1) }))
      .filter(p => getProductById(p.id));
  }

  if (out.action === 'cart' && out.products.length === 0) out.action = 'ask';
  return out;
}

// Hydrate the validated id list into full product objects so the frontend
// gets prices, names, images in a single round-trip.
function enrichProducts(products) {
  return products
    .map(p => {
      const product = getProductById(p.id);
      return product ? { ...product, qty: p.qty } : null;
    })
    .filter(Boolean);
}

// Single conversational endpoint. The frontend posts the running message
// history each turn (stateless from the server's point of view) and gets
// back the next AI turn ready to render.
app.post('/api/conversation', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const formatted = messages.map(m => ({
      role: m.role === 'ai' ? 'assistant' : (m.role === 'assistant' ? 'assistant' : 'user'),
      content: typeof m.content === 'string' ? m.content : (m.text || '')
    })).filter(m => m.content);

    // Soft-fail when the key is missing rather than 500-ing — keeps the UI
    // showing a useful message during local dev before the env is filled in.
    if (!OPENROUTER_API_KEY) {
      return res.status(200).json({
        action: 'ask',
        message: 'AI is not configured yet. Please set OPENROUTER_API_KEY in server/.env to enable real conversations.',
        products: [], enrichedProducts: [], suggestions: [],
        _fallback: true
      });
    }

    const aiResp = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        // OpenRouter ranks/credits requests by Referer + Title; harmless
        // for local dev but worth setting.
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Amazon Fresh AI'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...formatted],
        temperature: 0.4,                              // a little creative, mostly steady
        response_format: { type: 'json_object' }       // hint, not all models honour it
      })
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error('OpenRouter error', aiResp.status, errText);
      return res.status(200).json({
        action: 'ask',
        message: 'Hmm, I had trouble reaching the AI just now. Mind trying again?',
        products: [], enrichedProducts: [], suggestions: [],
        _fallback: true, _error: `OpenRouter ${aiResp.status}`
      });
    }

    const data    = await aiResp.json();
    const aiText  = data?.choices?.[0]?.message?.content || '';
    const parsed  = safeParseJson(aiText) || { action: 'ask', message: aiText };
    const payload = normalizeAiPayload(parsed, 'Tell me more about what you need.');

    res.json({ ...payload, enrichedProducts: enrichProducts(payload.products) });
  } catch (err) {
    console.error('Conversation handler error:', err);
    res.status(200).json({
      action: 'ask',
      message: 'Something went wrong on my side. Try again in a sec?',
      products: [], enrichedProducts: [], suggestions: [],
      _fallback: true, _error: err.message
    });
  }
});

// Catalog endpoints — the React app doesn't actually use these (it imports
// the catalog directly from src/data/products.js), but they're handy for
// debugging and for an eventual mobile/native client.
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  res.json(category ? darkstoreCatalog.filter(p => p.category === category) : darkstoreCatalog);
});

app.get('/api/products/:id', (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/validate-products', (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: 'ids array required' });
  const valid   = ids.filter(id => getProductById(id) !== null);
  const invalid = ids.filter(id => getProductById(id) === null);
  res.json({ valid, invalid, validCount: valid.length });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Amazon Fresh AI Backend',
    model: OPENROUTER_MODEL,
    aiConfigured: Boolean(OPENROUTER_API_KEY),
    catalogSize: darkstoreCatalog.length,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Amazon Fresh AI server listening on http://localhost:${PORT}`);
  console.log(`  catalog : ${darkstoreCatalog.length} products`);
  console.log(`  model   : ${OPENROUTER_MODEL}`);
  console.log(`  api key : ${OPENROUTER_API_KEY ? 'configured' : 'MISSING (set OPENROUTER_API_KEY in server/.env)'}`);
});
