import { motion } from 'framer-motion';

const categories = [
  { label: 'Vegetables & Fruits', image: 'https://cdn.grofers.com/app/images/collections/asset_V7_312x360_1776063046796' },
  { label: 'Atta, Rice & Dal', image: 'https://cdn.grofers.com/app/images/collections/asset_atta,_rice_&_dal_1697023078302' },
  { label: 'Oil, Ghee & Masala', image: 'https://cdn.grofers.com/app/images/collections/asset_Oil,_ghee_&_masala_1697023177309' },
  { label: 'Dairy, Bread & Eggs', image: 'https://cdn.grofers.com/app/images/collections/asset_Dairy,_bread_&_eggs_1697439479199' },
  { label: 'Bakery & Biscuits', image: 'https://cdn.grofers.com/app/images/collections/asset_Biscuits_&_bakery_1697023878012' },
  { label: 'Dry Fruits & Cereals', image: 'https://cdn.grofers.com/app/images/collections/asset_Dry_Fruits_&_Cereals_(1)_1727547591238' },
  { label: 'Chips & Namkeen', image: 'https://cdn.grofers.com/app/images/collections/asset_Chips_&_namkeen_1697025537433' },
  { label: 'Sweets & Chocolates', image: 'https://cdn.grofers.com/app/images/collections/asset_Sweets_&_chocolates_1697025717829' },
  { label: 'Drinks & Juices', image: 'https://cdn.grofers.com/app/images/collections/asset_V7_312x360_(2)_1774455548692' },
  { label: 'Tea & Coffee', image: 'https://cdn.grofers.com/app/images/collections/asset_L0_v1_0_1746557294148' },
  { label: 'Instant Food', image: 'https://cdn.grofers.com/app/images/collections/asset_Instant_Food_(2)_1766127254031' },
  { label: 'Sauces & Spreads', image: 'https://cdn.grofers.com/app/images/collections/asset_sauces_&_spreads_1697025783179' },
];

export default function CategoryGrid() {
  return (
    <div className="px-4 pt-5 pb-3">
      <h3 className="text-[15px] font-bold text-gray-900 mb-3">Groceries & food</h3>
      <div className="grid grid-cols-4 gap-y-4 gap-x-0">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.02, duration: 0.2 }}
            className="flex flex-col items-center cursor-pointer active:opacity-70 transition-opacity duration-150"
          >
            <div className="w-[64px] h-[64px] bg-[#F4F6F4] border border-gray-100 flex items-center justify-center overflow-hidden mb-1.5">
              <img src={cat.image} alt={cat.label} className="w-[54px] h-[54px] object-contain" loading="lazy" />
            </div>
            <span className="text-[10px] text-gray-700 text-center leading-tight font-medium w-[72px]">
              {cat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
