
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-cream-50 to-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          {/* Hero content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight animate-fade-in">
                Discover & Share <span className="text-sage-500">Delicious</span> Recipes
              </h1>
              <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-600 max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Join our community of home cooks and food enthusiasts to find inspiration for your next meal or share your culinary creations.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Link to="/recipes">
                  <Button className="bg-sage-500 hover:bg-sage-600 text-white font-medium py-3 px-6 rounded-lg">
                    Explore Recipes
                  </Button>
                </Link>
                <Link to="/create-recipe">
                  <Button variant="outline" className="border-sage-500 text-sage-500 hover:bg-sage-50 font-medium py-3 px-6 rounded-lg">
                    Submit Your Recipe
                  </Button>
                </Link>
              </div>
              <div className="mt-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center space-x-2">
                  
                  <div className="text-sm text-gray-600">
                    Join <span className="font-semibold text-sage-500">10,000+</span> foodies in our community
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center relative">
              <div className="absolute bottom-0 right-0 bg-terracotta-500 rounded-full h-44 w-44 -z-10 opacity-20"></div>
              <div className="absolute top-0 left-0 bg-sage-500 rounded-full h-24 w-24 -z-10 opacity-20"></div>
              <div className="relative rounded-lg overflow-hidden shadow-xl animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <img 
                  src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Delicious Food" 
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Curved bottom */}
      <div className="absolute bottom-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-white">
          <path d="M0,64L60,53.3C120,43,240,21,360,21.3C480,21,600,43,720,53.3C840,64,960,64,1080,56C1200,48,1320,32,1380,24L1440,16L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
