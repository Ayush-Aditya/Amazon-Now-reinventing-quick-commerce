import { motion } from 'framer-motion';
import { ChevronRight, Heart } from 'lucide-react';
import useStore from '../../store/useStore';
import { preloadedCarts } from '../../data/preloadedCarts';
import { darkstoreDB } from '../../data/products';
import ProductImage from '../ProductImage';

export default function NotificationBanner() {
  const { setCart, setScreen } = useStore();
  const valentineCart = preloadedCarts[0];

  function handleClick() {
    setCart(valentineCart.items, "Valentine's Day Special");
    setScreen('cart');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      onClick={handleClick}
      className="mx-4 mt-3 relative cursor-pointer active:scale-[0.99] transition-transform overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #FFE4EC 0%, #FFB7C5 45%, #FF8FA3 100%)',
        border: '1px solid #FBCFE8',
        borderRadius: 14,
        boxShadow: '0 4px 14px rgba(244,114,182,0.18)'
      }}
    >
      {/* DECORATIVE HEARTS */}
      <FloatingHeart top={-14} right={-6} size={70} opacity={0.18} delay={0} />
      <FloatingHeart top={28} right={70} size={22} opacity={0.45} delay={0.7} />
      <FloatingHeart bottom={-8} right={-10} size={58} opacity={0.20} delay={1.4} />
      <FloatingHeart top={64} right={36} size={14} opacity={0.55} delay={2.1} />
      <FloatingHeart bottom={20} right={140} size={18} opacity={0.40} delay={1.0} />

      <div className="relative" style={{ padding: 14 }}>

        {/* ---------- Top eyebrow row ---------- */}
        <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
          <div
            className="inline-flex items-center gap-1.5"
            style={{
              background: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(4px)',
              padding: '3px 9px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.7)'
            }}
          >
            <Heart size={9} className="fill-[#E91E63] text-[#E91E63]" />
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '0.7px',
                color: '#9D174D',
                textTransform: 'uppercase'
              }}
            >
              Valentine's Day
            </span>
          </div>
          <span style={{ fontSize: 10, color: '#9D174D', fontWeight: 600 }}>Just now</span>
        </div>

        {/* ---------- Main content ---------- */}
        <h3
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: '#831843',
            letterSpacing: '-0.5px',
            lineHeight: '22px'
          }}
        >
          A cart for your <span style={{ fontStyle: 'italic', color: '#BE185D' }}>special someone</span>
        </h3>
        <p
          style={{
            fontSize: 12,
            color: '#9D174D',
            fontWeight: 500,
            lineHeight: '17px',
            marginTop: 4,
            opacity: 0.85
          }}
        >
          Roses, chocolate and a little surprise — preloaded by Cart AI.
        </p>

        {/* ---------- Product preview row ---------- */}
        <div className="flex items-center gap-2.5" style={{ marginTop: 14 }}>
          {/* Image stack */}
          <div className="flex items-center" style={{ marginLeft: 0 }}>
            {valentineCart.items.slice(0, 3).map((item, i) => {
              const product = darkstoreDB[item.id];
              if (!product) return null;
              return (
                <div
                  key={i}
                  className="flex items-center justify-center"
                  style={{
                    width: 46, height: 46,
                    background: '#FFFFFF',
                    border: '1.5px solid #FFFFFF',
                    borderRadius: 12,
                    padding: 5,
                    marginLeft: i === 0 ? 0 : -10,
                    boxShadow: '0 2px 6px rgba(157,23,77,0.22)',
                    zIndex: 10 - i
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
            {/* +N pill if more items */}
            {valentineCart.items.length > 3 && (
              <div
                className="flex items-center justify-center"
                style={{
                  width: 36, height: 36,
                  background: '#831843',
                  borderRadius: 12,
                  marginLeft: -10,
                  border: '1.5px solid #FFFFFF',
                  boxShadow: '0 2px 6px rgba(157,23,77,0.22)',
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#FFFFFF'
                }}
              >
                +{valentineCart.items.length - 3}
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* CTA button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
            className="flex items-center cursor-pointer border-none active:scale-95 transition-all"
            style={{
              gap: 4,
              padding: '8px 14px',
              background: 'linear-gradient(135deg, #E91E63 0%, #BE185D 100%)',
              color: '#FFFFFF',
              fontSize: 12.5,
              fontWeight: 700,
              borderRadius: 999,
              boxShadow: '0 4px 12px rgba(190,24,93,0.45)',
              letterSpacing: '-0.1px'
            }}
          >
            View cart
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Animation keyframes scoped to this component */}
      <style>{`
        @keyframes floatHeart {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          50%      { transform: translateY(-6px) rotate(6deg); }
        }
      `}</style>
    </motion.div>
  );
}

function FloatingHeart({ top, right, bottom, size = 30, opacity = 0.4, delay = 0 }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top, right, bottom,
        width: size, height: size,
        opacity,
        animation: 'floatHeart 4s ease-in-out infinite',
        animationDelay: `${delay}s`
      }}
    >
      <svg viewBox="0 0 24 24" fill="#E91E63" width="100%" height="100%">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
}
