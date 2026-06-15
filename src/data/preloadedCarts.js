// PRELOADED CART NOTIFICATIONS
// Context-aware push notifications with pre-built carts

export const preloadedCarts = [
  {
    id: 'valentine',
    emoji: '💝',
    title: "Valentine's Day Special!",
    body: "We preloaded a cart for your partner. Roses, chocolate, and a surprise!",
    time: 'Just now',
    color: '#E91E63',
    items: [
      { id: 'CB-001', qty: 1 },
      { id: 'CB-002', qty: 1 },
      { id: 'CB-003', qty: 1 },
      { id: 'CB-004', qty: 1 }
    ]
  },
  {
    id: 'daily-grocery',
    emoji: '🥛',
    title: 'Good Morning!',
    body: 'Your daily essentials are ready — milk, bread, eggs & bananas. Tap to reorder!',
    time: '8:00 AM',
    color: '#4CAF50',
    items: [
      { id: 'DF-001', qty: 1 },
      { id: 'DF-002', qty: 1 },
      { id: 'DF-003', qty: 1 },
      { id: 'DF-004', qty: 1 }
    ]
  },
  {
    id: 'rainy-day',
    emoji: '🌧️',
    title: 'Rainy Evening Alert!',
    body: 'Perfect weather for chai & pakoras. We\'ve got a hot snack kit ready for you.',
    time: '4:30 PM',
    color: '#607D8B',
    items: [
      { id: 'QB-003', qty: 1 },
      { id: 'QB-004', qty: 1 },
      { id: 'QB-001', qty: 1 },
      { id: 'DF-006', qty: 1 },
      { id: 'QB-002', qty: 1 },
      { id: 'QB-005', qty: 1 }
    ]
  },
  {
    id: 'exam-season',
    emoji: '📚',
    title: 'Exam Season Brain Fuel',
    body: 'Late night study session? Coffee, dark chocolate, almonds & energy bars ready.',
    time: '9:00 PM',
    color: '#FF9800',
    items: [
      { id: 'BB-002', qty: 1 },
      { id: 'BB-004', qty: 2 },
      { id: 'BB-005', qty: 1 },
      { id: 'SD-010', qty: 2 },
      { id: 'BB-007', qty: 1 }
    ]
  },
  {
    id: 'monday-morning',
    emoji: '☀️',
    title: 'Start Your Week Right!',
    body: 'Healthy breakfast cart — oats, milk, honey, and fruits. Fresh start to Monday!',
    time: 'Mon 7:00 AM',
    color: '#FFC107',
    items: [
      { id: 'BB-001', qty: 1 },
      { id: 'DF-001', qty: 1 },
      { id: 'BB-003', qty: 1 },
      { id: 'DF-004', qty: 1 }
    ]
  },
  {
    id: 'weekend-party',
    emoji: '🎉',
    title: 'Weekend Plans?',
    body: 'Party pack for 6 people — chips, cold drinks, namkeen & cookies. One tap to order!',
    time: 'Sat 5:00 PM',
    color: '#9C27B0',
    items: [
      { id: 'SD-001', qty: 2 },
      { id: 'SD-003', qty: 4 },
      { id: 'SD-004', qty: 3 },
      { id: 'SD-005', qty: 1 },
      { id: 'SD-006', qty: 2 },
      { id: 'SD-007', qty: 1 }
    ]
  }
];

export default preloadedCarts;
