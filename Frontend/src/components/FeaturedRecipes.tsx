import { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';
import { Button } from '@/components/ui/button';

const FeaturedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState(3);

  useEffect(() => {
    fetch('/api/recipe', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Failed to fetch recipes:", err));
  }, []);

  const handleLoadMore = () => {
    setVisibleRecipes((prev) => Math.min(prev + 3, recipes.length));
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Featured Recipes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our most popular and highly-rated recipes from talented home chefs around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.slice(0, visibleRecipes).map((recipe) => (
            <RecipeCard key={recipe._id} {...recipe} />
          ))}
        </div>

        {visibleRecipes < recipes.length && (
          <div className="mt-10 text-center">
            <Button onClick={handleLoadMore} variant="outline" className="border-sage-500 text-sage-500 hover:bg-sage-50">
              Load More Recipes
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedRecipes;
