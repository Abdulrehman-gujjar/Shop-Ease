import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

 useEffect(() => {
  if (!token) {
    navigate("/admin/login");
    return;
  }

  fetchStats();
}, [token, navigate]);

const fetchStats = async () => {
  try {
    const response = await fetch(
      "https://shop-ease-backend-blush.vercel.app/api/admin/stats",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    console.log("Dashboard API Response:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load dashboard data"
      );
    }

    setStats(data);
  } catch (error) {
    console.error("Dashboard Error:", error);
    setStats(null);
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= HEADER ================= */}

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
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Heading */}

        <div className="mb-8">

          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Admin Panel
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your ShopEase store from one place.
          </p>

        </div>

        {/* ================= LOADING ================= */}

        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

            <div className="text-4xl mb-3">
              ⏳
            </div>

            <p className="text-gray-500">
              Loading dashboard...
            </p>

          </div>
        ) : !stats ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

            <div className="text-4xl mb-3">
              ⚠️
            </div>

            <p className="text-gray-500">
              Failed to load dashboard data.
            </p>

            <button
              onClick={fetchStats}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              Try Again
            </button>

          </div>
        ) : (
          <>
            {/* ================= STAT CARDS ================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {/* Products */}

              <Link
                to="/admin/products"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Total Products
                    </p>

                    <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                      {stats.totalProducts}
                    </h2>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">
                    🛍️
                  </div>

                </div>

                <p className="text-blue-600 text-sm font-medium mt-5">
                  Manage Products →
                </p>

              </Link>

              {/* Orders */}

              <Link
                to="/admin/orders"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Total Orders
                    </p>

                    <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                      {stats.totalOrders}
                    </h2>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-3xl">
                    📦
                  </div>

                </div>

                <p className="text-purple-600 text-sm font-medium mt-5">
                  Manage Orders →
                </p>

              </Link>

              {/* Customers */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Total Customers
                    </p>

                    <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                      {stats.totalCustomers}
                    </h2>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl">
                    👥
                  </div>

                </div>

                <p className="text-green-600 text-sm font-medium mt-5">
                  Registered Customers
                </p>

              </div>

              {/* Sales */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Total Sales
                    </p>

                    <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                      $
                      {Number(stats.totalSales).toFixed(2)}
                    </h2>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center text-3xl">
                    💰
                  </div>

                </div>

                <p className="text-yellow-600 text-sm font-medium mt-5">
                  Excluding Cancelled Orders
                </p>

              </div>

            </div>

            {/* ================= ORDER STATUS ================= */}

            <div className="mt-8">

              <div className="mb-5">

                <h2 className="text-2xl font-bold text-gray-900">
                  Order Overview
                </h2>

                <p className="text-gray-500 mt-1">
                  Current status of customer orders.
                </p>

              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

                {/* Pending */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                  <div className="text-3xl">
                    ⏳
                  </div>

                  <p className="text-gray-500 text-sm mt-3">
                    Pending
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.orderStatus.pending}
                  </h3>

                </div>

                {/* Processing */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                  <div className="text-3xl">
                    ⚙️
                  </div>

                  <p className="text-gray-500 text-sm mt-3">
                    Processing
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.orderStatus.processing}
                  </h3>

                </div>

                {/* Shipped */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                  <div className="text-3xl">
                    🚚
                  </div>

                  <p className="text-gray-500 text-sm mt-3">
                    Shipped
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.orderStatus.shipped}
                  </h3>

                </div>

                {/* Delivered */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                  <div className="text-3xl">
                    ✅
                  </div>

                  <p className="text-gray-500 text-sm mt-3">
                    Delivered
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.orderStatus.delivered}
                  </h3>

                </div>

                {/* Cancelled */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                  <div className="text-3xl">
                    ❌
                  </div>

                  <p className="text-gray-500 text-sm mt-3">
                    Cancelled
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.orderStatus.cancelled}
                  </h3>

                </div>

              </div>

            </div>

            {/* ================= RECENT ORDERS ================= */}

            <div className="mt-8">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Recent Orders
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Latest customer orders.
                  </p>

                </div>

                <Link
                  to="/admin/orders"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  View All Orders →
                </Link>

              </div>

              {stats.recentOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">

                  <div className="text-4xl mb-3">
                    📦
                  </div>

                  <p className="text-gray-500">
                    No orders yet.
                  </p>

                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[700px]">

                      <thead className="bg-gray-50 border-b">

                        <tr>

                          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                            Order
                          </th>

                          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                            Customer
                          </th>

                          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                            Date
                          </th>

                          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                            Total
                          </th>

                          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                            Status
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y">

                        {stats.recentOrders.map((order) => (

                          <tr
                            key={order._id}
                            className="hover:bg-gray-50 transition"
                          >

                            <td className="px-6 py-4">

                              <Link
                                to="/admin/orders"
                                className="font-semibold text-blue-600 hover:underline"
                              >
                                #{order._id.slice(-8)}
                              </Link>

                            </td>

                            <td className="px-6 py-4">

                              <p className="font-medium text-gray-800">
                                {order.user?.name || "Unknown"}
                              </p>

                              <p className="text-sm text-gray-500">
                                {order.user?.email || "No email"}
                              </p>

                            </td>

                            <td className="px-6 py-4 text-sm text-gray-500">

                              {new Date(
                                order.createdAt
                              ).toLocaleDateString()}

                            </td>

                            <td className="px-6 py-4 font-bold text-gray-800">

                              $
                              {Number(
                                order.totalPrice
                              ).toFixed(2)}

                            </td>

                            <td className="px-6 py-4">

                              <span
                                className={
                                  "inline-flex px-3 py-1 rounded-full text-xs font-semibold " +
                                  (
                                    order.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : order.status === "Processing"
                                      ? "bg-blue-100 text-blue-700"
                                      : order.status === "Shipped"
                                      ? "bg-purple-100 text-purple-700"
                                      : order.status === "Delivered"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  )
                                }
                              >
                                {order.status}
                              </span>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                </div>
              )}

            </div>

            {/* ================= QUICK ACTIONS ================= */}

            <div className="mt-8">

              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                <Link
                  to="/admin/products"
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >

                  <div className="text-4xl mb-4">
                    🛍️
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    Manage Products
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Add, edit or remove products.
                  </p>

                </Link>

                <Link
                  to="/admin/orders"
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >

                  <div className="text-4xl mb-4">
                    📦
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    Manage Orders
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    View and update customer orders.
                  </p>

                </Link>

                <Link
                  to="/admin/chat"
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >

                  <div className="text-4xl mb-4">
                    💬
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    Customer Chat
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Communicate with customers.
                  </p>

                </Link>

                <Link
                  to="/"
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >

                  <div className="text-4xl mb-4">
                    🌐
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    Visit Store
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Open the customer store.
                  </p>

                </Link>

              </div>

            </div>

          </>
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;