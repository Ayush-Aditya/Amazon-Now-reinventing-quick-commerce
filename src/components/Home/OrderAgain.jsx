import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Clock, Plus, Minus } from 'lucide-react';
import { darkstoreDB } from '../../data/products';
import ProductImage from '../ProductImage';

// Blinkit-style "Based on your past orders" grid. Picks are a curated
// list — when the ML pipeline ships, this list will come from
// /api/ml/users/:id/home-picks instead. See ml-mock/ for the design.
//
// Each product is shown as a 2-column card with: bought-earlier tab,
// favourite heart, image, dot indicator, ADD/qty stepper, price block,
// rating + delivery time. The stepper toggles between an outlined ADD
// button and a solid green +/- pill when qty > 0.

const pastCategories = [
  { label: 'Top Picks', active: true },
  { label: 'Pharma & wellness' },
  { label: 'Oil & ghee' },
  { label: 'Masala & spices' }
];

// IDs picked because each one has a real local photo under /public/images,
// so the grid never falls back to the SVG card. mrpDiscount, rating etc.
// are static here for demo polish.
const recentProducts = [
  { id: 'SD-001', size: '6 x 250 ml', mrpDiscount: 7,  rating: 4.5, reviews: '3.1 lac', tag: 'Chilled', boughtEarlier: true,  deliveryMins: 8 },
  { id: 'GE-005', size: '1 L',        mrpDiscount: 11, rating: 4.6, reviews: '52k',     tag: null,      boughtEarlier: true,  deliveryMins: 8 },
  { id: 'SD-003', size: '52 g',       mrpDiscount: 13, rating: 4.5, reviews: '85k',     tag: null,      boughtEarlier: true,  deliveryMins: 8 },
  { id: 'DF-001', size: '1 L',        mrpDiscount: 8,  rating: 4.8, reviews: '1.2 lac', tag: 'Chilled', boughtEarlier: true,  deliveryMins: 8 },
  { id: 'HP-002', size: '500 ml',     mrpDiscount: 9,  rating: 4.4, reviews: '14k',     tag: 'Chilled', boughtEarlier: true,  deliveryMins: 8 },
  { id: 'CB-001', size: '12 stems',   mrpDiscount: 22, rating: 4.7, reviews: '6.4k',    tag: 'Fresh',   boughtEarlier: false, deliveryMins: 12 },
  { id: 'BB-005', size: '200 g',      mrpDiscount: 18, rating: 4.7, reviews: '21k',     tag: null,      boughtEarlier: false, deliveryMins: 8 },
  { id: 'BB-004', size: '90 g',       mrpDiscount: 18, rating: 4.6, reviews: '38k',     tag: null,      boughtEarlier: true,  deliveryMins: 8 },
  { id: 'HP-001', size: '15 tabs',    mrpDiscount: 14, rating: 4.7, reviews: '8.5k',    tag: null,      boughtEarlier: true,  deliveryMins: 8 },
  { id: 'GE-007', size: '100 g',      mrpDiscount: 19, rating: 4.4, reviews: '12k',     tag: null,      boughtEarlier: false, deliveryMins: 8 }
];

