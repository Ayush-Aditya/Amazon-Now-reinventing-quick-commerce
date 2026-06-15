import { motion } from 'framer-motion';
import {
  ArrowLeft, Heart, Coffee, CloudRain, BookOpen, Sun, Users,
  Sparkles, ChevronRight, Bell, Check
} from 'lucide-react';
import useStore from '../store/useStore';
import { preloadedCarts } from '../data/preloadedCarts';
import { darkstoreDB } from '../data/products';
import ProductImage from '../components/ProductImage';

// "Smart Carts" page — replaces the bell drawer with a full screen.
// Each row is a contextual cart that's been pre-built (Valentine's,
// rainy day kit, exam fuel, ...). Tapping a row loads that cart and
// jumps to checkout.
//
// The data lives in src/data/preloadedCarts.js. Eventually the ml-mock
// pipeline will produce these rows per-user instead of being hardcoded.

const STROKE   = '#ECEEF1';
const TEXT     = '#1F2937';
const TEXT_SOFT = '#6B7280';
const PAGE_BG  = '#F4F6F8';

// Lookup table: per-cart icon + colour theme. Cart ids must match the ones
// in preloadedCarts.js. Anything missing falls through to a grey Bell tile.
const THEMES = {
  'valentine':       { Icon: Heart,     bg: '#FCE7F3', fg: '#BE185D' },
  'daily-grocery':   { Icon: Coffee,    bg: '#DCFCE7', fg: '#0C831F' },
  'rainy-day':       { Icon: CloudRain, bg: '#DBEAFE', fg: '#1E40AF' },
  'exam-season':     { Icon: BookOpen,  bg: '#FFEDD5', fg: '#C2410C' },
  'monday-morning':  { Icon: Sun,       bg: '#FEF9C3', fg: '#A16207' },
  'weekend-party':   { Icon: Users,     bg: '#EDE9FE', fg: '#6D28D9' }
};

export default function NotificationsPage() {
  const { setScreen, setCart } = useStore();

  // Split into "today" vs "scheduled" — first 3 today, rest scheduled
  const today = preloadedCarts.slice(0, 3);
  const upcoming = preloadedCarts.slice(3);

  function handleCartClick(cart) {
    setCart(cart.items, cart.title);
    setScreen('cart');
  }

  return (
    <div className="h-full flex flex-col" style={{ background: PAGE_BG }}>

      {/* HEADER */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          background: '#FFFFFF',
          borderBottom: `1px solid ${STROKE}`,
          position: 'sticky', top: 0, zIndex: 10
        }}
      >
        <button
          onClick={() => setScreen('home')}
          className="flex items-center justify-center cursor-pointer border-none bg-transparent active:scale-90 transition-transform"
          style={{
            width: 36, height: 36,
            background: '#F4F6F8',
            borderRadius: '50%'
          }}
        >
          <ArrowLeft size={18} className="text-gray-800" strokeWidth={2.2} />
        </button>

        <div className="flex-1">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, letterSpacing: '-0.2px' }}>
            Smart Carts
          </h2>
          <p style={{ fontSize: 11, color: TEXT_SOFT, marginTop: 1 }}>
            {preloadedCarts.length} curated by Cart AI
          </p>
        </div>

        <button
          className="flex items-center gap-1 cursor-pointer border-none bg-transparent active:scale-95 transition-transform"
          style={{ color: '#0C831F', fontSize: 12, fontWeight: 600 }}
        >
          <Check size={13} strokeWidth={2.4} />
          Mark all read
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ paddingBottom: 16 }}>

        {/* TODAY */}
        <SectionLabel>Today</SectionLabel>
        <div style={{ padding: '0 12px' }}>
          {today.map((cart, i) => (
            <CartNotification
              key={cart.id}
              cart={cart}
              index={i}
              onOpen={() => handleCartClick(cart)}
            />
          ))}
        </div>

        {/* SCHEDULED */}
        {upcoming.length > 0 && (
          <>
            <SectionLabel>Coming up</SectionLabel>
            <div style={{ padding: '0 12px' }}>
              {upcoming.map((cart, i) => (
                <CartNotification
                  key={cart.id}
                  cart={cart}
                  index={i + today.length}
                  onOpen={() => handleCartClick(cart)}
                  scheduled
                />
              ))}
            </div>
          </>
        )}

        {/* Footer hint */}
        <div
          className="mx-3 mt-2 flex items-start gap-2.5"
          style={{
            background: '#FFFFFF',
            border: `1px solid ${STROKE}`,
            borderRadius: 12,
            padding: '12px 14px'
          }}
        >
          <span
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 28, height: 28,
              background: '#FFF7E6',
              borderRadius: '50%'
            }}
          >
            <Sparkles size={13} className="text-[#FF9900]" strokeWidth={2.4} />
          </span>
          <div className="flex-1">
            <p style={{ fontSize: 12.5, fontWeight: 600, color: TEXT }}>
              These carts are AI-curated
            </p>
            <p style={{ fontSize: 11, color: TEXT_SOFT, marginTop: 2, lineHeight: '15px' }}>
              Cart AI watches the calendar, weather, and your past orders to preload carts that match the moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Label
