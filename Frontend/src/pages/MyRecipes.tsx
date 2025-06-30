
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recipe/my', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user recipes");
        return res.json();
      })
      .then(setRecipes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Recipes</h2>

      {loading ? (
        <p className="text-gray-500">Loading your recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500">You haven't created any recipes yet.</p>
      ) : (
        <ul className="space-y-2">
          {recipes.map((recipe) => (
            <li key={recipe._id} className="p-3 bg-white shadow rounded">
              <h3 className="font-semibold">
                <Link
                  to={`/recipe/${recipe._id}`}
                  className="text-sage-600 hover:underline"
                >
                  {recipe.title}
                </Link>
              </h3>
              <p className="text-gray-600">{recipe.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRecipes;