export default function OrderAgain() {
  // Track per-product cart quantity locally just for the +/- ADD interaction
  const [counts, setCounts] = useState({});
  const inc = (id) => setCounts(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id) => setCounts(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));

  return (
    <div className="px-4 pb-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-[15px] font-bold text-gray-900">Based on your Past Orders</h3>
        <span className="text-[11px] text-[#00A651] font-semibold">see all</span>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
        {pastCategories.map((cat) => (
          <div
            key={cat.label}
            className={`px-3 py-1.5 border whitespace-nowrap flex-shrink-0 cursor-pointer text-[11px] font-medium transition-colors duration-150
              ${cat.active ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-600'}`}
            style={{ borderRadius: 6 }}
          >
            {cat.label}
          </div>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {recentProducts.map((item, i) => {
          const product = darkstoreDB[item.id];
          if (!product) return null;
          const oldPrice = Math.round(product.price * (1 + item.mrpDiscount / 100));
          const qty = counts[item.id] || 0;

          return (
            <motion.div
              key={item.id + i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className="bg-white border border-gray-200 cursor-pointer flex flex-col"
              style={{ borderRadius: 10 }}
            >
              {/* IMAGE AREA */}
              <div
                className="relative w-full bg-[#F8F9FA] flex items-center justify-center overflow-hidden"
                style={{ borderRadius: '10px 10px 0 0', aspectRatio: '1' }}
              >
                {/* "Bought Earlier" tab top-left */}
                {item.boughtEarlier && (
                  <span
                    className="absolute top-0 left-0 z-10 text-[8.5px] font-bold text-white bg-[#0EA5A8] px-2 py-[3px]"
                    style={{ borderRadius: '10px 0 8px 0', letterSpacing: 0.2 }}
                  >
                    Bought Earlier
                  </span>
                )}

                {/* Heart icon top-right */}
                <button
                  className="absolute top-1.5 right-1.5 z-10 bg-transparent border-none cursor-pointer p-1 active:scale-90 transition-transform"
                >
                  <Heart size={15} className="text-gray-300 hover:text-red-500" strokeWidth={1.6} />
                </button>

                {/* Product image */}
                <ProductImage
                  product={product}
                  className="object-contain"
                  style={{ maxWidth: '78%', maxHeight: '78%' }}
                />

                {/* Page-dot indicator (Blinkit shows 1 of 3 etc.) */}
                <div className="absolute bottom-2 left-2 flex items-center gap-[3px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                </div>

                {/* Veg indicator bottom-right above ADD */}
                <span
                  className="absolute z-10 flex items-center justify-center bg-white"
                  style={{ bottom: 38, right: 8, width: 12, height: 12, border: '1.4px solid #00A651', borderRadius: 2 }}
                >
                  <span className="bg-[#00A651]" style={{ width: 6, height: 6, borderRadius: '50%' }} />
                </span>

                {/* ADD button / qty stepper bottom-right */}
                {qty === 0 ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); inc(item.id); }}
                    className="absolute bottom-2 right-2 z-10 bg-white border-2 border-[#00A651] text-[#00A651] text-[11px] font-extrabold cursor-pointer active:bg-green-50 transition-colors"
                    style={{ borderRadius: 6, padding: '3px 14px', letterSpacing: 0.4, lineHeight: '14px' }}
                  >
                    ADD
                  </button>
                ) : (
                  <div
                    className="absolute bottom-2 right-2 z-10 flex items-center bg-[#00A651] text-white"
                    style={{ borderRadius: 6, height: 24 }}
                  >
                    <button onClick={(e) => { e.stopPropagation(); dec(item.id); }}
                      className="w-6 h-full bg-transparent border-none text-white cursor-pointer flex items-center justify-center">
                      <Minus size={12} strokeWidth={3} />
                    </button>
                    <span className="text-[11px] font-extrabold w-5 text-center">{qty}</span>
                    <button onClick={(e) => { e.stopPropagation(); inc(item.id); }}
                      className="w-6 h-full bg-transparent border-none text-white cursor-pointer flex items-center justify-center">
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </div>

              {/* INFO SECTION */}
              <div className="px-2.5 pt-2 pb-2.5">
                {/* Size */}
                <p className="text-[10px] text-gray-500 font-medium mb-0.5">{item.size}</p>

                {/* Price row */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[14px] font-extrabold text-gray-900">₹{product.price}</span>
                  <span className="text-[10px] text-gray-400 line-through">₹{oldPrice}</span>
                </div>

                {/* MRP discount */}
                <p className="text-[9.5px] text-[#1976D2] font-semibold mb-1">
                  {item.mrpDiscount}% OFF on MRP
                </p>

                {/* Product name */}
                <p
                  className="text-[12px] text-gray-800 font-normal leading-tight overflow-hidden"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    height: 30
                  }}
                >
                  {product.name}
                </p>

                {/* Tag pill (Chilled, etc.) */}
                {item.tag && (
                  <span
                    className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-semibold text-[#01579B] bg-[#E1F5FE] border border-[#B3E5FC] px-1.5 py-[1.5px]"
                    style={{ borderRadius: 3 }}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#0288D1]" />
                    {item.tag}
                  </span>
                )}

                {/* Rating + delivery */}
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-0.5">
                    <Star size={9} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-[9px] text-gray-700 font-semibold">{item.rating}</span>
                    <span className="text-[9px] text-gray-400">({item.reviews})</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Clock size={8.5} className="text-gray-400" />
                    <span className="text-[9px] text-gray-500 font-medium">{item.deliveryMins} mins</span>
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
