import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://shop-ease-backend-blush.vercel.app";

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
      const response = await fetch(`${API_URL}/api/orders/admin/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("Admin Orders Response:", data);

      if (!response.ok) {
        alert(data.message || "Failed to load orders");
        return;
      }

      const receivedOrders = Array.isArray(data)
        ? data
        : data.orders || [];

      setOrders(receivedOrders);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      alert("Server error while loading orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_URL}/api/orders/admin/${id}/status`,
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

      console.log("Update Status Response:", data);

      if (!response.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === id
            ? {
                ...order,
                status: data.order?.status || status,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Update Status Error:", error);
      alert("Server error while updating status");
    }
  };

  const getImageUrl = (thumbnail) => {
    if (!thumbnail) {
      return "/placeholder.png";
    }

    if (
      thumbnail.startsWith("http://") ||
      thumbnail.startsWith("https://")
    ) {
      return thumbnail;
    }

    const cleanPath = thumbnail
      .replace(/^\/+/, "")
      .replace(/^uploads\//, "");

    return `${API_URL}/uploads/${cleanPath}`;
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link
              to="/admin"
              className="text-xl font-bold sm:text-2xl"
            >
              ShopEase Admin
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 font-medium transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Link
          to="/admin"
          className="text-blue-600 hover:underline"
        >
          ← Dashboard
        </Link>

        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Customer Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View and manage all customer orders.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center">
            <p className="text-gray-500">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <div className="mb-4 text-5xl">📦</div>

            <h2 className="text-xl font-bold text-gray-800">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                {/* Order Header */}
                <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-center">
                  <div>
                    <h2 className="font-bold text-gray-900">
                      Order #{order._id?.slice(-8)}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.user?.name || order.fullName || "Unknown User"}{" "}
                      ·{" "}
                      {order.user?.email || order.email || "No email"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <select
                    value={order.status || "Pending"}
                    onChange={(event) =>
                      updateStatus(order._id, event.target.value)
                    }
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Products */}
                <div className="space-y-4 py-5">
                  {(order.items || []).map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={getImageUrl(item.thumbnail)}
                        alt={item.title || "Product"}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                        className="h-16 w-16 rounded-lg bg-gray-50 object-contain"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {item.title || "Product"}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity || 1}
                        </p>
                      </div>

                      <p className="font-bold text-gray-800">
                        $
                        {(
                          Number(item.price || 0) *
                          Number(item.quantity || 1)
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping and Total */}
                <div className="flex flex-col justify-between gap-5 border-t pt-5 md:flex-row">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Shipping Address
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.shippingAddress?.address ||
                        order.address ||
                        "Address unavailable"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.shippingAddress?.city ||
                        order.city ||
                        ""}
                      {", "}
                      {order.shippingAddress?.postalCode ||
                        order.postalCode ||
                        ""}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.shippingAddress?.country ||
                        order.country ||
                        "Pakistan"}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-gray-500">
                      Total
                    </p>

                    <p className="text-2xl font-extrabold text-blue-600">
                      $
                      {Number(
                        order.totalPrice ||
                          order.total ||
                          0
                      ).toFixed(2)}
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