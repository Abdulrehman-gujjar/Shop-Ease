import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useContext(CartContext);

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-5">🛒</div>

          <h1 className="text-3xl font-bold text-gray-800">
            Your cart is empty
          </h1>

          <p className="text-gray-500 mt-2 mb-6">
            Looks like you haven't added anything yet.
          </p>

          <Link
            to="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart
        </h1>

        <p className="text-gray-500 mt-1">
          Review your items before checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart Products */}
        <div className="lg:col-span-2 space-y-4">

          {cart.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-5"
            >

              {/* Image */}
              <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="max-h-28 max-w-full object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-gray-800">
                  {item.title}
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  {item.category}
                </p>

                <p className="text-blue-600 font-bold text-xl mt-3">
                  ${Number(item.price).toFixed(2)}
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-3 mt-4">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item._id || item.id)
                    }
                    className="w-9 h-9 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="font-semibold min-w-6 text-center">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item._id || item.id)
                    }
                    className="w-9 h-9 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    +
                  </button>

                </div>
              </div>

              {/* Remove */}
              <div className="flex sm:flex-col justify-between items-end">

                <button
                  type="button"
                  onClick={() =>
                    removeFromCart(item._id || item.id)
                  }
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>

                <p className="font-bold text-gray-800">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </p>

              </div>

            </div>
          ))}

        </div>

        {/* Summary */}
        <div className="lg:col-span-1">

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sticky top-24">

            <h2 className="text-xl font-bold text-gray-800">
              Order Summary
            </h2>

            <div className="flex justify-between mt-6 text-gray-600">
              <span>Subtotal</span>

              <span className="font-semibold">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between mt-3 text-gray-600">
              <span>Shipping</span>

              <span className="text-green-600 font-semibold">
                Free
              </span>
            </div>

            <div className="border-t border-gray-300 my-5"></div>

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout */}
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/shop"
              className="block text-center mt-4 text-blue-600 hover:underline"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;