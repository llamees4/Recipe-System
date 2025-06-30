import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/api/user/me", {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) navigate("/login");
        else setUser(data);
      })
      .catch(() => navigate("/login"));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5001/api/ingredient", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setIngredients(data))
      .catch(() => console.error("Failed to fetch ingredients"));
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5001/auth/logout", {
      method: "GET",
      credentials: "include",
    });
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );
    if (!confirm || !user?._id) return;

    try {
      const res = await fetch(`http://localhost:5001/api/user/${user._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete account");

      toast?.({ title: "Account Deleted", description: "Your account has been deleted." });
      navigate("/login");
    } catch (err: any) {
      toast?.({
        title: "Error",
        description: err.message || "Something went wrong while deleting your account.",
        variant: "destructive",
      });
    }
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, quantity } = newIngredient;
    if (!name || !quantity) {
      toast({
        title: "Incomplete",
        description: "Please complete all ingredient fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIngredient),
      });

      if (!res.ok) throw new Error("Failed to add ingredient");

      toast({ title: "Success", description: "Ingredient added." });
      setNewIngredient({ name: "", quantity: "" });

      // Refresh ingredient list
      const updated = await fetch("http://localhost:5001/api/ingredient", {
        credentials: "include",
      }).then((res) => res.json());
      setIngredients(updated);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not add ingredient.",
        variant: "destructive",
      });
    }
  };

  // New: handle ingredient delete
  const handleDeleteIngredient = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this ingredient?")) return;

    try {
      const res = await fetch(`http://localhost:5001/api/ingredient/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete ingredient");

      toast({ title: "Deleted", description: "Ingredient deleted." });

      // Refresh ingredient list
      const updated = await fetch("http://localhost:5001/api/ingredient", {
        credentials: "include",
      }).then((res) => res.json());
      setIngredients(updated);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not delete ingredient.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) =>
    name?.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-gray-600 text-lg">You are not logged in.</p>
          <Link
            to="/login"
            className="bg-sage-500 hover:bg-sage-600 text-white px-5 py-2 rounded-lg shadow"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Account Section */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center relative">
            <div className="w-16 h-16 rounded-full bg-sage-500 flex items-center justify-center text-white text-xl font-bold">
              {getInitials(user.username)}
            </div>
            <h1 className="text-xl font-semibold text-sage-700 mt-3">{user.username}</h1>
            <p className="text-gray-500 text-sm mb-4">
              Email: <span className="font-medium">{user.email}</span>
            </p>

            <button
              onClick={handleLogout}
              className="w-full text-sm bg-red-500 hover:bg-red-600 text-white py-2 rounded mb-2"
            >
              Log Out
            </button>
            <Link
              to="/"
              className="w-full text-sm text-center bg-sage-500 hover:bg-sage-600 text-white py-2 rounded"
            >
              ← Back to Home
            </Link>

            <button
              onClick={handleDeleteAccount}
              className="absolute bottom-4 left-4 text-xs text-red-500 hover:underline"
            >
              ❌ Delete Account
            </button>
          </div>

          {/* Ingredient Section */}
          <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-sage-600 mb-4">Manage Ingredients</h2>

            <form
              onSubmit={handleAddIngredient}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
            >
              <input
                type="text"
                placeholder="Name"
                className="border px-3 py-2 rounded text-sm"
                value={newIngredient.name}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Quantity"
                className="border px-3 py-2 rounded text-sm"
                value={newIngredient.quantity}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, quantity: e.target.value })
                }
              />
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm w-full"
                >
                  Add Ingredient
                </button>
              </div>
            </form>

            <div className="max-h-60 overflow-y-auto border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">📋 Existing Ingredients</h3>
              <ul className="text-sm space-y-1">
                {ingredients.map((ing) => (
                  <li
                    key={ing._id}
                    className="text-gray-700 border-b pb-1 flex justify-between items-center"
                  >
                    <span>
                      <span className="font-medium">{ing.name}</span> — {ing.quantity}
                    </span>
                    <button
                      onClick={() => handleDeleteIngredient(ing.IngredientId)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold ml-4"
                      title="Delete ingredient"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
