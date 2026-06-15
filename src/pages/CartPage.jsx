import { motion } from 'framer-motion';
import { ArrowLeft, Search, Plus, Minus, Heart, Home, ChevronRight, Clock } from 'lucide-react';
import useStore from '../store/useStore';
import SlideToPay from '../components/Cart/SlideToPay';
import { darkstoreDB } from '../data/products';
import ProductImage from '../components/ProductImage';

// Curated picks for the "You might also like" rail - prefers products with local images
const SUGGESTION_IDS = ['BB-005', 'BB-004', 'SD-003', 'GE-005', 'HP-002', 'CB-001', 'SD-001'];

const RADIUS = 12;
const CARD_BG = '#FFFFFF';
const PAGE_BG = '#F4F6F8';
const STROKE = '#ECEEF1';
const TEXT = '#1F2937';
const TEXT_SOFT = '#6B7280';
const BLINKIT_GREEN = '#0C831F';

export default function CartPage() {
  const { cartItems, cartSource, setScreen, updateQty, getCartTotal } = useStore();
  const totals = getCartTotal();

  const inCartIds = new Set(cartItems.map(it => it.id));
  const suggestions = SUGGESTION_IDS
    .map(id => darkstoreDB[id])
    .filter(p => p && !inCartIds.has(p.id))
    .slice(0, 6);

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

        <h2
          className="flex-1"
          style={{ fontSize: 17, fontWeight: 700, color: TEXT, letterSpacing: '-0.2px' }}
        >
          Checkout
        </h2>

        <button
          className="flex items-center justify-center cursor-pointer border-none bg-transparent active:scale-90 transition-transform"
          style={{
            width: 36, height: 36,
            background: '#F4F6F8',
            borderRadius: '50%'
          }}
        >
          <Search size={17} className="text-gray-800" strokeWidth={2.2} />
        </button>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ paddingBottom: 8 }}>

        {/* ---------- SHIPMENT CARD ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-3 mt-3"
          style={{
            background: CARD_BG,
            borderRadius: RADIUS,
            border: `1px solid ${STROKE}`,
            overflow: 'hidden'
          }}
        >
          {/* Cart source chip */}
          {cartSource && (
            <div
              className="flex items-center gap-1.5 px-4 py-2"
              style={{
                background: '#E8F7EE',
                borderBottom: `1px solid ${STROKE}`
              }}
            >
              <span
                className="flex items-center justify-center"
                style={{
                  width: 14, height: 14,
                  background: BLINKIT_GREEN,
                  borderRadius: 3
                }}
              >
                <span style={{ width: 5, height: 5, background: 'white', borderRadius: 1 }} />
              </span>
              <span style={{ fontSize: 11, color: BLINKIT_GREEN, fontWeight: 600 }}>
                {cartSource}
              </span>
            </div>
          )}

          {/* Delivery time row */}
          <div className="flex items-center gap-2 px-4 pt-3 pb-2">
            <span
              className="flex items-center justify-center"
              style={{
                width: 26, height: 26,
                background: '#E8F7EE',
                borderRadius: '50%'
              }}
            >
              <Clock size={14} className="text-[#0C831F]" strokeWidth={2.4} />
            </span>
            <div className="flex-1">
              <p style={{ fontSize: 15, fontWeight: 700, color: TEXT, letterSpacing: '-0.2px' }}>
                Delivery in 10 minutes
              </p>
              <p style={{ fontSize: 11, color: TEXT_SOFT, marginTop: 1 }}>
                Shipment of {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Items list */}
          <div>
            {cartItems.map((item, i) => (
              <motion.div
                key={item.id + i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.25 }}
                className="flex items-start gap-3 px-4 py-3"
                style={{ borderTop: `1px solid ${STROKE}` }}
              >
                {/* Image */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 64, height: 64,
                    background: '#F8F9FA',
                    border: `1px solid ${STROKE}`,
                    borderRadius: 10,
                    padding: 6
                  }}
                >
                  <ProductImage
                    product={item}
                    className="object-contain"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: TEXT,
                      lineHeight: '17px',
                      letterSpacing: '-0.1px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.name}
                  </p>
                  <p style={{ fontSize: 11, color: TEXT_SOFT, marginTop: 2 }}>
                    {item.qty} unit{item.qty > 1 ? 's' : ''}
                  </p>
                  <button
                    className="cursor-pointer bg-transparent border-none p-0 mt-1.5 flex items-center gap-1"
                    style={{ color: '#1976D2', fontSize: 11, fontWeight: 600 }}
                  >
                    <Heart size={10} strokeWidth={2.4} />
                    Move to wishlist
                  </button>
                </div>

                {/* Right column: stepper + price */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {/* Qty stepper - Blinkit style */}
                  <div
                    className="flex items-center"
                    style={{
                      background: BLINKIT_GREEN,
                      borderRadius: 8,
                      height: 28,
                      boxShadow: '0 1px 2px rgba(12,131,31,0.25)'
                    }}
                  >
                    <button
                      onClick={() => updateQty(i, -1)}
                      className="cursor-pointer border-none bg-transparent flex items-center justify-center active:bg-white/10 transition-colors"
                      style={{ width: 28, height: 28, color: 'white' }}
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span
                      className="text-center text-white font-extrabold"
                      style={{ minWidth: 22, fontSize: 13 }}
                    >
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(i, 1)}
                      className="cursor-pointer border-none bg-transparent flex items-center justify-center active:bg-white/10 transition-colors"
                      style={{ width: 28, height: 28, color: 'white' }}
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Price - strike + active */}
                  <div className="flex items-baseline gap-1.5">
                    <span style={{ fontSize: 11, color: '#9CA3AF', textDecoration: 'line-through' }}>
                      ₹{Math.round(item.price * item.qty * 1.12)}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ---------- YOU MIGHT ALSO LIKE ---------- */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="mx-3 mt-3"
            style={{
              background: CARD_BG,
              borderRadius: RADIUS,
              border: `1px solid ${STROKE}`,
              overflow: 'hidden'
            }}
          >
            <div className="px-4 pt-4 pb-2">
              <h4 style={{ fontSize: 15, fontWeight: 700, color: TEXT, letterSpacing: '-0.2px' }}>
                You might also like
              </h4>
            </div>
            <div className="flex gap-2.5 px-3 pb-4 overflow-x-auto no-scrollbar">
              {suggestions.map((p) => {
                const oldPrice = Math.round(p.price * 1.13);
                return (
                  <div
                    key={p.id}
                    className="flex-shrink-0 flex flex-col"
                    style={{ width: 112 }}
                  >
                    <div
                      className="relative flex items-center justify-center"
                      style={{
                        width: 112, height: 112,
                        background: '#F8F9FA',
                        border: `1px solid ${STROKE}`,
                        borderRadius: 10,
                        padding: 8
                      }}
                    >
                      <ProductImage
                        product={p}
                        className="object-contain"
                        style={{ maxWidth: '85%', maxHeight: '85%' }}
                      />
                      <button
                        className="absolute cursor-pointer bg-transparent border-none p-0"
                        style={{ top: 6, right: 6 }}
                      >
                        <Heart size={14} className="text-gray-300" strokeWidth={1.8} />
                      </button>
                      {/* ADD button */}
                      <button
                        className="absolute cursor-pointer bg-white"
                        style={{
                          bottom: 6, right: 6,
                          padding: '3px 12px',
                          fontSize: 10.5,
                          fontWeight: 800,
                          color: BLINKIT_GREEN,
                          border: `1.5px solid ${BLINKIT_GREEN}`,
                          borderRadius: 6,
                          letterSpacing: 0.4,
                          lineHeight: '14px'
                        }}
                      >
                        ADD
                      </button>
                    </div>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: TEXT,
                        marginTop: 6,
                        lineHeight: '14px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: 28
                      }}
                    >
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-1" style={{ marginTop: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: TEXT }}>₹{p.price}</span>
                      <span style={{ fontSize: 10, color: '#9CA3AF', textDecoration: 'line-through' }}>
                        ₹{oldPrice}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ---------- BILL DETAILS ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mx-3 mt-3 mb-3"
          style={{
            background: CARD_BG,
            borderRadius: RADIUS,
            border: `1px solid ${STROKE}`,
            padding: 16
          }}
        >
          <h4
            style={{
              fontSize: 14, fontWeight: 700, color: TEXT,
              letterSpacing: '-0.2px', marginBottom: 12
            }}
          >
            Bill details
          </h4>

          <Row label="Items total" value={`₹${totals.subtotal}`} />
          <Row label="Delivery fee" value="FREE" valueColor={BLINKIT_GREEN} valueBold />
          <Row label="Handling charge" value={`₹${totals.tax}`} />

          <div
            className="flex items-center justify-between"
            style={{
              borderTop: `1px dashed ${STROKE}`,
              marginTop: 10, paddingTop: 10
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>
              Bill total
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>
              ₹{totals.total}
            </span>
          </div>
        </motion.div>

        {/* ---------- CANCELLATION POLICY ---------- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mx-3 mb-2 px-4 py-3"
          style={{
            background: CARD_BG,
            borderRadius: RADIUS,
            border: `1px solid ${STROKE}`
          }}
        >
          <p style={{ fontSize: 12.5, fontWeight: 700, color: TEXT, marginBottom: 4 }}>
            Cancellation policy
          </p>
          <p style={{ fontSize: 11, color: TEXT_SOFT, lineHeight: '15px' }}>
            Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided.
          </p>
        </motion.div>

        <div style={{ height: 8 }} />
      </div>

      {/* STICKY ADDRESS BAR */}
      <div
        className="flex items-center gap-2.5 px-4 py-2.5 flex-shrink-0"
        style={{
          background: '#FFF8E1',
          borderTop: `1px solid #FFE7A0`
        }}
      >
        <span
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 32, height: 32,
            background: '#FFD54F',
            borderRadius: 8
          }}
        >
          <Home size={15} className="text-gray-900" strokeWidth={2.3} />
        </span>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: 12.5, fontWeight: 700, color: TEXT }}>
            Delivering to <span style={{ fontWeight: 700 }}>Home</span>
          </p>
          <p
            className="truncate"
            style={{ fontSize: 11, color: TEXT_SOFT, marginTop: 1 }}
          >
            Hostel 4, BIT Mesra 835215
          </p>
        </div>
        <button
          className="flex items-center gap-0.5 cursor-pointer bg-transparent border-none p-0"
          style={{ color: BLINKIT_GREEN, fontSize: 12, fontWeight: 700 }}
        >
          Change
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* SLIDE TO PAY */}
      <SlideToPay total={totals.total} />
    </div>
  );
}

function Row({ label, value, valueColor, valueBold }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '5px 0' }}>
      <span style={{ fontSize: 12.5, color: TEXT_SOFT }}>{label}</span>
      <span
        style={{
          fontSize: 12.5,
          color: valueColor || TEXT,
          fontWeight: valueBold ? 700 : 500
        }}
      >
        {value}
      </span>
    </div>
  );
}
