import { useAppContext } from "../context/AppContext";

import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import DiscountBanner from "../components/DiscountBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import AppDownload from "../components/AppDownload";

const Home = () => {
  const { products, loading } = useAppContext();

  return (
    <div>

      <Hero />

      <Categories />

      <FeaturedProducts
        products={products}
        loading={loading}
      />

      <DiscountBanner />

      <WhyChooseUs />

      <AppDownload />

    </div>
  );
};

export default Home;