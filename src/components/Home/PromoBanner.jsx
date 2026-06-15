import { motion } from 'framer-motion';

export default function PromoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.3 }}
      className="mx-4 mb-4 bg-white border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[16px] font-bold text-[#1a6b3c]">Unlock savings</span>
        <span className="bg-[#FFC107] text-gray-900 text-[11px] font-bold px-3 py-1.5 cursor-pointer">
          Collect
        </span>
      </div>
      <p className="text-[11px] text-gray-500 mb-3">Get Cashback on orders above</p>
      <div className="flex items-center justify-around">
        {[{ amount: '₹100', min: '₹1,399' }, { amount: '₹200', min: '₹2,799' }, { amount: '₹300', min: '₹3,999' }].map((item) => (
          <div key={item.amount} className="text-center">
            <div className="w-11 h-11 mx-auto bg-gradient-to-b from-yellow-300 to-yellow-500 flex items-center justify-center text-[12px] font-extrabold text-gray-900 mb-1.5 shadow border border-yellow-300" style={{ borderRadius: '50%' }}>
              {item.amount}
            </div>
            <span className="text-[10px] text-gray-600 font-medium">{item.min}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
