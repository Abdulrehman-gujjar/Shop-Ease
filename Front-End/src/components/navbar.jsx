import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Load user when Navbar starts
    loadUser();

    // Listen for login/logout
    const handleAuthChange = (event) => {
      if (event.detail) {
        setUser(event.detail);
      } else {
        loadUser();
      }
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener(
        "authChange",
        handleAuthChange
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    window.dispatchEvent(
      new CustomEvent("authChange", {
        detail: null,
      })
    );

    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            ShopEase
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4 sm:gap-6">

            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Shop
            </Link>

            {/* Orders */}
            {user && (
              <Link
                to="/orders"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Orders
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
            >
              <span className="text-xl">
                🛒
              </span>

              <span className="hidden sm:inline">
                Cart
              </span>

              {cartCount > 0 && (
                <span className="absolute -top-3 -right-4 min-w-5 h-5 px-1 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Logged In */}
            {user ? (
              <div className="flex items-center gap-3">

                <span className="hidden md:block text-sm font-semibold text-gray-700">
                  Hi, {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Logout
                </button>

              </div>
            ) : (
              /* Logged Out */
              <div className="flex items-center gap-2">

                <Link
                  to="/login"
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Register
                </Link>

              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;