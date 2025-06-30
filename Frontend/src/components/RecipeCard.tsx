import { Link } from "react-router-dom";

interface RecipeCardProps {
  _id?: string;
  title?: string;
  description?: string;
  category?: string;
  image?: string;
  prepTime?: number;
}

const RecipeCard = ({
  _id,
  title = "Untitled",
  description = "No description provided.",
  category = "Uncategorized",
  image
}: RecipeCardProps) => {
  const linkTo = `/recipe/${_id}`;

  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition duration-300">
      {/* Image */}
      <div className="h-48 w-full mb-4 rounded overflow-hidden bg-gray-100">
        <img
          src={image || "/placeholder-food.jpg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = "/placeholder-food.jpg")}
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 mb-3 line-clamp-3">{description}</p>

      {/* Category */}
      <span className="inline-block bg-sage-100 text-sage-700 text-sm px-3 py-1 rounded-full mb-3">
        {category}
      </span>

      {/* View button */}
      <Link
        to={linkTo}
        className="text-sage-600 hover:text-sage-800 font-medium inline-block"
      >
        View Recipe →
      </Link>
    </div>
  );
};

export default RecipeCard;
