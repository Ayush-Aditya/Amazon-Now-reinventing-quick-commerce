import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, ShoppingCart, Loader2, Plus, Image, Camera, FileText, Film, Mic } from 'lucide-react';
import useStore from '../../store/useStore';
import { darkstoreDB } from '../../data/products';
import ProductImage from '../ProductImage';

// The chat is fully self-contained: messages live in component state
// (not the global store) and the only thing in the store for chat is the
// open/close flag. Each turn POSTs the running history to /api/conversation
// and renders the AI response.
//
// Three render modes share this single component:
//   1. empty state  → big "What can I help you find?" + 4 starter prompt cards
//   2. running chat → message bubbles + optional inline product carousel
//   3. typing       → small "Thinking..." indicator
//
// Visual language is loosely Gemini: dark canvas, sharp top edge, soft
// radial glow at the bottom, one subtle accent in Amazon orange.

// Gemini-inspired palette
const BG_BASE       = '#131314';
const SURFACE_LOW = '#1E1F20';
const SURFACE_MID = '#282A2C';
const BORDER = 'rgba(255,255,255,0.10)';
const BORDER_STRONG = 'rgba(255,255,255,0.18)';
const TEXT_PRIMARY = 'rgba(255,255,255,0.92)';
const TEXT_SECONDARY = 'rgba(255,255,255,0.62)';
const TEXT_TERTIARY = 'rgba(255,255,255,0.40)';
const ACCENT = '#FF9900';

const STARTERS = [
  "Friends coming over, snacks for 5",
  "I'm hungover, help me recover",
  "Cooking Hyderabadi biryani tonight",
  "Late night exam study fuel"
];

const GREETING = "What can I help you find?";
const SUBGREETING = "Tell me about a meal, a party, or your daily essentials and I will match products from your nearest darkstore.";

