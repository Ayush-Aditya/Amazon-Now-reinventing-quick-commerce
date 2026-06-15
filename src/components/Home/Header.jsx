import { useEffect, useState } from 'react';
import { Search, Bell, ChevronDown, Mic } from 'lucide-react';
import useStore from '../../store/useStore';

const ROTATING_PLACEHOLDERS = [
  'atta, dal, coke and more',
  '"Coffee"',
  '"Fresh fruits"',
  '"Crocin"',
  '"Maggi noodles"'
];

export default function Header() {
  const { setScreen, openChat } = useStore();
  const [phIndex, setPhIndex] = useState(0);

  // Rotate the placeholder every 2.5s for a "live" feel
  useEffect(() => {
    const t = setInterval(() => setPhIndex(i => (i + 1) % ROTATING_PLACEHOLDERS.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="bg-white z-50"
      style={{
        position: 'sticky',
        top: 0,
        borderBottom: '1px solid #ECEEF1',
        boxShadow: '0 1px 0 rgba(0,0,0,0.02)'
      }}
    >
      {/* status bar spacer */}
      <div style={{ height: 8 }} />

      {/* TOP ROW : profile · logo · bell */}
      <div className="flex items-center justify-between px-4" style={{ paddingTop: 8, paddingBottom: 12 }}>

        {/* ---------- Profile marker ---------- */}
        <button
          onClick={() => setScreen('notifications')}
          className="relative cursor-pointer p-0 border-none bg-transparent flex items-center justify-center active:scale-95 transition-transform"
          style={{ width: 46, height: 46 }}
        >
          {/* Animated gradient outer ring */}
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #FF9900 0deg, #FFB84D 90deg, #FF9900 180deg, #E47911 270deg, #FF9900 360deg)',
              padding: 2,
              animation: 'profileRingSpin 6s linear infinite'
            }}
          >
            <span className="block w-full h-full bg-white" style={{ borderRadius: '50%' }} />
          </span>

          {/* Inner avatar */}
          <span
            className="relative flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #1F2937 0%, #0F1111 100%)',
              borderRadius: '50%',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.06)'
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #FF9900, #FFD18A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
                letterSpacing: '-0.5px',
                fontFamily: '"Inter", system-ui'
              }}
            >
              A
            </span>
          </span>

          {/* Online status dot */}
          <span
            className="absolute"
            style={{
              right: 1,
              bottom: 1,
              width: 11,
              height: 11,
              borderRadius: '50%',
              background: '#00C853',
              border: '2px solid #ffffff',
              boxShadow: '0 0 0 1px rgba(0,200,83,0.4)'
            }}
          />
        </button>

        {/* ---------- Logo ---------- */}
        <div className="flex items-baseline">
          <span
            className="text-gray-900 tracking-tight"
            style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.6px' }}
          >
            amazon
          </span>
          <span
            className="text-[#00A651] tracking-tight"
            style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.6px', marginLeft: 1 }}
          >
            fresh
          </span>
        </div>

        {/* ---------- Bell ---------- */}
        <button
          onClick={() => setScreen('notifications')}
          className="relative bg-transparent border-none cursor-pointer flex items-center justify-center active:scale-90 transition-transform"
          style={{ width: 44, height: 44 }}
        >
          <span
            className="flex items-center justify-center"
            style={{
              width: 38,
              height: 38,
              background: '#F4F6F8',
              borderRadius: '50%',
              border: '1px solid #ECEEF1'
            }}
          >
            <Bell size={20} className="text-gray-800" strokeWidth={2.2} />
          </span>

          {/* Badge */}
          <span
            className="absolute flex items-center justify-center font-bold text-white"
            style={{
              top: 2,
              right: 2,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              fontSize: 9.5,
              background: '#E53935',
              borderRadius: '999px',
              border: '2px solid #FFFFFF',
              boxShadow: '0 1px 3px rgba(229,57,53,0.45)',
              lineHeight: 1
            }}
          >
            3
          </span>
        </button>
      </div>

      {/* DELIVERY ROW */}
      <div
        className="flex items-center px-4"
        style={{ paddingBottom: 10 }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 26,
            height: 26,
            background: 'linear-gradient(135deg, #FFC107, #FF9900)',
            marginRight: 10,
            boxShadow: '0 2px 6px rgba(255,153,0,0.35)'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F1111" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-gray-500 leading-none"
            style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: 0.5, marginBottom: 2 }}
          >
            DELIVERY IN 10 MINUTES
          </p>
          <span
            className="text-gray-900 truncate block"
            style={{ fontSize: 12.5, fontWeight: 600 }}
          >
            Hostel 4, BIT Mesra 835215
          </span>
        </div>
        <ChevronDown size={16} className="text-gray-500 flex-shrink-0 ml-2" />
      </div>

      {/* SEARCH BAR */}
      <div className="px-4" style={{ paddingBottom: 12 }}>
        <button
          className="w-full flex items-center cursor-pointer border-none p-0 active:scale-[0.99] transition-transform"
          style={{
            background: '#F4F6F8',
            border: '1px solid #ECEEF1',
            height: 44,
            padding: '0 0 0 14px',
            boxShadow: '0 1px 2px rgba(15,17,17,0.03), inset 0 1px 0 rgba(255,255,255,0.5)'
          }}
        >
          {/* Search icon */}
          <Search size={16} className="text-gray-500 flex-shrink-0" strokeWidth={2.4} />

          {/* Animated placeholder */}
          <span
            className="flex-1 text-left ml-3 truncate"
            style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}
          >
            <span style={{ color: '#1F2937' }}>Search for </span>
            <span
              key={phIndex}
              className="inline-block"
              style={{ animation: 'rotateInPlaceholder 0.45s ease-out' }}
            >
              {ROTATING_PLACEHOLDERS[phIndex]}
            </span>
          </span>

          {/* Vertical divider */}
          <span
            className="flex-shrink-0"
            style={{ width: 1, height: 22, background: '#DDE2E7', marginRight: 0 }}
          />

          {/* Mic button (opens AI chat) */}
          <span
            onClick={(e) => { e.stopPropagation(); openChat(); }}
            className="flex items-center justify-center flex-shrink-0 cursor-pointer"
            style={{
              width: 44,
              height: 44,
              color: '#FF9900'
            }}
          >
            <Mic size={18} strokeWidth={2.2} />
          </span>
        </button>
      </div>

      <style>{`
        @keyframes profileRingSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes rotateInPlaceholder {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
