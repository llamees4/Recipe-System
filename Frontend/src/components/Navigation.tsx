import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogIn, UserPlus, UserCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";

interface Recipe {
  _id: string;
  title: string;
  ingredients?: string[];
  style?: string;
  mood?: string;
}

interface UserData {
  username?: string;
}

interface RecipeSuggestionResult {
  recipes: Recipe[];
  suggestions: string[];
}

const Navigation = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user
    fetch("/api/user/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: UserData | null) => {
        if (data?.username) setUsername(data.username);
      })
      .catch(() => {});

    // Fetch recipes for suggestions
    fetch('http://localhost:5001/api/recipe', { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then((data: Recipe[]) => setRecipes(data))
      .catch(() => {});
  }, []);

  const getAllSuggestions = (query: string): RecipeSuggestionResult => {
    if (!query.trim()) return { recipes: [], suggestions: [] };
    const queryLower = query.toLowerCase();
    
    const matchingRecipes = recipes.filter((recipe) => {
      return (
        recipe.title.toLowerCase().includes(queryLower) ||
        recipe.ingredients?.some((ing: string) => ing.toLowerCase().includes(queryLower)) ||
        (recipe.style && recipe.style.toLowerCase().includes(queryLower)) ||
        (recipe.mood && recipe.mood.toLowerCase().includes(queryLower))
      );
    });

    return {
      recipes: matchingRecipes,
      suggestions: matchingRecipes.map(recipe => recipe.title).slice(0, 8)
    };
  };

  const handleSearch = (query: string) => {
    navigate(`/recipes?search=${encodeURIComponent(query)}`);
    setIsMenuOpen(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const { recipes: matchingRecipes } = getAllSuggestions(suggestion);
    const selectedRecipe = matchingRecipes.find(recipe => recipe.title === suggestion);
    if (selectedRecipe) {
      navigate(`/recipe/${selectedRecipe._id}`);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-cream-50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-sage-500" />
              <span className="ml-2 text-xl font-display font-semibold text-sage-500">DishHub</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="relative w-64">
              <SearchInput
                onSearch={handleSearch}
                getSuggestions={(query) => getAllSuggestions(query).suggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            </div>

            <Link to="/recipes">
              <Button variant="ghost" className="text-gray-800 hover:bg-sage-100 hover:text-sage-600">
                Recipes
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="ghost" className="text-gray-800 hover:bg-sage-100 hover:text-sage-600">
                Categories
              </Button>
            </Link>

            {/* User section */}
            <div className="flex items-center space-x-2 ml-4">
              {username ? (
                <Link to="/profile">
                  <UserCircle className="w-7 h-7 text-sage-600 hover:text-sage-800" />
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-sage-500 hover:bg-sage-600 text-white flex items-center space-x-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sage-500">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-cream-50 pt-2 pb-4 border-t border-gray-200">
          <div className="px-4 mb-3">
            <SearchInput
              onSearch={handleSearch}
              getSuggestions={(query) => getAllSuggestions(query).suggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
          <div className="space-y-1 px-2">
            <Link to="/recipes" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full text-left text-gray-800 hover:bg-sage-100 hover:text-sage-600">
                Recipes
              </Button>
            </Link>
            <Link to="/categories" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full text-left text-gray-800 hover:bg-sage-100 hover:text-sage-600">
                Categories
              </Button>
            </Link>
            {username ? (
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left text-sage-600 hover:bg-sage-100">
                  <UserCircle className="inline w-5 h-5 mr-2" /> Profile
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-left flex items-center space-x-2 text-gray-800 hover:bg-sage-100 hover:text-sage-600">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full text-left bg-sage-500 hover:bg-sage-600 text-white flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;