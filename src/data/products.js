// The mock darkstore catalog. The AI is told to recommend strictly from
// these IDs (see server/index.js) and the cart never accepts an unknown id
// (see useStore.setCart). That's the whole anti-hallucination story.
//
// `image` is the URL we render. By default it's a stable Unsplash photo.
// `fallback` is an inline SVG data URI used by ProductImage when the
// network image fails — that way the UI never shows a broken image icon.
//
// At the bottom of this file we override `image` for any product that has
// a real local photo shipped under /public/images. Local always wins.

// Inline-SVG fallback. Dropped the emoji argument that older entries
// still pass — the brand name on a colour block is enough.
function svgCard(label, color1, color2 = null) {
  const c2 = color2 || color1;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${color1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs>
    <rect width="300" height="300" fill="url(#g)"/>
    <rect x="20" y="20" width="260" height="260" fill="white" opacity="0.95"/>
    <text x="150" y="160" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="#1F2937">${label}</text>
    <text x="150" y="200" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="500" text-anchor="middle" fill="#6B7280" letter-spacing="2">DARKSTORE</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Real product photos shipped under /public/images. The filenames the user
// dropped in have spaces, so we URL-encode here once instead of per call.
const local = {
  'SD-001': '/images/pack%20of%206%20coca%20cola.png',          // Coca-Cola
  'SD-003': '/images/lays%20classic%20salted%20.png',           // Lay's
  'GE-005': '/images/fortune%20oil.png',                        // Fortune Oil
  'GE-007': '/images/turmeric.png',                             // Turmeric
  'DF-001': '/images/amul%201%20litre%20.png',                  // Amul Milk
  'DF-008': '/images/coconut%20water%20pack%20of%203.png',      // Coconut Water (Pack of 3)
  'HP-001': '/images/paracetamol.png',                          // Crocin
  'HP-002': '/images/gatorade%20blue%20bolt.png',               // Gatorade
  'HP-003': '/images/ors.png',                                  // Electral ORS
  'BB-004': '/images/chocolate.png',                            // Dark Chocolate
  'BB-005': '/images/almonds.png',                              // Almonds
  'CB-001': '/images/bookey%20of%20rose.png'                    // Roses
};

// Unsplash with a stable photo id — no resizing service hops.
const u = (id, q = 80) => `https://images.unsplash.com/${id}?w=400&q=${q}&auto=format`;

export const darkstoreDB = {
  // SNACKS & DRINKS
  'SD-001': { id: 'SD-001', name: 'Coca-Cola (Pack of 6)', price: 180, image: u('photo-1554866585-cd94860890b7'), fallback: svgCard('Coca-Cola', '#E60012', '#B30009', '🥤'), category: 'Snacks & Drinks' },
  'SD-002': { id: 'SD-002', name: 'Sprite 1.5L', price: 75, image: u('photo-1625772299848-391b6a87d7b3'), fallback: svgCard('Sprite', '#1AAD3F', '#0F8030', '🥤'), category: 'Snacks & Drinks' },
  'SD-003': { id: 'SD-003', name: "Lay's Classic Salted Chips", price: 60, image: u('photo-1621447504864-d8686e12698c'), fallback: svgCard("Lay's", '#FFD600', '#F9A825', '🍟'), category: 'Snacks & Drinks' },
  'SD-004': { id: 'SD-004', name: 'Kurkure Masala Munch (3 pack)', price: 45, image: u('photo-1599490659213-e2b9527bd087'), fallback: svgCard('Kurkure', '#F57C00', '#E65100', '🌶️'), category: 'Snacks & Drinks' },
  'SD-005': { id: 'SD-005', name: "Haldiram's Namkeen Mix 400g", price: 120, image: u('photo-1601050690597-df0568f70950'), fallback: svgCard("Haldiram's", '#D32F2F', '#B71C1C', '🥨'), category: 'Snacks & Drinks' },
  'SD-006': { id: 'SD-006', name: 'Hide & Seek Cookies', price: 35, image: u('photo-1499636136210-6f4ee915583e'), fallback: svgCard('Hide & Seek', '#3E2723', '#1B0000', '🍪'), category: 'Snacks & Drinks' },
  'SD-007': { id: 'SD-007', name: 'Paper Cups (Pack of 50)', price: 80, image: u('photo-1514228742587-6b1558fcca3d'), fallback: svgCard('Paper Cups', '#FFFFFF', '#E0E0E0', '🥤'), category: 'Snacks & Drinks' },
  'SD-008': { id: 'SD-008', name: 'Tropicana Orange Juice 1L', price: 95, image: u('photo-1600271886742-f049cd451bba'), fallback: svgCard('Tropicana', '#FF6F00', '#E65100', '🍊'), category: 'Snacks & Drinks' },
  'SD-009': { id: 'SD-009', name: 'Red Bull 250ml', price: 115, image: u('photo-1527960471264-932f39eb5846'), fallback: svgCard('Red Bull', '#003B7A', '#00264D', '⚡'), category: 'Snacks & Drinks' },
  'SD-010': { id: 'SD-010', name: 'Maggi Noodles (Pack of 4)', price: 56, image: u('photo-1612929633738-8fe44f7ec841'), fallback: svgCard('Maggi', '#FFD600', '#F57F17', '🍜'), category: 'Snacks & Drinks' },

  // GROCERY ESSENTIALS
  'GE-001': { id: 'GE-001', name: 'Moong Dal Premium (500g)', price: 75, image: u('photo-1613844237701-8f3664fc2eff'), fallback: svgCard('Moong Dal', '#FFB300', '#FF8F00', '🫘'), category: 'Grocery Essentials' },
  'GE-002': { id: 'GE-002', name: 'Daawat Basmati Rice (1kg)', price: 110, image: u('photo-1536304993881-070a87a58d97'), fallback: svgCard('Daawat Rice', '#5D4037', '#3E2723', '🍚'), category: 'Grocery Essentials' },
  'GE-003': { id: 'GE-003', name: 'Aashirvaad Atta (5kg)', price: 275, image: u('photo-1574323347407-f5e1ad6d020b'), fallback: svgCard('Aashirvaad', '#C62828', '#8B0000', '🌾'), category: 'Grocery Essentials' },
  'GE-004': { id: 'GE-004', name: 'Toor Dal (1kg)', price: 140, image: u('photo-1585994688924-f7b57b6f6d5c'), fallback: svgCard('Toor Dal', '#FFC107', '#FF8F00', '🫘'), category: 'Grocery Essentials' },
  'GE-005': { id: 'GE-005', name: 'Fortune Sunflower Oil (1L)', price: 155, image: u('photo-1474979266404-7f28e4cba32d'), fallback: svgCard('Fortune Oil', '#FFD600', '#F57F17', '🛢️'), category: 'Grocery Essentials' },
  'GE-006': { id: 'GE-006', name: 'Amul Pure Ghee (500ml)', price: 290, image: u('photo-1631209121750-a9f656d28f5e'), fallback: svgCard('Amul Ghee', '#FFA000', '#E65100', '🧈'), category: 'Grocery Essentials' },
  'GE-007': { id: 'GE-007', name: 'Turmeric Powder (100g)', price: 32, image: u('photo-1615485500704-8e990f9900f7'), fallback: svgCard('Haldi', '#FFA000', '#E65100', '🌶️'), category: 'Grocery Essentials' },
  'GE-008': { id: 'GE-008', name: 'Cumin Seeds / Jeera (100g)', price: 45, image: u('photo-1599909533144-fe84a0f15834'), fallback: svgCard('Jeera', '#6D4C41', '#3E2723', '🌱'), category: 'Grocery Essentials' },
  'GE-009': { id: 'GE-009', name: 'Biryani Masala (50g)', price: 55, image: u('photo-1596040033229-a9821ebd058d'), fallback: svgCard('Biryani Masala', '#BF360C', '#5D1900', '🍛'), category: 'Grocery Essentials' },
  'GE-010': { id: 'GE-010', name: 'Aged Basmati Rice (2kg)', price: 320, image: u('photo-1536304993881-070a87a58d97'), fallback: svgCard('Aged Basmati', '#8D6E63', '#5D4037', '🍚'), category: 'Grocery Essentials' },

  // DAIRY & FRESH
  'DF-001': { id: 'DF-001', name: 'Amul Milk (1L)', price: 60, image: u('photo-1550583724-b2692b85b150'), fallback: svgCard('Amul Milk', '#1976D2', '#0D47A1', '🥛'), category: 'Dairy & Fresh' },
  'DF-002': { id: 'DF-002', name: 'White Bread (400g)', price: 40, image: u('photo-1509440159596-0249088772ff'), fallback: svgCard('Bread', '#FFC107', '#F57F17', '🍞'), category: 'Dairy & Fresh' },
  'DF-003': { id: 'DF-003', name: 'Eggs (6 pcs)', price: 55, image: u('photo-1506976785307-8732e854ad03'), fallback: svgCard('Eggs', '#FFE082', '#FFA000', '🥚'), category: 'Dairy & Fresh' },
  'DF-004': { id: 'DF-004', name: 'Bananas (6 pcs)', price: 40, image: u('photo-1603833665858-e61d17a86224'), fallback: svgCard('Bananas', '#FFEB3B', '#F9A825', '🍌'), category: 'Dairy & Fresh' },
  'DF-005': { id: 'DF-005', name: 'Fresh Yogurt (400g)', price: 45, image: u('photo-1488477181946-6428a0291777'), fallback: svgCard('Yogurt', '#FAFAFA', '#E0E0E0', '🥣'), category: 'Dairy & Fresh' },
  'DF-006': { id: 'DF-006', name: 'Onions (1kg)', price: 35, image: u('photo-1618512496248-a07fe83aa8cb'), fallback: svgCard('Onions', '#7B1FA2', '#4A148C', '🧅'), category: 'Dairy & Fresh' },
  'DF-007': { id: 'DF-007', name: 'Fresh Mint (100g)', price: 15, image: u('photo-1628556270448-4d4e4148e1b1'), fallback: svgCard('Mint', '#388E3C', '#1B5E20', '🌿'), category: 'Dairy & Fresh' },
  'DF-008': { id: 'DF-008', name: 'Coconut Water (Pack of 3)', price: 90, image: u('photo-1536657464919-892534f60d6e'), fallback: svgCard('Coconut Water', '#A1887F', '#5D4037', '🥥'), category: 'Dairy & Fresh' },

  // HEALTH & PHARMA
  'HP-001': { id: 'HP-001', name: 'Crocin Paracetamol', price: 30, image: u('photo-1584308666744-24d5c474f2ae'), fallback: svgCard('Crocin', '#FF5722', '#BF360C', '💊'), category: 'Health & Pharma' },
  'HP-002': { id: 'HP-002', name: 'Gatorade Blue Bolt', price: 50, image: u('photo-1622543715112-78bf1da94d37'), fallback: svgCard('Gatorade', '#1976D2', '#0D47A1', '🥤'), category: 'Health & Pharma' },
  'HP-003': { id: 'HP-003', name: 'Electral ORS (Pack of 3)', price: 36, image: u('photo-1587854692152-cbe660dbde88'), fallback: svgCard('Electral ORS', '#03A9F4', '#01579B', '💧'), category: 'Health & Pharma' },
  'HP-004': { id: 'HP-004', name: 'Vitamin C Tablets', price: 180, image: u('photo-1550572017-edd951aa8f72'), fallback: svgCard('Vitamin C', '#FFA000', '#E65100', '💊'), category: 'Health & Pharma' },
  'HP-005': { id: 'HP-005', name: 'Digene Antacid Gel', price: 75, image: u('photo-1471864190281-a93a3070b6de'), fallback: svgCard('Digene', '#26A69A', '#00695C', '💊'), category: 'Health & Pharma' },

  // CELEBRATIONS & GIFTS
  'CB-001': { id: 'CB-001', name: 'Exotic Red Roses Bouquet', price: 399, image: u('photo-1490750967868-88aa4f44e3e2'), fallback: svgCard('Red Roses', '#D32F2F', '#8B0000', '🌹'), category: 'Celebrations' },
  'CB-002': { id: 'CB-002', name: 'Cadbury Silk Valentines', price: 175, image: u('photo-1549007994-cb92caebd54b'), fallback: svgCard('Cadbury Silk', '#4A148C', '#311B92', '🍫'), category: 'Celebrations' },
  'CB-003': { id: 'CB-003', name: 'Greeting Card (Premium)', price: 50, image: u('photo-1513151233558-d860c5398176'), fallback: svgCard('Greeting Card', '#E91E63', '#AD1457', '💌'), category: 'Celebrations' },
  'CB-004': { id: 'CB-004', name: 'Scented Candle (Lavender)', price: 199, image: u('photo-1602028915047-37269d1a73f7'), fallback: svgCard('Candle', '#7E57C2', '#4527A0', '🕯️'), category: 'Celebrations' },
  'CB-005': { id: 'CB-005', name: 'Ferrero Rocher (16 pcs)', price: 350, image: u('photo-1606312619070-d48b4c652a52'), fallback: svgCard('Ferrero Rocher', '#FFA000', '#E65100', '🍫'), category: 'Celebrations' },

  // BREAKFAST
  'BB-001': { id: 'BB-001', name: 'Quaker Oats (1kg)', price: 185, image: u('photo-1517673400267-0251440c45dc'), fallback: svgCard('Quaker Oats', '#1565C0', '#0D47A1', '🌾'), category: 'Breakfast' },
  'BB-002': { id: 'BB-002', name: 'Nescafe Coffee (100g)', price: 225, image: u('photo-1559056199-641a0ac8b55e'), fallback: svgCard('Nescafe', '#D84315', '#BF360C', '☕'), category: 'Breakfast' },
  'BB-003': { id: 'BB-003', name: 'Dabur Honey (500g)', price: 215, image: u('photo-1587049352846-4a222e784d38'), fallback: svgCard('Dabur Honey', '#F57F17', '#E65100', '🍯'), category: 'Breakfast' },
  'BB-004': { id: 'BB-004', name: 'Dark Chocolate Bar', price: 120, image: u('photo-1606312619070-d48b4c652a52'), fallback: svgCard('Dark Chocolate', '#3E2723', '#1B0000', '🍫'), category: 'Breakfast' },
  'BB-005': { id: 'BB-005', name: 'Almonds (200g)', price: 230, image: u('photo-1508061253366-f7da158b6d46'), fallback: svgCard('Almonds', '#8D6E63', '#5D4037', '🥜'), category: 'Breakfast' },
  'BB-006': { id: 'BB-006', name: 'Green Tea (25 bags)', price: 145, image: u('photo-1564890369478-c89ca6d9cde9'), fallback: svgCard('Green Tea', '#388E3C', '#1B5E20', '🍵'), category: 'Breakfast' },
  'BB-007': { id: 'BB-007', name: 'Energy Bar (Pack of 6)', price: 180, image: u('photo-1622484212850-eb596d769edc'), fallback: svgCard('Energy Bar', '#F57C00', '#E65100', '🍫'), category: 'Breakfast' },

  // SPICES
  'SP-001': { id: 'SP-001', name: 'Saffron (1g Premium)', price: 250, image: u('photo-1625178550247-cbed2e261e01'), fallback: svgCard('Saffron', '#D32F2F', '#8B0000', '🌸'), category: 'Spices' },
  'SP-002': { id: 'SP-002', name: 'Bay Leaves (50g)', price: 25, image: u('photo-1506905925346-21bda4d32df4'), fallback: svgCard('Bay Leaves', '#558B2F', '#33691E', '🍃'), category: 'Spices' },
  'SP-003': { id: 'SP-003', name: 'Green Cardamom (20g)', price: 85, image: u('photo-1596040033229-a9821ebd058d'), fallback: svgCard('Cardamom', '#7CB342', '#558B2F', '🌱'), category: 'Spices' },
  'SP-004': { id: 'SP-004', name: 'Cinnamon Sticks (50g)', price: 55, image: u('photo-1587131782738-de30ea91a542'), fallback: svgCard('Cinnamon', '#6D4C41', '#3E2723', '🟫'), category: 'Spices' },
  'SP-005': { id: 'SP-005', name: 'Cloves (25g)', price: 65, image: u('photo-1599909533144-fe84a0f15834'), fallback: svgCard('Cloves', '#5D4037', '#3E2723', '🌿'), category: 'Spices' },

  // QUICK BITES
  'QB-001': { id: 'QB-001', name: 'Besan / Gram Flour (500g)', price: 55, image: u('photo-1574323347407-f5e1ad6d020b'), fallback: svgCard('Besan', '#FFA000', '#E65100', '🌾'), category: 'Quick Bites' },
  'QB-002': { id: 'QB-002', name: 'Green Chillies (100g)', price: 10, image: u('photo-1583119022894-919a68a3d0e3'), fallback: svgCard('Green Chillies', '#388E3C', '#1B5E20', '🌶️'), category: 'Quick Bites' },
  'QB-003': { id: 'QB-003', name: 'Tea Leaves (250g)', price: 110, image: u('photo-1564890369478-c89ca6d9cde9'), fallback: svgCard('Chai Patti', '#F57C00', '#E65100', '🍵'), category: 'Quick Bites' },
  'QB-004': { id: 'QB-004', name: 'Fresh Ginger (100g)', price: 20, image: u('photo-1615485500704-8e990f9900f7'), fallback: svgCard('Ginger', '#FFA726', '#F57C00', '🫚'), category: 'Quick Bites' },
  'QB-005': { id: 'QB-005', name: 'Parle-G Biscuits (Pack of 6)', price: 60, image: u('photo-1499636136210-6f4ee915583e'), fallback: svgCard('Parle-G', '#FBC02D', '#F9A825', '🍪'), category: 'Quick Bites' },
};

export function getProduct(id) { return darkstoreDB[id] || null; }
export function getByCategory(category) { return Object.values(darkstoreDB).filter(p => p.category === category); }
export function getAllProducts() { return Object.values(darkstoreDB); }
export function validateProductIds(ids) { return ids.filter(id => darkstoreDB[id] !== undefined); }

// Local images take precedence over the Unsplash defaults. Doing this in a
// post-pass keeps each catalog row a single line — no per-row branching.
Object.entries(local).forEach(([id, path]) => {
  if (darkstoreDB[id]) {
    darkstoreDB[id].image = path;
    darkstoreDB[id].hasLocalImage = true;
  }
});
