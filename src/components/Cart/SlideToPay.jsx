import { useRef, useState, useCallback } from 'react';
import { ChevronsRight } from 'lucide-react';
import useStore from '../../store/useStore';

// Slide-to-pay button. Drag the white knob across the green track to pay.
// Hits 88% → fires success automatically. Double-tap is a dev shortcut so
// nobody has to drag during a demo. On success the parent flips to the
// payment confirmation screen and starts the order tracking timer.

const BLINKIT_GREEN       = '#0C831F';
const BLINKIT_GREEN_LIGHT = '#1FA661';

export default function SlideToPay({ total }) {
  const { setPaymentSuccess, setScreen, startOrder } = useStore();
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const handleStart = useCallback(() => {
    if (!completed) dragging.current = true;
  }, [completed]);

  const handleMove = useCallback((e) => {
    if (!dragging.current || completed) return;
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left - 24;
    const maxX = rect.width - 56;
    const pct = Math.max(0, Math.min(100, (x / maxX) * 100));
    setProgress(pct);
    if (pct >= 88) {
      dragging.current = false;
      triggerSuccess();
    }
  }, [completed]);

  const handleEnd = useCallback(() => {
    if (!dragging.current || completed) return;
    dragging.current = false;
    setProgress(0);
  }, [completed]);

  function triggerSuccess() {
    setCompleted(true);
    setProgress(100);
    setTimeout(() => {
      setPaymentSuccess(true);
      startOrder();
      setTimeout(() => {
        setPaymentSuccess(false);
        setScreen('tracking');
        setCompleted(false);
        setProgress(0);
      }, 2000);
    }, 400);
  }

  function handleDoubleClick() {
    if (!completed) triggerSuccess();
  }

  return (
    <div
      className="flex-shrink-0"
      style={{
        background: '#FFFFFF',
        padding: '10px 12px 14px',
        borderTop: '1px solid #ECEEF1',
        boxShadow: '0 -4px 14px rgba(0,0,0,0.04)'
      }}
    >
      <div
        ref={trackRef}
        className="w-full relative overflow-hidden cursor-pointer select-none"
        style={{
          height: 52,
          background: `linear-gradient(135deg, ${BLINKIT_GREEN} 0%, ${BLINKIT_GREEN_LIGHT} 100%)`,
          borderRadius: 12,
          boxShadow: '0 4px 14px rgba(12,131,31,0.3)'
        }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onDoubleClick={handleDoubleClick}
      >
        {/* Filled progress overlay */}
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            width: `${progress}%`,
            background: 'rgba(255,255,255,0.18)',
            transition: completed ? 'width 0.4s ease' : 'none'
          }}
        />

        {/* Static label */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
          style={{ opacity: progress > 50 ? 0 : 1, transition: 'opacity 0.2s' }}
        >
          <span style={{
            fontSize: 14, fontWeight: 700, color: '#FFFFFF',
            letterSpacing: '-0.2px', lineHeight: 1
          }}>
            Slide to Pay  ·  ₹{total}
          </span>
          <span style={{
            fontSize: 9.5, color: 'rgba(255,255,255,0.75)',
            marginTop: 3, letterSpacing: 0.4, fontWeight: 500
          }}>
            DOUBLE TAP TO SKIP
          </span>
        </div>

        {/* Sliding chevron knob */}
        <div
          className="absolute z-10 flex items-center justify-center"
          style={{
            top: 4,
            width: 44, height: 44,
            background: '#FFFFFF',
            borderRadius: 8,
            left: `calc(4px + (${progress}% * (100% - 52px) / 100))`,
            transform: 'translateX(0)',
            transition: completed ? 'left 0.4s ease' : 'none',
            boxShadow: '0 3px 8px rgba(0,0,0,0.18)'
          }}
        >
          <ChevronsRight size={20} className="text-[#0C831F]" strokeWidth={2.6} />
        </div>
      </div>
    </div>
  );
}
