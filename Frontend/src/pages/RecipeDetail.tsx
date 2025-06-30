import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [allIngredients, setAllIngredients] = useState<any[]>([]);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    setUserId(storedId);

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

    fetch("http://localhost:5001/api/ingredient", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setAllIngredients(data))
      .catch((err) => console.error("Failed to fetch ingredients", err));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(`http://localhost:5001/api/recipe/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete recipe");

      toast({
        title: "Deleted",
        description: "Recipe deleted successfully",
      });

      navigate("/recipes");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete recipe",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading recipe...</div>;
  if (!recipe) return <div className="p-8 text-center text-red-600">Recipe not found.</div>;

  return (
    <>
      <Navigation />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Recipe Info */}
          <div className="flex-1">
            {/* Title with beige rounded rectangle */}
            <h1
              className="inline-block bg-cream-50 text-gray-800 rounded-lg px-6 py-3 font-bold text-4xl mb-4"
            >
              {recipe.title}
            </h1>

            <div className="text-sm text-gray-500 mb-4">
              <span className="inline-block bg-sage-100 text-sage-700 font-medium px-3 py-1 rounded-full text-xs">
                {recipe.category || "Uncategorized"}
              </span>
              <span className="ml-4">
                <strong>Prep Time:</strong> {recipe.prepTime || "N/A"}
              </span>
            </div>

            {/* Description */}
            {recipe.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">About this Recipe</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{recipe.description}</p>
              </div>
            )}

            {/* Ingredients Section */}
            {recipe.ingredients?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ingredients</h2>
                <div className="flex flex-wrap gap-3">
                  {recipe.ingredients.map((ing: any, idx: number) => {
                    const ingName = typeof ing === "string" ? ing : ing.name;
                    const matchedIngredient = allIngredients.find(
                      (ai) => ai.name.toLowerCase() === ingName.toLowerCase()
                    );

                    return (
                      <span
                        key={idx}
                        className="inline-block bg-sage-200 text-sage-800 text-sm px-3 py-1 rounded-lg shadow-sm"
                      >
                        {ingName}
                        {matchedIngredient ? (
                          <span className="italic text-gray-600 ml-1">— {matchedIngredient.quantity}</span>
                        ) : (
                          <span className="italic text-gray-400 ml-1">— quantity unknown</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Instructions */}
            {recipe.instructions && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Make It</h2>
                <ol className="list-decimal list-inside space-y-4 text-gray-700 leading-relaxed text-lg">
                  {recipe.instructions
                    .split(".")
                    .filter((line) => line.trim())
                    .map((step, idx) => (
                      <li key={idx}>{step.trim()}.</li>
                    ))}
                </ol>
              </div>
            )}

            {/* Edit/Delete buttons */}
            {userId && (
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={() => navigate(`/edit/${recipe._id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Edit Recipe
                </Button>

                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleDelete}
                >
                  Delete Recipe
                </Button>
              </div>
            )}

            {/* Creator Info */}
            <div className="mt-8 pt-4 border-t text-sm text-gray-500">
              <p>
                Created by user ID: <strong>{recipe.createdby}</strong>
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-96 shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={recipe.image || "/placeholder-food.jpg"}
              alt={recipe.title}
              className="w-full h-auto object-contain max-h-[500px]"
              onError={(e) => (e.currentTarget.src = "/placeholder-food.jpg")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeDetail;
