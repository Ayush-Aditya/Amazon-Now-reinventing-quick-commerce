import { motion } from 'framer-motion';
import { Heart, Star, Clock } from 'lucide-react';
import { darkstoreDB } from '../../data/products';
import ProductImage from '../ProductImage';

const dealProducts = [
  { id: 'SD-003', size: '60 g', mrpDiscount: 20, rating: 4.5, reviews: '85k', tag: null },
  { id: 'HP-002', size: '500 ml', mrpDiscount: 15, rating: 4.6, reviews: '42k', tag: 'Chilled' },
  { id: 'CB-001', size: '1 bunch', mrpDiscount: 30, rating: 4.4, reviews: '12k', tag: null },
  { id: 'BB-005', size: '200 g', mrpDiscount: 10, rating: 4.7, reviews: '28k', tag: null },
  { id: 'DF-008', size: '600 ml', mrpDiscount: 25, rating: 4.5, reviews: '15k', tag: 'Chilled' },
  { id: 'BB-004', size: '90 g', mrpDiscount: 18, rating: 4.8, reviews: '67k', tag: null },
];

export default function HotDeals() {
  return (
    <div className="px-4 pb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-bold text-gray-900">Hot Deals</h3>
        <span className="text-[12px] text-[#00A651] font-semibold cursor-pointer">see all</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {dealProducts.map((item, i) => {
          const product = darkstoreDB[item.id];
          if (!product) return null;
          const oldPrice = Math.round(product.price * (1 + item.mrpDiscount / 100));

          return (
            <motion.div
              key={item.id + i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.03, duration: 0.25 }}
              className="bg-white border border-gray-200 cursor-pointer active:bg-gray-50 transition-colors duration-150 flex flex-col"
              style={{ borderRadius: '8px' }}
            >
              <div
                className="relative w-full bg-[#FAFAFA] flex items-center justify-center overflow-hidden"
                style={{ borderRadius: '8px 8px 0 0', aspectRatio: '1.1' }}
              >
                <button className="absolute top-2 right-2 z-10 bg-transparent border-none cursor-pointer p-0">
                  <Heart size={16} className="text-gray-300" strokeWidth={1.5} />
                </button>

                <ProductImage product={product} className="max-w-[70%] max-h-[80%] object-contain" />

                <span
                  className="absolute bottom-2 left-2 text-[10px] font-semibold text-gray-700 bg-white/80 px-1.5 py-0.5"
                  style={{ borderRadius: '3px' }}
                >
                  {item.size}
                </span>

                <button
                  className="absolute bottom-2 right-2 bg-white border-2 border-[#00A651] text-[#00A651] text-[11px] font-bold px-3 py-1 cursor-pointer active:bg-green-50 transition-colors duration-150"
                  style={{ borderRadius: '6px' }}
                >
                  ADD
                </button>

                <span
                  className="absolute bottom-9 right-2 w-3 h-3 border border-[#00A651] bg-white flex items-center justify-center"
                  style={{ borderRadius: '2px' }}
                >
                  <span className="w-1.5 h-1.5 bg-[#00A651]" style={{ borderRadius: '50%' }} />
                </span>
              </div>

              <div className="p-2.5">
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-[14px] font-extrabold text-gray-900">₹{product.price}</span>
                  <span className="text-[11px] text-gray-400 line-through">₹{oldPrice}</span>
                </div>

                <p className="text-[10px] text-[#1976D2] font-semibold mb-1">
                  {item.mrpDiscount}% OFF on MRP
                </p>

                <p
                  className="text-[12px] text-gray-800 font-normal leading-tight overflow-hidden h-[30px]"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                >
                  {product.name}
                </p>

                {item.tag && (
                  <span
                    className="inline-block mt-1.5 text-[9px] font-semibold text-[#01579B] bg-[#E1F5FE] border border-[#B3E5FC] px-1.5 py-0.5"
                    style={{ borderRadius: '3px' }}
                  >
                    ❄ {item.tag}
                  </span>
                )}

                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-[9px] text-gray-700 font-semibold">{item.rating}</span>
                    <span className="text-[9px] text-gray-400">({item.reviews})</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Clock size={9} className="text-gray-400" />
                    <span className="text-[9px] text-gray-500 font-medium">8 mins</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
