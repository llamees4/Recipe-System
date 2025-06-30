import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allIngredients, setAllIngredients] = useState<any[]>([]);

  useEffect(() => {
    // Fetch recipe
    fetch(`http://localhost:5001/api/recipe/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Recipe not found");
        return res.json();
      })
      .then((data) => {
        setRecipe(data.recipe || data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recipe:", err);
        navigate("/recipes");
      });

    // Fetch ingredient options
    fetch("http://localhost:5001/api/ingredient", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAllIngredients(data))
      .catch((err) => console.error("Error loading ingredients:", err));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRecipe((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const updated = [...recipe.ingredients];
    updated[index] = value;
    setRecipe((prev: any) => ({
      ...prev,
      ingredients: updated,
    }));
  };

  const addIngredientField = () => {
    setRecipe((prev: any) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), ""],
    }));
  };

  const removeIngredient = (index: number) => {
    const updated = [...recipe.ingredients];
    updated.splice(index, 1);
    setRecipe((prev: any) => ({
      ...prev,
      ingredients: updated,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5001/api/recipe/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });

      if (!res.ok) throw new Error("Update failed");

      toast({ title: "Updated", description: "Recipe updated successfully" });
      navigate(`/recipe/${id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update recipe",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading recipe...</div>;
  if (!recipe) return <div className="p-8 text-center text-red-600">Recipe not found.</div>;

  return (
    <>
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Edit Recipe</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="title"
            value={recipe.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
          <Input
            name="category"
            value={recipe.category}
            onChange={handleChange}
            placeholder="Category"
          />
          <Input
            name="prepTime"
            value={recipe.prepTime}
            onChange={handleChange}
            placeholder="Prep Time"
          />
          <Input
            name="image"
            value={recipe.image}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <Textarea
            name="description"
            value={recipe.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
          />
          <Textarea
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
            placeholder="Instructions"
            rows={6}
          />

          {/* Ingredient Dropdowns */}
          <div>
            <label className="block font-medium mb-2">Ingredients</label>
            {recipe.ingredients?.map((ingredient: string, index: number) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <select
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                >
                  <option value="">Select Ingredient</option>
                  {allIngredients.map((ing) => (
                    <option key={ing._id} value={ing.name}>
                      {ing.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeIngredient(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addIngredientField}>
              <Plus className="w-4 h-4 mr-1" /> Add Ingredient
            </Button>
          </div>

          <div className="flex gap-4 mt-6">
            <Button type="submit" className="bg-green-600 text-white">
              Save Changes
            </Button>
            <Button type="button" onClick={() => navigate(-1)} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditRecipe;
