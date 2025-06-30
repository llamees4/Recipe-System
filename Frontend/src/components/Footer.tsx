
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cream-100 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and tagline */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-display font-semibold text-sage-500">DishHub</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Discover, create, and share delicious recipes with our cooking community.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-sage-500">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-sage-500">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-sage-500">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-sage-500">
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/recipes" className="text-gray-600 hover:text-sage-500">All Recipes</Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-sage-500">Categories</Link>
              </li>
              <li>
                <Link to="/popular" className="text-gray-600 hover:text-sage-500">Popular</Link>
              </li>
              <li>
                <Link to="/recent" className="text-gray-600 hover:text-sage-500">Recent</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Categories</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/category/breakfast" className="text-gray-600 hover:text-sage-500">Breakfast</Link>
              </li>
              <li>
                <Link to="/category/lunch" className="text-gray-600 hover:text-sage-500">Lunch</Link>
              </li>
              <li>
                <Link to="/category/dinner" className="text-gray-600 hover:text-sage-500">Dinner</Link>
              </li>
              <li>
                <Link to="/category/dessert" className="text-gray-600 hover:text-sage-500">Desserts</Link>
              </li>
              <li>
                <Link to="/category/vegan" className="text-gray-600 hover:text-sage-500">Vegan</Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Help</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-sage-500">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-sage-500">Contact</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-sage-500">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-sage-500">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-300 pt-6 flex justify-between">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} DishHub. All rights reserved.</p>
          <p className="text-sm text-gray-500">Made with ❤️ for foodies</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
