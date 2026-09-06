import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to view your orders.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "https://shop-ease-backend-912xhys0i-e-commerce-e21d.vercel.app/api/orders/my-orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Your session has expired. Please login again.");
            navigate("/login");
            return;
          }

          alert(data.message || "Failed to load orders.");
        }
      } catch (error) {
        console.error(error);
        alert("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📦</div>

          <p className="text-gray-600 font-medium">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
            Order History
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
            My Orders
          </h1>

          <p className="text-gray-500 mt-2">
            View all your previous orders and their current status.
          </p>
        </div>

        {/* No Orders */}
        {orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center">
            <div className="text-6xl mb-5">
              📦
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't placed any orders yet.
            </p>

            <Link
              to="/shop"
              className="inline-block mt-6 px-7 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
              >

                {/* Order Header */}
                <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="font-semibold text-gray-900 break-all">
                      #{order._id}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">

                    <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                      🚚 {order.status}
                    </span>

                    <span className="text-xl font-extrabold text-blue-600">
                      ${Number(order.totalPrice).toFixed(2)}
                    </span>

                  </div>
                </div>

                {/* Products */}
                <div className="p-5 sm:p-6">

                  <div className="space-y-4">

                    {order.items.map((item, index) => (
                      <div
                        key={item.product?._id || index}
                        className="flex items-center gap-4"
                      >

                        <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">
                              📦
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">

                          <h3 className="font-semibold text-gray-900 truncate">
                            {item.title}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: {item.quantity}
                          </p>

                          <p className="text-sm text-gray-500">
                            Price: ${Number(item.price).toFixed(2)}
                          </p>

                        </div>

                        <div className="font-bold text-gray-900">
                          $
                          {(
                            Number(item.price) *
                            Number(item.quantity)
                          ).toFixed(2)}
                        </div>

                      </div>
                    ))}

                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 pt-5 border-t border-gray-100">

                    <h3 className="font-bold text-gray-900 mb-2">
                      Shipping Address
                    </h3>

                    <p className="text-gray-600 text-sm">
                      {order.shippingAddress?.address}
                    </p>

                    <p className="text-gray-600 text-sm">
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.postalCode}
                    </p>

                    <p className="text-gray-600 text-sm">
                      {order.shippingAddress?.country}
                    </p>

                  </div>

                  {/* Status */}
                  <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        🚚
                      </div>

                      <div>
                        <p className="font-bold text-green-800">
                          Order {order.status}
                        </p>

                        <p className="text-sm text-green-700">
                          Your order has been placed successfully.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Orders;