import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import useStore from '../../store/useStore';

export default function PaymentSuccess() {
  const { paymentSuccess } = useStore();

  // Fire confetti
  useEffect(() => {
    if (paymentSuccess) {
      fireConfetti();
    }
  }, [paymentSuccess]);

  return (
    <AnimatePresence>
      {paymentSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-[#00A651]/95 z-[400] flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 12 }}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-5"
          >
            <Check size={40} className="text-[#00A651]" strokeWidth={3} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white text-[22px] font-bold"
          >
            Payment Successful!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-sm mt-2"
          >
            Your order is being prepared
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function fireConfetti() {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(container);

  const colors = ['#FF9900', '#00A651', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A855F7'];

  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.style.cssText = `
      position: absolute;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: -10px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation: confettiFall ${2 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s forwards;
    `;
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 4000);
}
