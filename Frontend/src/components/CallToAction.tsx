
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-sage-300 to-sage-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
          Ready to Share Your Culinary Creations?
        </h2>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
          Join our community of food enthusiasts and showcase your favorite recipes with the world.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup">
            <Button className="bg-white text-sage-600 hover:bg-gray-100 py-3 px-6 rounded-lg text-lg font-medium">
              Sign Up Now
            </Button>
          </Link>
          <Link to="/recipes">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 py-3 px-6 rounded-lg text-lg font-medium">
              Browse Recipes
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
