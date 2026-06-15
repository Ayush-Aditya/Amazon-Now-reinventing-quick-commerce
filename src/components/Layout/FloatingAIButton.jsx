import { motion } from 'framer-motion';
import { Mic, Sparkles, ChevronRight } from 'lucide-react';
import useStore from '../../store/useStore';

export default function FloatingAIButton() {
  const { openChat } = useStore();

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="absolute z-[200]"
      style={{ left: 12, right: 12, bottom: 14, boxSizing: 'border-box' }}
    >
      <button
        onClick={openChat}
        className="block w-full relative cursor-pointer active:scale-[0.985] transition-transform duration-200 border-none p-0 m-0"
        style={{
          background: 'linear-gradient(135deg, #0B0E11 0%, #1A2230 50%, #0B0E11 100%)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,153,0,0.35)',
          borderRadius: 999,
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {/* Shimmer */}
        <span
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,153,0,0.4) 50%, transparent 100%)',
            animation: 'shimmer 3s ease-in-out infinite'
          }}
        />

        <span
          className="relative flex items-center"
          style={{
            minWidth: 0,
            paddingLeft: 4,
            paddingRight: 12,
            paddingTop: 4,
            paddingBottom: 4,
            gap: 10
          }}
        >
          {/* Mic circle with status dot */}
          <span
            className="flex items-center justify-center relative"
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              background: 'linear-gradient(135deg, #FF9900, #FFB84D)',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(255,153,0,0.4)'
            }}
          >
            <Mic size={16} className="text-white" />
            <span
              className="absolute pointer-events-none"
              style={{
                top: 0, right: 0,
                width: 10, height: 10,
                borderRadius: '50%',
                background: '#00E676',
                border: '1.5px solid #0B0E11',
                animation: 'blink 1.5s ease-in-out infinite'
              }}
            />
          </span>

          {/* Text column */}
          <span
            className="flex-1 text-left"
            style={{ minWidth: 0, overflow: 'hidden' }}
          >
            <span className="flex items-center gap-1.5">
              <span
                className="text-white font-bold tracking-tight"
                style={{ fontSize: 13, lineHeight: '16px' }}
              >
                CART AI
              </span>
              <Sparkles size={10} className="text-[#FF9900] flex-shrink-0" />
              <span
                className="flex items-center gap-1 flex-shrink-0"
                style={{
                  fontSize: 8.5,
                  fontWeight: 800,
                  letterSpacing: '0.6px',
                  color: '#00E676',
                  background: 'rgba(0,230,118,0.10)',
                  border: '1px solid rgba(0,230,118,0.45)',
                  padding: '1px 5px',
                  borderRadius: 0,
                  lineHeight: 1
                }}
              >
                LIVE
              </span>
            </span>
            <span
              className="block text-white/55 truncate"
              style={{ fontSize: 10.5, lineHeight: '14px', marginTop: 2, letterSpacing: 0.2 }}
            >
              Tap to start a conversation
            </span>
          </span>

          {/* Chevron circle */}
          <span
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)'
            }}
          >
            <ChevronRight size={14} className="text-white/80" />
          </span>
        </span>
      </button>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.85); }
        }
      `}</style>
    </motion.div>
  );
}
