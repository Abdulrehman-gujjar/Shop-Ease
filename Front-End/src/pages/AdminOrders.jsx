import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load orders");
        return;
      }

      setOrders(data);
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/admin/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === id
            ? { ...order, status: data.order.status }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">

            <Link
              to="/admin"
              className="text-xl sm:text-2xl font-bold"
            >
              ShopEase Admin
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        <Link
          to="/admin"
          className="text-blue-600 hover:underline"
        >
          ← Dashboard
        </Link>

        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Customer Orders
          </h1>

          <p className="text-gray-500 mt-2">
            View and manage all customer orders.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-500">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">
              📦
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-2">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
              >

                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Order #{order._id.slice(-8)}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {order.user?.name || "Unknown User"} ·{" "}
                      {order.user?.email || "No email"}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-lg px-4 py-2 bg-white font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>

                </div>

                {/* Products */}
                <div className="py-5 space-y-4">

                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4"
                    >

                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 object-contain bg-gray-50 rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {item.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold text-gray-800">
                        $
                        {(
                          item.price * item.quantity
                        ).toFixed(2)}
                      </p>

                    </div>
                  ))}

                </div>

                {/* Shipping + Total */}
                <div className="border-t pt-5 flex flex-col md:flex-row md:justify-between gap-5">

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Shipping Address
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {order.shippingAddress?.address}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.postalCode}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.shippingAddress?.country}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-gray-500">
                      Total
                    </p>

                    <p className="text-2xl font-extrabold text-blue-600">
                      ${Number(order.totalPrice).toFixed(2)}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default AdminOrders;