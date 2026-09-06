import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";

const socket = io("https://shop-ease-backend-912xhys0i-e-commerce-e21d.vercel.app");

function AdminChat() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("adminToken");

  // =========================================
  // LOAD CHAT
  // =========================================

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Admin ko socket room mein join karwao
    socket.emit("joinAdmin");

    // =======================================
    // OLD MESSAGES LOAD
    // =======================================

    const loadChat = async () => {
      try {
        const response = await fetch(
          "https://shop-ease-backend-912xhys0i-e-commerce-e21d.vercel.app/api/admin/chat",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(data);
          return;
        }

        setMessages(data);

        // Unique customers
        const uniqueCustomers = [];

        data.forEach((item) => {
          if (
            item.user &&
            typeof item.user === "object"
          ) {
            const exists = uniqueCustomers.some(
              (customer) =>
                customer._id === item.user._id
            );

            if (!exists) {
              uniqueCustomers.push(item.user);
            }
          }
        });

        setCustomers(uniqueCustomers);

        // First customer automatically select
        if (uniqueCustomers.length > 0) {
          setSelectedCustomer(uniqueCustomers[0]);
        }
      } catch (error) {
        console.error(
          "Load chat error:",
          error
        );
      }
    };

    loadChat();

    // =======================================
    // RECEIVE NEW MESSAGE
    // =======================================

    const handleReceiveMessage = (newMessage) => {
      console.log(
        "ADMIN RECEIVED:",
        newMessage
      );

      // Message add karo
      setMessages((previous) => {
        if (
          newMessage._id &&
          previous.some(
            (item) =>
              item._id === newMessage._id
          )
        ) {
          return previous;
        }

        return [...previous, newMessage];
      });

      // Customer information
      const customer = newMessage.user;

      if (
        customer &&
        typeof customer === "object"
      ) {
        // Customer list mein add karo
        setCustomers((previous) => {
          const exists = previous.some(
            (item) =>
              item._id === customer._id
          );

          if (exists) {
            return previous;
          }

          return [...previous, customer];
        });

        // Agar koi customer selected nahi
        // to new customer select karo
        setSelectedCustomer((previous) => {
          if (!previous) {
            return customer;
          }

          return previous;
        });
      }
    };

    socket.on(
      "receiveMessage",
      handleReceiveMessage
    );

    return () => {
      socket.off(
        "receiveMessage",
        handleReceiveMessage
      );
    };
  }, [token, navigate]);

  // =========================================
  // SEND ADMIN MESSAGE
  // =========================================

  const sendMessage = async (e) => {
    e.preventDefault();

    if (
      !message.trim() ||
      !selectedCustomer ||
      !token
    ) {
      return;
    }

    try {
      const response = await fetch(
        "https://shop-ease-backend-912xhys0i-e-commerce-e21d.vercel.app/api/admin/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: message.trim(),
            userId: selectedCustomer._id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Message failed"
        );

        return;
      }

      // Admin ka message local state mein add
      setMessages((previous) => {
        if (
          data._id &&
          previous.some(
            (item) =>
              item._id === data._id
          )
        ) {
          return previous;
        }

        return [...previous, data];
      });

      // Customer ko realtime bhejo
      socket.emit(
        "sendMessage",
        data
      );

      setMessage("");
    } catch (error) {
      console.error(
        "Send admin message error:",
        error
      );

      alert("Server error");
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin/login");
  };

  // =========================================
  // SELECTED CUSTOMER MESSAGES
  // =========================================

  const customerMessages = messages.filter(
    (item) => {
      const itemUserId =
        item.user &&
        typeof item.user === "object"
          ? item.user._id
          : item.user;

      const selectedUserId =
        selectedCustomer
          ? selectedCustomer._id
          : null;

      return (
        itemUserId &&
        selectedUserId &&
        itemUserId.toString() ===
          selectedUserId.toString()
      );
    }
  );

  // =========================================
  // UI
  // =========================================

  return (
    <div className="h-screen overflow-hidden bg-gray-100">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <header className="h-16 bg-gray-900 text-white">

        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

          <Link
            to="/admin"
            className="text-xl font-bold"
          >
            ShopEase Admin
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>

        </div>

      </header>

      {/* ================================= */}
      {/* MAIN */}
      {/* ================================= */}

      <main className="max-w-7xl mx-auto px-4 py-5 h-[calc(100vh-64px)] overflow-hidden">

        <Link
          to="/admin"
          className="text-blue-600 hover:underline"
        >
          ← Dashboard
        </Link>

        {/* ================================= */}
        {/* CHAT LAYOUT */}
        {/* ================================= */}

        <div className="mt-4 h-[calc(100%-32px)] grid grid-cols-1 lg:grid-cols-4 gap-5 overflow-hidden">

          {/* ================================= */}
          {/* LEFT CUSTOMER PANEL */}
          {/* ================================= */}

          <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden flex flex-col min-h-0">

            {/* CUSTOMER HEADER */}

            <div className="p-5 border-b shrink-0">

              <h2 className="font-bold text-lg">
                Customers
              </h2>

              <p className="text-sm text-gray-500">
                {customers.length} customer
                {customers.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

            {/* CUSTOMER SCROLL */}

            <div className="flex-1 min-h-0 overflow-y-auto">

              {customers.length === 0 ? (
                <p className="p-5 text-sm text-gray-400">
                  Waiting for customer
                  message...
                </p>
              ) : (
                customers.map((customer) => {

                  const isSelected =
                    selectedCustomer &&
                    selectedCustomer._id ===
                      customer._id;

                  return (
                    <button
                      key={customer._id}
                      onClick={() =>
                        setSelectedCustomer(
                          customer
                        )
                      }
                      className={
                        "w-full text-left p-4 border-b hover:bg-blue-50 transition " +
                        (isSelected
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "")
                      }
                    >

                      <p className="font-semibold text-gray-800">
                        {customer.name ||
                          "Customer"}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {customer.email || ""}
                      </p>

                    </button>
                  );
                })
              )}

            </div>

          </div>

          {/* ================================= */}
          {/* RIGHT CHAT PANEL */}
          {/* ================================= */}

          <div className="lg:col-span-3 bg-white rounded-2xl shadow border border-gray-200 overflow-hidden flex flex-col min-h-0">

            {/* CHAT HEADER */}

            <div className="bg-blue-600 text-white p-5 shrink-0">

              {selectedCustomer ? (
                <>
                  <h1 className="text-xl font-bold">
                    {selectedCustomer.name}
                  </h1>

                  <p className="text-sm text-blue-100">
                    {selectedCustomer.email}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-xl font-bold">
                    Customer Support
                  </h1>

                  <p className="text-sm text-blue-100">
                    Waiting for customer
                    message...
                  </p>
                </>
              )}

            </div>

            {/* ================================= */}
            {/* MESSAGE SCROLL */}
            {/* ================================= */}

            <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 p-5">

              {!selectedCustomer ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Waiting for customer
                  message...
                </div>
              ) : customerMessages.length ===
                0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No messages from this
                  customer.
                </div>
              ) : (
                <div className="space-y-4">

                  {customerMessages.map(
                    (item, index) => {

                      const isAdmin =
                        item.sender ===
                        "admin";

                      return (
                        <div
                          key={
                            item._id ||
                            index
                          }
                          className={
                            "flex " +
                            (isAdmin
                              ? "justify-end"
                              : "justify-start")
                          }
                        >

                          <div
                            className={
                              "max-w-[75%] px-4 py-3 rounded-2xl " +
                              (isAdmin
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-200 text-gray-800")
                            }
                          >

                            <p className="text-xs font-semibold opacity-70 mb-1">
                              {isAdmin
                                ? "Admin"
                                : selectedCustomer.name}
                            </p>

                            <p className="text-sm">
                              {item.message}
                            </p>

                            <p className="text-[10px] opacity-60 mt-1">
                              {item.createdAt
                                ? new Date(
                                    item.createdAt
                                  ).toLocaleTimeString()
                                : ""}
                            </p>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>

            {/* ================================= */}
            {/* MESSAGE INPUT */}
            {/* ================================= */}

            <form
              onSubmit={sendMessage}
              className="p-4 border-t flex gap-3 shrink-0"
            >

              <input
                type="text"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                disabled={
                  !selectedCustomer
                }
                placeholder={
                  selectedCustomer
                    ? "Write a reply..."
                    : "Waiting for customer..."
                }
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 disabled:bg-gray-100"
              />

              <button
                type="submit"
                disabled={
                  !selectedCustomer
                }
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 rounded-xl font-semibold"
              >
                Send
              </button>

            </form>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminChat;