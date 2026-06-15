import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Phone, Shield, ChevronRight,
  Check, Package, Bike, Maximize2
} from 'lucide-react';
import useStore from '../store/useStore';

const BLINKIT_GREEN = '#0C831F';
const BLINKIT_GREEN_LIGHT = '#1FA661';
const BLINKIT_GREEN_BG = '#E8F7EE';
const STROKE = '#ECEEF1';
const TEXT = '#1F2937';
const TEXT_SOFT = '#6B7280';

export default function TrackingPage() {
  const { setScreen } = useStore();
  const [seconds, setSeconds] = useState(598); // ~10 min
  const [step, setStep] = useState(0);          // 0 ordered → 1 packing → 2 on the way

  useEffect(() => {
    const tick = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    const t1 = setTimeout(() => setStep(1), 3500);
    const t2 = setTimeout(() => setStep(2), 8500);
    return () => { clearInterval(tick); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const minutes = Math.floor(seconds / 60);
  const statusHeadline = step >= 2 ? 'Order is on the way' : step >= 1 ? 'Order is being packed' : 'Order confirmed';
  const subline = step >= 2
    ? `Arriving in ${minutes} minute${minutes !== 1 ? 's' : ''}`
    : step >= 1
      ? `Ready in ${minutes} minute${minutes !== 1 ? 's' : ''}`
      : `Estimated ${minutes} minutes`;

  return (
    <div className="h-full flex flex-col" style={{ background: '#F4F6F8' }}>

      {/* GREEN HEADER */}
      <div
        className="flex-shrink-0 relative"
        style={{
          background: `linear-gradient(180deg, ${BLINKIT_GREEN} 0%, ${BLINKIT_GREEN_LIGHT} 100%)`,
          padding: '14px 16px 18px'
        }}
      >
        <button
          onClick={() => setScreen('home')}
          className="flex items-center justify-center cursor-pointer border-none bg-transparent active:scale-90 transition-transform"
          style={{
            width: 32, height: 32,
            background: 'rgba(255,255,255,0.18)',
            borderRadius: '50%',
            position: 'absolute',
            left: 12,
            top: 14
          }}
        >
          <ArrowLeft size={17} color="#FFFFFF" strokeWidth={2.4} />
        </button>

        <p
          className="text-center"
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 12,
            fontWeight: 500,
            marginBottom: 2,
            letterSpacing: 0.1
          }}
        >
          {statusHeadline}
        </p>
        <h2
          className="text-center"
          style={{
            color: '#FFFFFF',
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.4px'
          }}
        >
          {subline}
        </h2>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ paddingBottom: 16 }}>

        {/* ---------- MAP ---------- */}
        <div
          className="mx-3 mt-3 relative overflow-hidden"
          style={{
            background: '#E5E7EB',
            borderRadius: 14,
            height: 210,
            border: `1px solid ${STROKE}`
          }}
        >
          <StylizedMap step={step} />

          {/* Maximize chip */}
          <button
            className="absolute flex items-center justify-center cursor-pointer border-none active:scale-90 transition-transform"
            style={{
              top: 10, right: 10,
              width: 30, height: 30,
              background: '#FFFFFF',
              borderRadius: '50%',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
            }}
          >
            <Maximize2 size={13} color={TEXT} />
          </button>

          {/* Google attribution mock */}
          <span
            className="absolute"
            style={{
              left: 10, bottom: 8,
              fontSize: 9.5, color: TEXT_SOFT, fontWeight: 600,
              background: 'rgba(255,255,255,0.85)',
              padding: '2px 6px',
              borderRadius: 3,
              letterSpacing: 0.2
            }}
          >
            Google
          </span>
        </div>

        {/* ---------- DELIVERY PARTNER CARD ---------- */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mx-3 mt-3 overflow-hidden"
              style={{
                background: '#FFFFFF',
                borderRadius: 14,
                border: `1px solid ${STROKE}`
              }}
            >
              {/* Top: avatar + name + call */}
              <div className="flex items-center gap-3" style={{ padding: '14px 14px 12px' }}>
                <Avatar />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 14.5, fontWeight: 700, color: TEXT, letterSpacing: '-0.2px' }}>
                    I'm Shekhar, your delivery partner
                  </p>
                  <p style={{ fontSize: 11.5, color: TEXT_SOFT, marginTop: 2 }}>
                    Rider ID #DH-2148 · Bike DL 8C 2401
                  </p>
                </div>
                <button
                  className="flex items-center justify-center cursor-pointer border-none flex-shrink-0 active:scale-90 transition-transform"
                  style={{
                    width: 38, height: 38,
                    background: BLINKIT_GREEN_BG,
                    borderRadius: '50%',
                    border: `1px solid rgba(12,131,31,0.22)`
                  }}
                >
                  <Phone size={16} color={BLINKIT_GREEN} strokeWidth={2.4} />
                </button>
              </div>

              {/* Status pill */}
              <div
                className="flex items-center gap-2"
                style={{
                  margin: '0 12px 12px',
                  padding: '10px 12px',
                  background: BLINKIT_GREEN_BG,
                  borderRadius: 10
                }}
              >
                <span
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 18, height: 18,
                    background: BLINKIT_GREEN,
                    borderRadius: '50%'
                  }}
                >
                  <Check size={11} color="#FFFFFF" strokeWidth={3} />
                </span>
                <span style={{ fontSize: 12, fontWeight: 500, color: BLINKIT_GREEN, lineHeight: '16px' }}>
                  Order picked up. On the way to your address.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- TIP SECTION ---------- */}
        <div
          className="mx-3 mt-3"
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            border: `1px solid ${STROKE}`,
            padding: '14px 14px 14px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <DeliveryIllustration />
          <p
            style={{
              fontSize: 14.5,
              fontWeight: 700,
              color: TEXT,
              letterSpacing: '-0.2px',
              maxWidth: 220,
              lineHeight: '19px'
            }}
          >
            Delivering happiness at your doorstep
          </p>
          <p style={{ fontSize: 11.5, color: TEXT_SOFT, marginTop: 3 }}>
            Thank them by leaving a tip
          </p>

          <div className="flex gap-2 overflow-x-auto no-scrollbar" style={{ marginTop: 12 }}>
            <TipPill amount={20} />
            <TipPill amount={30} mostTipped />
            <TipPill amount={50} />
            <TipPill amount={100} />
            <TipPill custom />
          </div>
        </div>

        {/* ---------- SAFETY BANNER ---------- */}
        <div
          className="mx-3 mt-3 flex items-center gap-2.5 cursor-pointer"
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            border: `1px solid ${STROKE}`,
            padding: '12px 14px'
          }}
        >
          <span
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 30, height: 30,
              background: BLINKIT_GREEN_BG,
              borderRadius: '50%'
            }}
          >
            <Shield size={14} color={BLINKIT_GREEN} strokeWidth={2.4} fill={BLINKIT_GREEN_BG} />
          </span>
          <div className="flex-1">
            <p style={{ fontSize: 12.5, fontWeight: 600, color: TEXT, lineHeight: '16px' }}>
              Your darkstore is only 0.8 km away
            </p>
            <p style={{ fontSize: 11, color: TEXT_SOFT, marginTop: 1 }}>
              Learn about delivery partner safety
            </p>
          </div>
          <ChevronRight size={16} color={TEXT_SOFT} />
        </div>

        {/* ---------- ORDER STAGES ---------- */}
        <div
          className="mx-3 mt-3"
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            border: `1px solid ${STROKE}`,
            padding: '14px 16px 4px'
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: TEXT_SOFT,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              marginBottom: 8
            }}
          >
            Order Status
          </p>

          <Stage
            Icon={Check}
            title="Order placed"
            time="Just now"
            status={step >= 0 ? (step > 0 ? 'done' : 'active') : 'pending'}
          />
          <Stage
            Icon={Package}
            title="Packed at darkstore"
            time={step >= 1 ? 'Done' : 'In progress'}
            status={step >= 1 ? (step > 1 ? 'done' : 'active') : 'pending'}
          />
          <Stage
            Icon={Bike}
            title="Out for delivery"
            time={step >= 2 ? `Arriving in ${minutes} min` : 'Coming up'}
            status={step >= 2 ? 'active' : 'pending'}
            isLast
          />
        </div>

        <div style={{ height: 4 }} />
      </div>
    </div>
  );
}

// Stylized Map
function StylizedMap({ step }) {
  // Positions along the route; the rider moves further along as steps progress.
  const progress = step >= 2 ? 0.62 : step >= 1 ? 0.18 : 0.05; // 0..1 along the path
  const path = (t) => {
    // Quadratic curve approximation matching the SVG path
    const p0 = { x: 14, y: 78 };
    const p1 = { x: 50, y: 38 };
    const p2 = { x: 86, y: 22 };
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    return { x, y };
  };
  const rider = path(progress);

  return (
    <>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Background blocks (city) */}
        <rect x="0" y="0" width="100" height="100" fill="#E5E7EB" />
        <rect x="6" y="62" width="14" height="20" fill="#D1D5DB" />
        <rect x="22" y="50" width="10" height="14" fill="#D1D5DB" />
        <rect x="36" y="28" width="14" height="16" fill="#D1D5DB" />
        <rect x="56" y="14" width="10" height="14" fill="#D1D5DB" />
        <rect x="72" y="32" width="12" height="20" fill="#D1D5DB" />

        {/* Roads (white strips) */}
        <path d="M 0 80 L 30 80 L 30 50 L 60 50 L 60 24 L 100 24" stroke="#FFFFFF" strokeWidth="6" fill="none" />
        <path d="M 18 100 L 18 70 L 50 70 L 50 36 L 80 36 L 80 0" stroke="#FFFFFF" strokeWidth="4" fill="none" opacity="0.7" />

        {/* Route line */}
        <path
          d="M 14 78 Q 50 38 86 22"
          stroke="#1976D2"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Source marker (darkstore) */}
      <div
        className="absolute flex flex-col items-center"
        style={{ left: '12%', top: '72%', transform: 'translate(-50%, -50%)' }}
      >
        <span
          className="flex items-center justify-center"
          style={{
            width: 22, height: 22,
            background: '#FFFFFF',
            border: '2.5px solid #1976D2',
            borderRadius: '50%'
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1976D2' }} />
        </span>
      </div>

      {/* Destination pin */}
      <div
        className="absolute"
        style={{ left: '88%', top: '20%', transform: 'translate(-50%, -100%)' }}
      >
        <DestinationPin />
      </div>

      {/* Rider */}
      <motion.div
        animate={{ left: `${rider.x}%`, top: `${rider.y}%` }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className="absolute"
        style={{
          transform: 'translate(-50%, -50%)',
          zIndex: 5
        }}
      >
        <RiderMarker />
      </motion.div>
    </>
  );
}

function DestinationPin() {
  return (
    <div className="flex flex-col items-center">
      <div
        style={{
          width: 26, height: 26,
          background: BLINKIT_GREEN,
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
          boxShadow: '0 2px 6px rgba(12,131,31,0.4)',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            width: 10, height: 10,
            background: '#FFFFFF',
            borderRadius: '50%'
          }}
        />
      </div>
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: TEXT,
          background: '#FFFFFF',
          padding: '2px 6px',
          borderRadius: 4,
          marginTop: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          whiteSpace: 'nowrap'
        }}
      >
        Hostel 4
      </span>
    </div>
  );
}