export default function ChatOverlay() {
  const { isChatOpen, closeChat, setScreen, setCart } = useStore();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  // attachment menu state — click + to reveal options. We open the OS file
  // picker on selection but never read the file: the AI can't process it
  // yet, this is here so the affordance is in place.
  const [attachOpen, setAttachOpen] = useState(false);
  const [attachedHint, setAttachedHint] = useState(null);  // {kind, name} or null
  const fileInputRef  = useRef(null);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const audioInputRef  = useRef(null);
  const attachMenuRef  = useRef(null);

  // close the attachment menu on outside click
  useEffect(() => {
    if (!attachOpen) return;
    const onDocDown = (e) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target)) {
        setAttachOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [attachOpen]);

  // briefly show "attached <filename>" so the user sees their pick was
  // registered, then quietly drop it. Real processing comes later.
  function handlePicked(kind, fileList) {
    const file = fileList?.[0];
    if (!file) return;
    setAttachedHint({ kind, name: file.name });
    setAttachOpen(false);
    setTimeout(() => setAttachedHint(null), 2200);
  }

  useEffect(() => {
    if (isChatOpen) {
      setMessages([]);
      setInput('');
      setIsSending(false);
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const newUserMsg = { role: 'user', text: trimmed };
    const nextMessages = [...messages, newUserMsg];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    const payload = nextMessages
      .filter(m => m.role === 'user' || m.role === 'ai')
      .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));

    try {
      const resp = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload })
      });
      const data = await resp.json();

      setMessages(prev => [...prev, {
        role: 'ai',
        text: data.message || '...',
        products: data.action === 'cart' ? (data.enrichedProducts || []) : [],
        suggestions: data.suggestions || []
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: "I could not reach the AI. Please make sure the server is running on port 3001.",
        isError: true
      }]);
    } finally {
      setIsSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleConfirmCart(products) {
    if (!products || products.length === 0) return;
    const cartItems = products.map(p => ({ id: p.id, qty: p.qty }));
    setCart(cartItems, 'AI-Compiled Cart • Verified from Darkstore');
    closeChat();
    setTimeout(() => setScreen('cart'), 350);
  }

  const isEmpty = messages.length === 0 && !isSending;

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="absolute inset-0 z-[300] flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeChat(); }}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            className="w-full flex flex-col overflow-hidden relative"
            style={{
              height: '95%',
              background: BG_BASE,
              borderRadius: 0,                         // sharp top, per spec
              fontFamily: '"Google Sans Text","Inter",system-ui,sans-serif'
            }}
          >
            {/* Soft radial glow behind the welcome (Gemini vibe) */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: 0,
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 90%, rgba(80,118,255,0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,153,0,0.10), transparent 60%)'
              }}
            />

            {/* header */}
            <div
              className="relative flex items-center justify-between flex-shrink-0"
              style={{
                paddingLeft: 18,
                paddingRight: 10,
                paddingTop: 12,
                paddingBottom: 12,
                borderBottom: `1px solid ${BORDER}`
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  style={{
                    color: TEXT_PRIMARY,
                    fontSize: 16,
                    fontWeight: 500,
                    letterSpacing: '-0.2px'
                  }}
                >
                  Cart AI
                </span>
                <span
                  className="flex items-center gap-1"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.6px',
                    color: '#34D399',
                    background: 'rgba(52,211,153,0.10)',
                    border: '1px solid rgba(52,211,153,0.35)',
                    padding: '2px 6px',
                    borderRadius: 999,
                    lineHeight: 1
                  }}
                >
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%', background: '#34D399',
                    animation: 'blink 1.5s ease-in-out infinite'
                  }} />
                  LIVE
                </span>
              </div>

              <button
                onClick={closeChat}
                className="flex items-center justify-center cursor-pointer border-none active:scale-90 transition-transform"
                style={{
                  width: 36, height: 36,
                  background: 'transparent',
                  borderRadius: '50%',
                  color: TEXT_SECONDARY
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE_LOW; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <X size={18} />
              </button>
            </div>

            {/* messages, or empty state when no turn has been sent yet */}
            <div
              ref={messagesRef}
              className="relative flex-1 overflow-y-auto no-scrollbar"
              style={{
                paddingLeft: 18,
                paddingRight: 18,
                paddingTop: 16,
                paddingBottom: 16
              }}
            >
              {isEmpty ? (
                <EmptyState onPick={(t) => sendMessage(t)} />
              ) : (
                <div className="flex flex-col gap-5">
                  {messages.map((msg, i) => (
                    <MessageBubble
                      key={i}
                      msg={msg}
                      onSuggestion={(t) => sendMessage(t)}
                      onConfirm={handleConfirmCart}
                      isLast={i === messages.length - 1}
                    />
                  ))}
                  {isSending && <ThinkingIndicator />}
                </div>
              )}
            </div>

            {/* input pill — single rounded bar holds plus, input and send */}
            <div
              className="relative flex-shrink-0"
              style={{
                paddingLeft: 14,
                paddingRight: 14,
                paddingTop: 10,
                paddingBottom: 14
              }}
            >
              {/* tiny pill that confirms "we got your file" */}
              <AnimatePresence>
                {attachedHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="flex items-center gap-2"
                    style={{
                      marginBottom: 8,
                      padding: '6px 10px',
                      background: SURFACE_LOW,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 999,
                      fontSize: 11.5,
                      color: TEXT_SECONDARY,
                      width: 'fit-content'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: TEXT_PRIMARY }}>
                      {attachedHint.kind} attached
                    </span>
                    <span style={{ color: TEXT_TERTIARY, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {attachedHint.name}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* attachment menu, anchored above the + button */}
              <AnimatePresence>
                {attachOpen && (
                  <motion.div
                    ref={attachMenuRef}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute"
                    style={{
                      left: 14,
                      bottom: 80,
                      minWidth: 220,
                      background: SURFACE_LOW,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 14,
                      padding: 6,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3)',
                      zIndex: 10
                    }}
                  >
                    <AttachMenuItem
                      Icon={Image}
                      label="Photos"
                      hint="from gallery"
                      onClick={() => photoInputRef.current?.click()}
                    />
                    <AttachMenuItem
                      Icon={Camera}
                      label="Camera"
                      hint="take a picture"
                      onClick={() => cameraInputRef.current?.click()}
                    />
                    <AttachMenuItem
                      Icon={Film}
                      label="Videos"
                      hint="up to 60 seconds"
                      onClick={() => videoInputRef.current?.click()}
                    />
                    <AttachMenuItem
                      Icon={Mic}
                      label="Voice note"
                      hint="record or upload"
                      onClick={() => audioInputRef.current?.click()}
                    />
                    <div style={{ height: 1, background: BORDER, margin: '4px 8px' }} />
                    <AttachMenuItem
                      Icon={FileText}
                      label="Files"
                      hint="any document"
                      onClick={() => fileInputRef.current?.click()}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* hidden inputs the menu items click. We never read the
                  resulting file — Cart AI is text-only for now — but the
                  affordance is wired so the demo feels real. */}
              <input ref={photoInputRef}  type="file" accept="image/*"        hidden onChange={(e) => handlePicked('Photo', e.target.files)} />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => handlePicked('Photo', e.target.files)} />
              <input ref={videoInputRef}  type="file" accept="video/*"        hidden onChange={(e) => handlePicked('Video', e.target.files)} />
              <input ref={audioInputRef}  type="file" accept="audio/*"        hidden onChange={(e) => handlePicked('Voice note', e.target.files)} />
              <input ref={fileInputRef}   type="file"                          hidden onChange={(e) => handlePicked('File', e.target.files)} />

              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-center gap-2"
                style={{
                  background: SURFACE_LOW,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 28,
                  padding: '6px 6px 6px 8px',
                  transition: 'border-color 0.15s, background 0.15s'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = BORDER_STRONG; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; }}
              >
                {/* + opens an attachment menu */}
                <button
                  type="button"
                  onClick={() => setAttachOpen(v => !v)}
                  aria-label="Add attachment"
                  className="flex items-center justify-center flex-shrink-0 cursor-pointer border-none active:scale-90 transition-transform"
                  style={{
                    width: 32, height: 32,
                    borderRadius: '50%',
                    background: attachOpen ? SURFACE_MID : 'transparent',
                    color: attachOpen ? TEXT_PRIMARY : TEXT_SECONDARY
                  }}
                >
                  <Plus
                    size={17}
                    style={{
                      transition: 'transform 0.18s ease',
                      transform: attachOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                    }}
                  />
                </button>

                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Cart AI"
                  disabled={isSending}
                  className="flex-1 bg-transparent border-none outline-none disabled:opacity-50"
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: TEXT_PRIMARY,
                    lineHeight: '20px',
                    minWidth: 0
                  }}
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  className="flex items-center justify-center border-none cursor-pointer flex-shrink-0 active:scale-90 transition-all disabled:cursor-not-allowed"
                  style={{
                    width: 32, height: 32,
                    background: input.trim() ? ACCENT : 'transparent',
                    color: input.trim() ? '#FFFFFF' : TEXT_TERTIARY,
                    borderRadius: '50%'
                  }}
                >
                  {isSending
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Send size={14} />}
                </button>
              </form>

              <p
                className="text-center"
                style={{
                  fontSize: 10.5,
                  marginTop: 8,
                  color: TEXT_TERTIARY,
                  letterSpacing: 0.1
                }}
              >
                Cart AI matches strictly from your nearest darkstore catalog.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Empty state — large welcome prompt with starter chips beneath. Shown
// only until the user fires the first message.

function EmptyState({ onPick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.4, 1] }}
      className="relative h-full flex flex-col"
      style={{ paddingTop: 32 }}
    >
      {/* Headline */}
      <h2
        style={{
          color: TEXT_PRIMARY,
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: '-0.6px',
          lineHeight: '34px',
          marginBottom: 10
        }}
      >
        {GREETING}
      </h2>
      <p
        style={{
          color: TEXT_SECONDARY,
          fontSize: 13.5,
          fontWeight: 400,
          lineHeight: '20px',
          letterSpacing: '-0.1px'
        }}
      >
        {SUBGREETING}
      </p>

      {/* Starter cards (text only — no icons / drawings) */}
      <div
        className="grid grid-cols-2"
        style={{ gap: 10, marginTop: 28 }}
      >
        {STARTERS.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => onPick(s)}
            className="text-left cursor-pointer active:scale-[0.98] transition-all"
            style={{
              background: SURFACE_LOW,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: '14px 14px 16px',
              color: TEXT_PRIMARY,
              fontSize: 13,
              fontWeight: 400,
              lineHeight: '18px',
              letterSpacing: '-0.1px',
              minHeight: 88
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = SURFACE_MID;
              e.currentTarget.style.borderColor = BORDER_STRONG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = SURFACE_LOW;
              e.currentTarget.style.borderColor = BORDER;
            }}
          >
            {s}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// One chat row. User messages render as a right-aligned bubble; AI
