// Server-side mirror of the catalog. The frontend has its own copy in
// src/data/products.js (with image fallbacks and local overrides) — that's
// fine: the server only needs id/name/category/price for the LLM prompt
// and id-validation, and the frontend handles all rendering.
//
// If you change one catalog, change the other. They aren't auto-synced.

export const darkstoreCatalog = [
  // ===== SNACKS & DRINKS =====
  { id: 'SD-001', name: 'Coca-Cola (Pack of 6)', price: 180, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80', category: 'Snacks & Drinks' },
  { id: 'SD-002', name: 'Sprite 1.5L', price: 75, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&q=80', category: 'Snacks & Drinks' },
  { id: 'SD-003', name: 'Lays Classic Party Pack', price: 60, image: 'https://images.unsplash.com/photo-1566478431377-70a5160c9f5d?w=300&q=80', category: 'Snacks & Drinks' },
  { id: 'SD-004', name: 'Kurkure Masala Munch (Pack of 3)', price: 45, image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=300&q=80', category: 'Snacks & Drinks' },
  { id: 'SD-005', name: "Haldiram's Namkeen Mix 400g", price: 120, image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&q=80', category: 'Snacks & Drinks' },
  { id: 'SD-006', name: 'Hide & Seek Chocolate Cookies', price: 35, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&q=80', category: 'Snacks & Drinks' },
  { id: 'SD-007', name: 'Paper Cups (Pack of 50)', price: 80, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&q=80', category: 'Snacks & Drinks' },
  { id: 'SD-008', name: 'Tropicana Orange Juice 1L', price: 95, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&q=80', category: 'Snacks & Drinks' },
  { id: 'SD-009', name: 'Red Bull Energy Drink 250ml', price: 115, image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=300&q=80', category: 'Snacks & Drinks' },
  { id: 'SD-010', name: 'Maggi Instant Noodles (Pack of 4)', price: 56, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&q=80', category: 'Snacks & Drinks' },

  // ===== GROCERY ESSENTIALS =====
  { id: 'GE-001', name: 'Moong Dal Premium (500g)', price: 75, image: 'https://images.unsplash.com/photo-1585994688924-f7b57b6f6d5c?w=300&q=80', category: 'Grocery Essentials' },
  { id: 'GE-002', name: 'Daawat Basmati Rice (1kg)', price: 110, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80', category: 'Grocery Essentials' },
  { id: 'GE-003', name: 'Aashirvaad Atta (5kg)', price: 275, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80', category: 'Grocery Essentials' },
  { id: 'GE-004', name: 'Toor Dal (1kg)', price: 140, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80', category: 'Grocery Essentials' },
  { id: 'GE-005', name: 'Fortune Sunflower Oil (1L)', price: 155, image: 'https://images.unsplash.com/photo-1474979266404-7f28e4cba32d?w=300&q=80', category: 'Grocery Essentials' },
  { id: 'GE-006', name: 'Amul Pure Ghee (500ml)', price: 290, image: 'https://images.unsplash.com/photo-1631209121750-a9f656d28f5e?w=300&q=80', category: 'Grocery Essentials' },
  { id: 'GE-007', name: 'Turmeric Powder (100g)', price: 32, image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&q=80', category: 'Grocery Essentials' },
  { id: 'GE-008', name: 'Cumin Seeds / Jeera (100g)', price: 45, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80', category: 'Grocery Essentials' },
  { id: 'GE-009', name: 'Biryani Masala (50g)', price: 55, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80', category: 'Grocery Essentials' },
  { id: 'GE-010', name: 'Aged Basmati Rice (2kg)', price: 320, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80', category: 'Grocery Essentials' },

  // ===== DAIRY & FRESH =====
  { id: 'DF-001', name: 'Amul Milk (1L)', price: 60, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80', category: 'Dairy & Fresh' },
  { id: 'DF-002', name: 'White Bread (400g)', price: 40, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300&q=80', category: 'Dairy & Fresh' },
  { id: 'DF-003', name: 'Eggs (6 pcs)', price: 55, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&q=80', category: 'Dairy & Fresh' },
  { id: 'DF-004', name: 'Bananas (6 pcs)', price: 40, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80', category: 'Dairy & Fresh' },
  { id: 'DF-005', name: 'Fresh Yogurt (400g)', price: 45, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80', category: 'Dairy & Fresh' },
  { id: 'DF-006', name: 'Onions (1kg)', price: 35, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&q=80', category: 'Dairy & Fresh' },
  { id: 'DF-007', name: 'Fresh Mint Leaves (100g)', price: 15, image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=300&q=80', category: 'Dairy & Fresh' },
  { id: 'DF-008', name: 'Coconut Water (Pack of 3)', price: 90, image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=300&q=80', category: 'Dairy & Fresh' },

  // ===== HEALTH & PHARMA =====
  { id: 'HP-001', name: 'Crocin Paracetamol', price: 30, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80', category: 'Health & Pharma' },
  { id: 'HP-002', name: 'Gatorade Blue Bolt', price: 50, image: 'https://images.unsplash.com/photo-1622543715112-78bf1da94d37?w=300&q=80', category: 'Health & Pharma' },
  { id: 'HP-003', name: 'Electral ORS (Pack of 3)', price: 36, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&q=80', category: 'Health & Pharma' },
  { id: 'HP-004', name: 'Vitamin C Tablets (30s)', price: 180, image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&q=80', category: 'Health & Pharma' },
  { id: 'HP-005', name: 'Digene Antacid Gel', price: 75, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80', category: 'Health & Pharma' },

  // ===== CELEBRATIONS & GIFTS =====
  { id: 'CB-001', name: 'Exotic Red Roses Bouquet', price: 399, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=300&q=80', category: 'Celebrations' },
  { id: 'CB-002', name: 'Cadbury Silk Valentines Pack', price: 175, image: 'https://images.unsplash.com/photo-1548907040-4d42b52115ca?w=300&q=80', category: 'Celebrations' },
  { id: 'CB-003', name: 'Greeting Card (Premium)', price: 50, image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&q=80', category: 'Celebrations' },
  { id: 'CB-004', name: 'Scented Candle (Lavender)', price: 199, image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=300&q=80', category: 'Celebrations' },
  { id: 'CB-005', name: 'Ferrero Rocher (16 pcs)', price: 350, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&q=80', category: 'Celebrations' },

  // ===== BREAKFAST & BEVERAGES =====
  { id: 'BB-001', name: 'Quaker Oats (1kg)', price: 185, image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=300&q=80', category: 'Breakfast' },
  { id: 'BB-002', name: 'Nescafe Classic Coffee (100g)', price: 225, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&q=80', category: 'Breakfast' },
  { id: 'BB-003', name: 'Dabur Honey (500g)', price: 215, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&q=80', category: 'Breakfast' },
  { id: 'BB-004', name: 'Dark Chocolate Bar (72% Cocoa)', price: 120, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&q=80', category: 'Breakfast' },
  { id: 'BB-005', name: 'Almonds (200g)', price: 230, image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=300&q=80', category: 'Breakfast' },
  { id: 'BB-006', name: 'Green Tea (25 bags)', price: 145, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80', category: 'Breakfast' },
  { id: 'BB-007', name: 'Energy Bar (Pack of 6)', price: 180, image: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=300&q=80', category: 'Breakfast' },

  // ===== SPICES =====
  { id: 'SP-001', name: 'Saffron (1g Premium)', price: 250, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80', category: 'Spices' },
  { id: 'SP-002', name: 'Bay Leaves (50g)', price: 25, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80', category: 'Spices' },
  { id: 'SP-003', name: 'Green Cardamom (20g)', price: 85, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80', category: 'Spices' },
  { id: 'SP-004', name: 'Cinnamon Sticks (50g)', price: 55, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80', category: 'Spices' },
  { id: 'SP-005', name: 'Cloves (25g)', price: 65, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80', category: 'Spices' },

  // ===== QUICK BITES =====
  { id: 'QB-001', name: 'Besan / Gram Flour (500g)', price: 55, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80', category: 'Quick Bites' },
  { id: 'QB-002', name: 'Green Chillies (100g)', price: 10, image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=300&q=80', category: 'Quick Bites' },
  { id: 'QB-003', name: 'Tea Leaves / Chai Patti (250g)', price: 110, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=300&q=80', category: 'Quick Bites' },
  { id: 'QB-004', name: 'Fresh Ginger (100g)', price: 20, image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&q=80', category: 'Quick Bites' },
  { id: 'QB-005', name: 'Parle-G Biscuits (Pack of 6)', price: 60, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&q=80', category: 'Quick Bites' }
];

// Index by ID for O(1) lookups
const catalogIndex = Object.fromEntries(darkstoreCatalog.map(p => [p.id, p]));

export function getProductById(id) {
  return catalogIndex[id] || null;
}

export function getProductsByCategory(category) {
  return darkstoreCatalog.filter(p => p.category === category);
}

export function validateIds(ids) {
  return ids.filter(id => catalogIndex[id] !== undefined);
}