function RiderMarker() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse */}
      <span
        className="absolute"
        style={{
          width: 36, height: 36,
          background: 'rgba(12,131,31,0.22)',
          borderRadius: '50%',
          animation: 'pulse-ring 2s ease-out infinite'
        }}
      />
      <span
        className="flex items-center justify-center relative"
        style={{
          width: 28, height: 28,
          background: BLINKIT_GREEN,
          borderRadius: '50%',
          border: '3px solid #FFFFFF',
          boxShadow: '0 2px 6px rgba(0,0,0,0.18)'
        }}
      >
        <Bike size={13} color="#FFFFFF" strokeWidth={2.4} />
      </span>
    </div>
  );
}

// Avatar (delivery partner)
function Avatar() {
  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{
        width: 46, height: 46,
        background: 'linear-gradient(135deg, #FFD54F 0%, #FF9800 100%)',
        borderRadius: '50%',
        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.12)'
      }}
    >
      {/* Helmet/character abstraction */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        {/* Helmet */}
        <path d="M5 18 Q5 7 16 7 Q27 7 27 18 L27 19 L5 19 Z" fill="#C62828" />
        <rect x="5" y="18" width="22" height="3" fill="#8B0000" />
        {/* Visor */}
        <rect x="8" y="13" width="16" height="5" rx="1.5" fill="#1F2937" />
        {/* Face below helmet */}
        <ellipse cx="16" cy="24" rx="6" ry="4" fill="#FFE0B2" />
      </svg>
      {/* Online dot */}
      <span
        className="absolute"
        style={{
          right: 1, bottom: 1,
          width: 11, height: 11,
          borderRadius: '50%',
          background: BLINKIT_GREEN,
          border: '2px solid #FFFFFF'
        }}
      />
    </div>
  );
}

