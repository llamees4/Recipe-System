import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import RecipeCard from '@/components/RecipeCard';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  category?: string;
  image?: string;
  prepTime?: number;
}

const Categories = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);

  // Fetch recipes
  const fetchRecipes = () => {
    axios.get('/api/recipe')
      .then((res) => {
        setRecipes(res.data as Recipe[]);
      })
      .catch((err) => {
        console.error("Failed to fetch recipes:", err);
      });
  };

  // Fetch categories from category collection
  const fetchCategories = () => {
    axios.get('/api/category')
      .then((res) => {
        const categoriesFromServer = res.data.map((c: any) => c.categoryName);
        setAllCategories(categoriesFromServer);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
  };

  // Add category handler
  const handleAddCategory = async () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      toast({ title: "Error", description: "Category name cannot be empty.", variant: "destructive" });
      return;
    }

    if (allCategories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase())) {
      toast({ title: "Error", description: "Category already exists.", variant: "destructive" });
      return;
    }

    try {
      await axios.post('/api/category', { categoryName: trimmedName });
      toast({ title: "Success", description: `Category "${trimmedName}" added.` });
      setNewCategoryName("");
      setAddingCategory(false);

      // Immediately add new category to list without waiting for fetch
      setAllCategories((prev) => [...prev, trimmedName]);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add category.",
        variant: "destructive",
      });
    }
  };

  const filteredRecipes = selectedCategory
    ? recipes.filter((r) =>
        r.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : recipes;

  return (
    <div>
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 flex items-center justify-between">
          Browse Recipes by Category

          <Button onClick={() => setAddingCategory(!addingCategory)}>
            {addingCategory ? "Cancel" : "Add Category"}
          </Button>
        </h1>

        {addingCategory && (
          <div className="mb-6 flex gap-3 items-center max-w-sm">
            <input
              type="text"
              placeholder="New category name"
              className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
            />
            <Button onClick={handleAddCategory} className="whitespace-nowrap">
              Save
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-8">
          {allCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }
            >
              {category}
            </Button>
          ))}
        </div>

        <Tabs defaultValue="grid" className="mb-6">
          <TabsList>
            <TabsTrigger value="grid" onClick={() => setViewType('grid')}>
              Grid View
            </TabsTrigger>
            <TabsTrigger value="list" onClick={() => setViewType('list')}>
              List View
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredRecipes.length === 0 ? (
          <p className="text-gray-500">No recipes found in this category.</p>
        ) : viewType === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                _id={recipe._id}
                title={recipe.title}
                description={recipe.description}
                category={recipe.category}
                image={recipe.image}
                prepTime={recipe.prepTime}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="border p-4 rounded-md shadow-sm"
              >
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <p className="text-sm text-gray-600">{recipe.description}</p>
                {recipe.category && (
                  <div className="mt-2">
                    <Badge>{recipe.category}</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