function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: TEXT_SOFT,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        padding: '14px 16px 8px'
      }}
    >
      {children}
    </p>
  );
}

// Cart Notification Card
function CartNotification({ cart, index, onOpen, scheduled }) {
  const theme = THEMES[cart.id] || { Icon: Bell, bg: '#F3F4F6', fg: '#374151' };
  const { Icon } = theme;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onOpen}
      className="cursor-pointer active:scale-[0.99] transition-transform"
      style={{
        background: '#FFFFFF',
        border: `1px solid ${STROKE}`,
        borderRadius: 14,
        marginBottom: 10,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* subtle left accent stripe in theme color */}
      <div
        style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: 3,
          background: theme.fg
        }}
      />

      <div className="flex items-start gap-3" style={{ padding: '14px 14px 0 16px' }}>
        {/* Icon */}
        <span
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 38, height: 38,
            background: theme.bg,
            borderRadius: 10
          }}
        >
          <Icon size={17} color={theme.fg} strokeWidth={2.3} />
        </span>

        {/* Title + body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: TEXT,
                letterSpacing: '-0.2px',
                lineHeight: '17px'
              }}
            >
              {cart.title}
            </p>
            <span
              className="flex-shrink-0"
              style={{ fontSize: 10.5, color: TEXT_SOFT, fontWeight: 500 }}
            >
              {cart.time}
            </span>
          </div>
          <p
            style={{
              fontSize: 11.5,
              color: TEXT_SOFT,
              lineHeight: '16px',
              marginTop: 4
            }}
          >
            {cart.body}
          </p>
        </div>
      </div>

      {/* Product preview stack */}
      <div className="flex items-center justify-between" style={{ padding: '12px 14px 14px 16px' }}>
        <div className="flex items-center" style={{ paddingLeft: 50 }}>
          {cart.items.slice(0, 4).map((item, j) => {
            const product = darkstoreDB[item.id];
            if (!product) return null;
            return (
              <div
                key={j}
                className="flex items-center justify-center"
                style={{
                  width: 36, height: 36,
                  background: '#FFFFFF',
                  border: `1.5px solid #FFFFFF`,
                  borderRadius: 9,
                  padding: 4,
                  marginLeft: j === 0 ? 0 : -10,
                  boxShadow: '0 1px 4px rgba(15,17,17,0.10)',
                  zIndex: 10 - j
                }}
              >
                <ProductImage
                  product={product}
                  className="object-contain"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </div>
            );
          })}
          {cart.items.length > 4 && (
            <div
              className="flex items-center justify-center"
              style={{
                width: 32, height: 32,
                background: '#1F2937',
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 800,
                borderRadius: 9,
                marginLeft: -10,
                border: '1.5px solid #FFFFFF',
                boxShadow: '0 1px 4px rgba(15,17,17,0.10)'
              }}
            >
              +{cart.items.length - 4}
            </div>
          )}
        </div>

        {/* CTA pill */}
        {scheduled ? (
          <span
            style={{
              fontSize: 11,
              color: TEXT_SOFT,
              fontWeight: 600,
              letterSpacing: 0.2
            }}
          >
            Tap to preview
          </span>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            className="flex items-center cursor-pointer border-none active:scale-95 transition-transform"
            style={{
              gap: 2,
              padding: '7px 12px',
              fontSize: 11.5,
              fontWeight: 700,
              color: theme.fg,
              background: theme.bg,
              border: `1px solid ${theme.fg}30`,
              borderRadius: 999,
              letterSpacing: '-0.1px'
            }}
          >
            View cart
            <ChevronRight size={12} strokeWidth={2.6} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
