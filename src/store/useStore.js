import { create } from 'zustand';
import { darkstoreDB } from '../data/products';

// Single global store. Kept flat on purpose — slicing this into multiple
// stores adds noise we don't need for an app this size. Group sections
// with comments rather than splitting files.

const useStore = create((set, get) => ({

  // navigation -----------------------------------------------------------
  // currentScreen drives <App>'s page switch. Keep it stringy; routing here
  // would buy us nothing.
  currentScreen: 'home',                // home | cart | tracking | notifications
  setScreen: (screen) => set({ currentScreen: screen }),

  // cart -----------------------------------------------------------------
  // cartItems are *resolved* product objects (price, name, image, qty),
  // not just ids — so the cart page never has to hit the catalog again.
  cartItems: [],
  cartSource: '',

  // setCart is the only path into the cart from the AI / preloaded carts.
  // It enforces the anti-hallucination rule: any id that isn't in
  // darkstoreDB is silently dropped. Bad ids never reach the UI.
  setCart: (items, source = 'AI-Compiled Cart • Verified from Darkstore') => {
    const validatedItems = items
      .filter(item => darkstoreDB[item.id])
      .map(item => ({ ...darkstoreDB[item.id], qty: item.qty || 1 }));
    set({ cartItems: validatedItems, cartSource: source });
  },

  updateQty: (index, delta) => set((state) => {
    const next = [...state.cartItems];
    next[index] = { ...next[index], qty: Math.max(1, next[index].qty + delta) };
    return { cartItems: next };
  }),

  removeItem: (index) => set((state) => ({
    cartItems: state.cartItems.filter((_, i) => i !== index)
  })),

  // 5% tax is illustrative; real GST varies by category.
  getCartTotal: () => {
    const items = get().cartItems;
    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const tax = Math.round(subtotal * 0.05);
    return { subtotal, tax, delivery: 0, total: subtotal + tax };
  },

  // chat overlay ---------------------------------------------------------
  // Chat *content* (messages, suggestions, products) lives in <ChatOverlay>
  // local state — only the open/close flag is global so other components
  // (the header mic, the floating button) can poke it.
  isChatOpen: false,
  openChat:  () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),

  // order tracking -------------------------------------------------------
  // The tracking page advances its own internal step on a timer. The store
  // just remembers that an order is live so the home page could badge it.
  orderActive: false,
  orderStep: 0,                         // 0 ordered, 1 packing, 2 out for delivery
  startOrder: () => set({ orderActive: true, orderStep: 0 }),
  advanceOrderStep: () => set((state) => ({ orderStep: Math.min(2, state.orderStep + 1) })),

  // payment success overlay ---------------------------------------------
  paymentSuccess: false,
  setPaymentSuccess: (val) => set({ paymentSuccess: val })
}));

export default useStore;
