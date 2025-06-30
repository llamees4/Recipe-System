import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const StaticRecipeSearch = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchFromURL = queryParams.get('search') || '';

  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchFromURL);
  const [hasSearched, setHasSearched] = useState(!!searchFromURL);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/recipe', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to load recipes');
        const data = await response.json();
        setRecipes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    if (searchFromURL) {
      setSearchQuery(searchFromURL);
      setHasSearched(true);
      window.scrollTo(0, 0);
    }
  }, [searchFromURL]);

  const getAllSuggestions = () => {
    const suggestions = new Set<string>();
    recipes.forEach((recipe: any) => {
      suggestions.add(recipe.title);
      recipe.ingredients?.forEach((ingredient: string) => suggestions.add(ingredient));
      if (recipe.style) suggestions.add(recipe.style);
      if (recipe.mood) suggestions.add(recipe.mood);
    });
    return Array.from(suggestions).sort();
  };

  const getSuggestions = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return getAllSuggestions()
      .filter((s) => s.toLowerCase().includes(query))
      .slice(0, 8);
  };

  const suggestions = getSuggestions();

  const filteredRecipes = recipes.filter((recipe: any) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return false;

    const titleMatch = recipe.title.toLowerCase().includes(query);
    const ingredientMatch = recipe.ingredients?.some((ingredient: string) =>
      ingredient.toLowerCase().includes(query)
    );
    const styleMatch = recipe.style?.toLowerCase().includes(query);
    const moodMatch = recipe.mood?.toLowerCase().includes(query);

    return titleMatch || ingredientMatch || styleMatch || moodMatch;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.trim().length > 0);
    setSelectedSuggestionIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    setTimeout(() => {
      setHasSearched(true);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            🍽️ Discover Your Next Recipe Delight! 🌟
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            After searching for recipe like "Spaghetti" you'll see a list of delicious recipes tailored just for you!
          </p>
          <p className="text-lg font-semibold text-orange-600">
            ✨ Get ready to dive into a world of flavors and cook up something amazing! 🧑‍🍳
          </p>
        </div>

        {/* Search Bar */}
        <div ref={searchRef} className="max-w-md mx-auto mb-8 relative">
          <form onSubmit={handleSearch}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                <Input
                  type="text"
                  placeholder="Try 'Parmesan', 'Italian', 'comfort'..."
                  className="pl-10 h-12 text-base border-2 border-orange-200 focus:border-orange-400"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-orange-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={suggestion}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          index === selectedSuggestionIndex
                            ? 'bg-orange-100 text-orange-800'
                            : 'hover:bg-orange-50'
                        }`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                      >
                        <div className="flex items-center">
                          <Search className="h-3 w-3 text-gray-400 mr-2" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-6 font-semibold"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">🔄 Loading recipes...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">❌ {error}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hasSearched ? (
              filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe: any) => (
                  <Link to={`/recipe/${recipe._id}`} key={recipe._id}>
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-orange-100 cursor-pointer">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-800">{recipe.title}</CardTitle>
                        <CardDescription className="text-sm">
                          <span className="font-medium text-orange-600">Ingredients:</span>{' '}
                          {recipe.ingredients?.join(', ')}
                        </CardDescription>
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                            {recipe.style}
                          </span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                            {recipe.mood}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{recipe.instructions}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-500 text-lg mb-2">
                    No recipes found for "{searchQuery}"
                  </p>
                  <p className="text-sm text-gray-400">
                    Try searching for ingredients like "Parmesan" or "chicken", styles like "Italian" or "healthy", or moods like "comfort" or "quick"!
                  </p>
                </div>
              )
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-gray-500 text-lg mb-2">Ready to discover amazing recipes?</p>
                <p className="text-sm text-gray-400">
                  Start typing in the search bar above to see suggestions and begin your culinary adventure!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default StaticRecipeSearch;