// messages render text-flow style (no avatar, no bubble background) so
// the page reads more like a Gemini transcript than an iMessage thread.

function MessageBubble({ msg, onSuggestion, onConfirm, isLast }) {
  const isUser = msg.role === 'user';

  if (isUser) {
    // User: subtle elevated bubble, right-aligned
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex justify-end"
      >
        <div
          style={{
            maxWidth: '85%',
            background: SURFACE_MID,
            color: TEXT_PRIMARY,
            padding: '10px 16px',
            borderRadius: '20px 20px 6px 20px',
            fontSize: 14,
            lineHeight: '20px',
            fontWeight: 400,
            letterSpacing: '-0.1px',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap'
          }}
        >
          {msg.text}
        </div>
      </motion.div>
    );
  }

  // AI: clean text-flow style (no avatar drawing), small label + body
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col"
      style={{ gap: 8 }}
    >
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: '0.6px',
          color: TEXT_TERTIARY,
          textTransform: 'uppercase'
        }}
      >
        Cart AI
      </span>

      <div
        style={{
          color: TEXT_PRIMARY,
          fontSize: 14,
          lineHeight: '22px',
          fontWeight: 400,
          letterSpacing: '-0.1px',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}
      >
        {msg.text}
      </div>

      {msg.products && msg.products.length > 0 && (
        <ProductCarousel products={msg.products} onConfirm={onConfirm} />
      )}

      {isLast && msg.suggestions && msg.suggestions.length > 0 && (!msg.products || msg.products.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap"
          style={{ gap: 8, marginTop: 4 }}
        >
          {msg.suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSuggestion(s)}
              className="cursor-pointer active:scale-95 transition-all"
              style={{
                padding: '8px 14px',
                fontSize: 12.5,
                fontWeight: 400,
                color: TEXT_PRIMARY,
                background: SURFACE_LOW,
                border: `1px solid ${BORDER}`,
                borderRadius: 999
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE_MID; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = SURFACE_LOW; }}
            >
              {s}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// Inline product carousel rendered after an AI message when action="cart".
// Images come from the local darkstore by id, never from the LLM.

function ProductCarousel({ products, onConfirm }) {
  const subtotal = products.reduce((sum, p) => {
    const local = darkstoreDB[p.id];
    const price = local?.price ?? p.price ?? 0;
    return sum + price * p.qty;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      style={{
        marginTop: 4,
        background: SURFACE_LOW,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${BORDER}`
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '0.6px',
            color: TEXT_TERTIARY,
            textTransform: 'uppercase'
          }}
        >
          {products.length} item{products.length > 1 ? 's' : ''} from darkstore
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY }}>
          ₹{subtotal}
        </span>
      </div>

      {/* Rail */}
      <div className="flex overflow-x-auto no-scrollbar" style={{ gap: 10, padding: 12 }}>
        {products.map((p, i) => {
          const local = darkstoreDB[p.id] || p;
          return (
            <motion.div
              key={p.id + i}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.25 }}
              className="flex-shrink-0"
              style={{ width: 104 }}
            >
              <div
                className="flex items-center justify-center relative"
                style={{
                  width: 104, height: 104,
                  background: '#FFFFFF',
                  borderRadius: 12,
                  padding: 8
                }}
              >
                <ProductImage product={local} className="object-contain" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                {p.qty > 1 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6, right: 6,
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      background: 'rgba(15,17,17,0.85)',
                      padding: '2px 7px',
                      borderRadius: 999,
                      lineHeight: 1
                    }}
                  >
                    ×{p.qty}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: 11.5,
                  marginTop: 8,
                  color: TEXT_PRIMARY,
                  fontWeight: 500,
                  lineHeight: '15px',
                  letterSpacing: '-0.1px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {local.name}
              </p>
              <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_PRIMARY, display: 'block', marginTop: 2 }}>
                ₹{local.price}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ padding: '4px 12px 12px' }}>
        <button
          onClick={() => onConfirm(products)}
          className="w-full cursor-pointer active:scale-[0.99] transition-all border-none flex items-center justify-center"
          style={{
            gap: 8,
            padding: '12px 0',
            fontSize: 13.5,
            fontWeight: 600,
            color: '#FFFFFF',
            background: ACCENT,
            borderRadius: 999,
            letterSpacing: '-0.1px'
          }}
        >
          <ShoppingCart size={14} />
          Add all to cart · ₹{subtotal}
        </button>
      </div>
    </motion.div>
  );
}

// One row inside the attachment popup. Pure visual — onClick is supplied
// by the parent and just opens a hidden file input.

function AttachMenuItem({ Icon, label, hint, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center w-full cursor-pointer border-none active:scale-[0.99] transition-transform"
      style={{
        gap: 12,
        padding: '8px 10px',
        background: 'transparent',
        borderRadius: 10,
        textAlign: 'left'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE_MID; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 30, height: 30,
          borderRadius: 8,
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${BORDER}`,
          color: TEXT_PRIMARY
        }}
      >
        <Icon size={14} />
      </span>
      <span className="flex-1 min-w-0">
        <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY, letterSpacing: '-0.1px' }}>
          {label}
        </span>
        <span style={{ display: 'block', fontSize: 11, color: TEXT_TERTIARY, marginTop: 1 }}>
          {hint}
        </span>
      </span>
    </button>
  );
}

// Three-dot "Thinking..." row shown while we wait for the LLM.

function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col"
      style={{ gap: 8 }}
    >
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: '0.6px',
          color: TEXT_TERTIARY,
          textTransform: 'uppercase'
        }}
      >
        Cart AI
      </span>
      <div className="flex items-center" style={{ gap: 5 }}>
        <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: TEXT_SECONDARY }} />
        <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: TEXT_SECONDARY, animationDelay: '0.2s' }} />
        <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: TEXT_SECONDARY, animationDelay: '0.4s' }} />
        <span style={{
          marginLeft: 10,
          fontSize: 12,
          color: TEXT_TERTIARY,
          fontWeight: 400,
          letterSpacing: '-0.1px'
        }}>
          Thinking...
        </span>
      </div>
    </motion.div>
  );
}
