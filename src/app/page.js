import HeroSection from '@/components/hero/HeroSection';
import BrowseByCategory from '@/components/home/BrowseByCategory';
import BestDeals from '@/components/home/BestDeals';
import TrustSection from '@/components/home/TrustSection';
import CustomerReviews from '@/components/home/CustomerReviews';
import FinancingBanner from '@/components/home/FinancingBanner';
import LatestBlog from '@/components/home/LatestBlog';
import RecentlyViewed from '@/components/home/RecentlyViewed';

/**
 * Landing page - Main entry point of the application
 * Features Hero, Categories, Best Deals, Trust Features, Financing, Reviews, Blog and Recently Viewed
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Browse By Category Section */}
      <BrowseByCategory />

      {/* Best Deals / Featured Cars */}
      <BestDeals />
      
      {/* Financing Banner Call to Action */}
      <FinancingBanner />

      {/* Premium Trust Section */}
      <TrustSection />

      {/* Customer Reviews Section */}
      <CustomerReviews />
      
      {/* Latest Blog Section */}
      <LatestBlog />
      
      {/* Recently Viewed Cars */}
      <RecentlyViewed />
    </div>
  );
}