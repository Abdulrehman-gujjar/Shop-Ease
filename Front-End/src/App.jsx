import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/navbar";

import Home from "./pages/home";
import Shop from "./pages/shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/orders";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminChat from "./pages/AdminChat";
import AdminOrders from "./pages/AdminOrders";

import ChatBox from "./components/ChatBox";

function App() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white">

      {/* Customer Navbar only */}
      {!isAdminPage && <Navbar />}

      <main>
        <Routes>

          {/* Customer */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Orders */}
          <Route path="/orders" element={<Orders />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route
            path="/admin/chat"
            element={<AdminChat />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-5xl font-extrabold text-gray-800">
                    404
                  </h1>

                  <p className="text-gray-500 mt-2">
                    Page not found
                  </p>

                  <a
                    href="/"
                    className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            }
          />

        </Routes>
      </main>

      {/* Customer Chat only */}
      {!isAdminPage && <ChatBox />}

    </div>
  );
}

export default App;