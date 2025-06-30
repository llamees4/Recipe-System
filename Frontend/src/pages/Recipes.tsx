import { useEffect, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navigation from "../components/Navigation";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrepTime, setMaxPrepTime] = useState<number | undefined>(); // ✅ Correct
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recipe", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch recipes");
        return res.json();
      })
      .then(data => setRecipes(data))
      .catch(err => {
        console.error("Error loading recipes:", err);
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredRecipes = recipes
    .filter(recipe => {
      if (searchQuery && !recipe.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory !== "all" && recipe.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      if (maxPrepTime && parseInt(recipe.prepTime) > maxPrepTime) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "quickest":
          return parseInt(a.prepTime) - parseInt(b.prepTime);
        case "popular":
          return b.title.localeCompare(a.title); // mock sort
        case "newest":
        default:
          return a.title.localeCompare(b.title); // simple fallback
      }
    });
    return (
     <>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">🍽️ Browse Recipes</h1>
    
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-8">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
          />
    
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sage-500"
          >
            <option value="all">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Dessert</option>
            <option value="Salad">Salad</option>
            <option value="Indian">Indian</option>
          </select>
    
          <input
            type="number"
            placeholder="Max Prep Time (mins)"
            value={maxPrepTime}
            onChange={(e) => setMaxPrepTime(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sage-500"
          />
    
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sage-500"
          >
            <option value="newest">Newest</option>
            <option value="quickest">Quickest</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
    
        {/* Recipe Cards */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading recipes...</p>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition-shadow border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h2>
                <p className="text-gray-700 text-sm mb-3">{recipe.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="inline-block px-3 py-1 text-sm bg-sage-100 text-sage-700 rounded-full capitalize">
                    {recipe.category}
                  </span>
                  <a
                    href={`/recipe/${recipe._id}`}
                    className="text-sage-600 hover:underline font-medium text-sm"
                  >
                    View Recipe →
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <h3 className="text-xl font-semibold">No recipes found</h3>
            <p>Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>
      </>
    ); 
};

export default Recipes;