// Tip Pill
function TipPill({ amount, mostTipped, custom }) {
  return (
    <button
      className="flex flex-col items-center justify-center cursor-pointer border active:scale-95 transition-transform flex-shrink-0"
      style={{
        background: '#FFFFFF',
        borderColor: mostTipped ? BLINKIT_GREEN : STROKE,
        borderWidth: mostTipped ? 1.5 : 1,
        borderRadius: 12,
        padding: '8px 14px',
        minWidth: 64,
        position: 'relative'
      }}
    >
      {mostTipped && (
        <span
          className="absolute"
          style={{
            top: -7,
            fontSize: 8,
            fontWeight: 800,
            color: BLINKIT_GREEN,
            background: BLINKIT_GREEN_BG,
            padding: '1px 5px',
            borderRadius: 999,
            border: `1px solid rgba(12,131,31,0.4)`,
            letterSpacing: 0.4,
            whiteSpace: 'nowrap'
          }}
        >
          MOST TIPPED
        </span>
      )}
      <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>
        {custom ? 'Other' : `₹${amount}`}
      </span>
    </button>
  );
}

// Delivery Illustration (top-right)
function DeliveryIllustration() {
  return (
    <svg
      className="absolute"
      style={{ right: 8, top: 8, width: 88, height: 88, opacity: 0.95 }}
      viewBox="0 0 100 100"
      fill="none"
    >
      {/* Door frame */}
      <rect x="62" y="20" width="32" height="68" fill="#E8F7EE" rx="4" />
      <rect x="62" y="20" width="32" height="68" stroke="#A5D6A7" strokeWidth="1.5" fill="none" rx="4" />
      {/* Person in doorway (simplified) */}
      <circle cx="78" cy="42" r="6" fill="#FFE0B2" />
      <rect x="71" y="48" width="14" height="22" rx="2" fill="#0C831F" />
      {/* Scooter */}
      <circle cx="22" cy="76" r="9" fill="#1F2937" />
      <circle cx="44" cy="76" r="9" fill="#1F2937" />
      <circle cx="22" cy="76" r="3.5" fill="#9CA3AF" />
      <circle cx="44" cy="76" r="3.5" fill="#9CA3AF" />
      <rect x="14" y="56" width="36" height="14" rx="3" fill="#FFC107" />
      <rect x="32" y="38" width="14" height="22" rx="3" fill="#0C831F" />
      {/* Rider body */}
      <circle cx="32" cy="36" r="5" fill="#C62828" />
      <rect x="29" y="42" width="6" height="14" rx="1.5" fill="#C62828" />
    </svg>
  );
}

// Stage row
function Stage({ Icon, title, time, status, isLast }) {
  const isDone = status === 'done';
  const isActive = status === 'active';
  const tint = (isDone || isActive) ? BLINKIT_GREEN : '#D1D5DB';

  return (
    <div className="flex items-start gap-3 relative" style={{ paddingBottom: isLast ? 12 : 14 }}>
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            left: 11,
            top: 22,
            bottom: 0,
            width: 2,
            background: isDone ? BLINKIT_GREEN : '#E5E7EB'
          }}
        />
      )}

      <div
        className="flex items-center justify-center flex-shrink-0 relative"
        style={{
          width: 22, height: 22,
          background: tint,
          borderRadius: '50%',
          boxShadow: isActive ? `0 0 0 4px ${BLINKIT_GREEN_BG}` : 'none'
        }}
      >
        <Icon size={11} color="#FFFFFF" strokeWidth={2.6} />
      </div>

      <div className="flex-1" style={{ marginTop: 1 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: (isDone || isActive) ? TEXT : TEXT_SOFT,
            letterSpacing: '-0.1px'
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: 11, color: TEXT_SOFT, marginTop: 1 }}>{time}</p>
      </div>
    </div>
  );
}
