import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

function Checkout() {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [loading, setLoading] = useState(false);

  const shipping = cart.length > 0 ? 10 : 0;
  const grandTotal = cartTotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before placing your order.");
      navigate("/login");
      return;
    }

    const items = cart.map((item) => ({
      product: item._id || item.id,
      title: item.title,
      price: Number(item.price),
      quantity: Number(item.quantity),
      thumbnail: item.thumbnail,
    }));

    const orderData = {
      items,
      totalPrice: grandTotal,
      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        postalCode,
        country,
      },
    };

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Empty cart after successful order
        clearCart();

        alert("Order Placed Successfully! Status: Shipped");

        // Go to Orders page
        navigate("/orders");
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          alert(
            "Your login session has expired. Please login again."
          );

          navigate("/login");
          return;
        }

        alert(data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Server error, try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🛒</div>

          <h1 className="text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="text-gray-500 mt-2">
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/shop"
            className="inline-block mt-6 px-7 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Heading */}
        <div className="mb-8">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
            Secure Checkout
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
            Complete Your Order
          </h1>

          <p className="text-gray-500 mt-2">
            Enter your delivery information to place your order.
          </p>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid lg:grid-cols-3 gap-8"
        >

          {/* Shipping Information */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">

            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                1
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Shipping Information
                </h2>

                <p className="text-sm text-gray-500">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">

              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="03XX XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>

                <input
                  type="text"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Postal Code
                </label>

                <input
                  type="text"
                  placeholder="Enter postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country
                </label>

                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Address
                </label>

                <textarea
                  placeholder="Enter your complete delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows="5"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>

            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-fit lg:sticky lg:top-24">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                2
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">

              {cart.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex gap-3"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    $
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}
                  </p>
                </div>
              ))}

            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 mt-6 pt-5 space-y-3">

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-bold">
                  Total
                </span>

                <span className="text-2xl font-extrabold text-blue-600">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

            </div>

            {/* Place Order */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 disabled:bg-blue-400 text-white py-3.5 rounded-xl mt-7 font-semibold hover:bg-blue-700 transition"
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
                🚚 Status: Shipped
              </span>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;