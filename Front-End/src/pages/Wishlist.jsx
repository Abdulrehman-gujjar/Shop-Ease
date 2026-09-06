import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Wishlist() {
  const { wishlist } = useContext(CartContext);

  if (wishlist.length === 0) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-10 md:p-14 text-center max-w-md">

          <div className="text-7xl mb-6">
            🤍
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            Your Wishlist is Empty
          </h1>

          <p className="text-gray-500 mt-3 leading-6">
            Save your favorite products here and come back
            whenever you are ready to buy.
          </p>

          <Link
            to="/shop"
            className="inline-block mt-7 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold transition shadow-md"
          >
            Explore Products
          </Link>

        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">

          <div>
            <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
              Saved For Later
            </p>

            <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
              My Wishlist ❤️
            </h1>

            <p className="text-gray-500 mt-2">
              {wishlist.length} saved product
              {wishlist.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Link
            to="/shop"
            className="mt-5 md:mt-0 text-blue-600 hover:text-blue-700 font-semibold"
          >
            Continue Shopping →
          </Link>

        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition duration-300 group"
            >

              {/* Image */}
              <div className="bg-gray-50 p-4">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-52 object-contain group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5">

                <h2 className="font-bold text-gray-900 text-lg line-clamp-2 min-h-[56px]">
                  {product.title}
                </h2>

                <div className="flex items-center justify-between mt-4">

                  <p className="text-xl font-extrabold text-blue-600">
                    ${product.price}
                  </p>

                  <span className="text-yellow-500 text-sm">
                    ⭐ {product.rating}
                  </span>

                </div>

                <Link
                  to={`/products/${product.id}`}
                  className="block text-center mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  View Product
                </Link>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Wishlist;