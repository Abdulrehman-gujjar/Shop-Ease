import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="group w-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">

      {/* Product Image */}
      <div className="relative bg-gray-50 p-3">

        {product.discountPercentage > 0 && (
          <span className="absolute top-5 left-5 z-10 bg-pink-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
            SALE
          </span>
        )}

        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full aspect-square object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
        />

      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">

        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-6 min-h-[48px] line-clamp-2">
          {product.title}
        </h3>

        <p className="text-sm text-gray-500 capitalize mt-3">
          {product.category}
        </p>

        {/* Price */}
        <div className="mt-4">
          <span className="text-2xl font-bold text-blue-600">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-yellow-500 text-xl">
            ★
          </span>

          <span className="text-gray-600">
            {product.rating || "4.5"}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-auto pt-6">

          {/* Add To Cart */}
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="flex-1 h-11 px-3 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition"
          >
            Add to Cart
          </button>

          {/* Details */}
          <Link
            to={`/product/${product._id}`}
            className="flex-1 h-11 px-3 flex items-center justify-center border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-medium text-sm transition"
          >
            Details
          </Link>

        </div>

      </div>
    </div>
  );
}

export default ProductCard;