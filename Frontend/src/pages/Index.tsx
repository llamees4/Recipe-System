
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import StaticRecipeSearch from '@/components/StaticRecipeSearch';
import FeaturedRecipes from '@/components/FeaturedRecipes';
import Testimonials from '@/components/Testimonials';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Hero />
        <StaticRecipeSearch />
        <FeaturedRecipes />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
