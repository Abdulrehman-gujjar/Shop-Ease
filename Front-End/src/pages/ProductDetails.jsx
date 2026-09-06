import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import Loader from "../components/Loader";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        setProduct(response.data);
      } catch (error) {
        console.log(error);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">
            {error || "Product not found"}
          </h2>

          <Link
            to="/shop"
            className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>

        <span className="mx-2">/</span>

        <Link to="/shop" className="hover:text-blue-600">
          Shop
        </Link>

        <span className="mx-2">/</span>

        <span className="text-gray-800">
          {product.title}
        </span>
      </div>

      {/* Product */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Image */}
        <div className="bg-gray-50 rounded-2xl min-h-[400px] flex items-center justify-center p-8">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="max-h-[420px] w-full object-contain"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">

          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            {product.category}
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-5">
            <div className="flex items-center">
              <span className="text-yellow-500 text-xl">
                ★
              </span>

              <span className="font-semibold text-gray-800 ml-1">
                {product.rating}
              </span>
            </div>

            <span className="text-gray-400">
              |
            </span>

            <span
              className={
                product.stock > 0
                  ? "text-green-600 font-medium"
                  : "text-red-500 font-medium"
              }
            >
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <span className="text-3xl font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-7 mt-6">
            {product.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">

            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3.5 px-6 rounded-xl font-semibold transition"
            >
              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>

            <Link
              to="/cart"
              className="flex-1 text-center border border-gray-300 hover:border-blue-600 hover:text-blue-600 py-3.5 px-6 rounded-xl font-semibold transition"
            >
              View Cart
            </Link>

          </div>

          {/* Extra Info */}
          <div className="grid grid-cols-2 gap-4 mt-8">

            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Category
              </p>

              <p className="font-semibold text-gray-800 mt-1 capitalize">
                {product.category}
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Availability
              </p>

              <p className="font-semibold text-green-600 mt-1">
                In Stock
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default ProductDetails;