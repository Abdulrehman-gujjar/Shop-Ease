import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { getImageUrl } from "../utils/imageUrl";

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist } = useContext(CartContext);

  const imageUrl = getImageUrl(
    product.thumbnail || product.images?.[0]
  );

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gray-50 p-5">
        {product.discountPercentage > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
            SALE
          </span>
        )}

        <img
          src={imageUrl}
          alt={product.title || "Product image"}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src =
              "https://via.placeholder.com/500x500?text=Image+Not+Found";
          }}
        />

        <button
          type="button"
          onClick={() => addToWishlist(product)}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-pink-500 shadow-md transition hover:bg-pink-500 hover:text-white"
        >
          ♡
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
          {product.category || "General"}
        </p>

        <h3 className="mb-2 line-clamp-2 min-h-[48px] text-lg font-bold text-gray-900">
          {product.title}
        </h3>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${Number(product.price || 0).toFixed(2)}
          </span>

          <span className="text-sm text-yellow-500">
            ★ {product.rating || 0}
          </span>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add to Cart
          </button>

          <Link
            to={`/product/${product._id}`}
            className="rounded-xl border border-gray-300 px-3 py-3 text-center text-sm font-semibold text-gray-800 transition hover:border-blue-600 hover:text-blue-600"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;