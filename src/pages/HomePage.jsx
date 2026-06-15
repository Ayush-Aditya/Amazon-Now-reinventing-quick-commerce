import Header from '../components/Home/Header';
import NotificationBanner from '../components/Home/NotificationBanner';
import DeliveryBanner from '../components/Home/DeliveryBanner';
import CategoryGrid from '../components/Home/CategoryGrid';
import PromoBanner from '../components/Home/PromoBanner';
import OrderAgain from '../components/Home/OrderAgain';
import HotDeals from '../components/Home/HotDeals';

export default function HomePage() {
  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-white pb-20">
      <Header />
      <NotificationBanner />
      <DeliveryBanner />
      <CategoryGrid />
      <PromoBanner />
      <OrderAgain />
      <HotDeals />
    </div>
  );
}
