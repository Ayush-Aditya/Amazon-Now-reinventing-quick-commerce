import { AnimatePresence, motion } from 'framer-motion';
import useStore from './store/useStore';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import TrackingPage from './pages/TrackingPage';
import NotificationsPage from './pages/NotificationsPage';
import ChatOverlay from './components/AI/ChatOverlay';
import FloatingAIButton from './components/Layout/FloatingAIButton';
import PaymentSuccess from './components/Cart/PaymentSuccess';

// Page transition: tiny horizontal slide + fade. Easing is the standard
// Material out-curve. Don't push the slide further; on a 390px frame
// anything bigger looks like a glitch.
const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, x: -20, transition: { duration: 0.18 } }
};

function App() {
  const { currentScreen } = useStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':          return <HomePage          key="home" />;
      case 'cart':          return <CartPage          key="cart" />;
      case 'tracking':      return <TrackingPage      key="tracking" />;
      case 'notifications': return <NotificationsPage key="notifications" />;
      default:              return <HomePage          key="home" />;
    }
  };

  // The outer div is a hard 390x844 phone frame — the whole prototype is
  // built to look like a mobile screen on desktop. ChatOverlay and
  // PaymentSuccess use absolute positioning inside this frame, so they
  // need it to be position:relative.
  return (
    <div
      className="bg-white relative overflow-hidden border border-gray-700"
      style={{
        width: '390px',
        height: 'min(844px, calc(100vh - 24px))',
        borderRadius: 0
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* The floating "Cart AI" button only appears on home — every other
          screen has its own primary action and a second floating button
          would just compete for attention. */}
      {currentScreen === 'home' && <FloatingAIButton />}
      <ChatOverlay />
      <PaymentSuccess />
    </div>
  );
}

export default App;
