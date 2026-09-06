import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://shop-ease-backend-912xhys0i-e-commerce-e21d.vercel.app");

function ChatBox() {
  const [open, setOpen] = useState(false);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const token =
    localStorage.getItem("token");

  const userId =
    user?._id || user?.id;

  // =====================================
  // LOAD CHAT
  // =====================================

  useEffect(() => {
    if (!token || !userId) {
      return;
    }

    // Join customer's private room
    socket.emit(
      "joinChat",
      userId
    );

    // ===================================
    // LOAD OLD MESSAGES
    // ===================================

    const loadMessages = async () => {
      try {
        const response = await fetch(
          "https://shop-ease-backend-912xhys0i-e-commerce-e21d.vercel.app/api/chat",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (response.ok) {
          setMessages(data);
        } else {
          console.error(data);
        }
      } catch (error) {
        console.error(
          "Failed to load chat:",
          error
        );
      }
    };

    loadMessages();

    // ===================================
    // RECEIVE ADMIN MESSAGE
    // ===================================

    const handleReceiveMessage = (
      newMessage
    ) => {
      console.log(
        "Customer received:",
        newMessage
      );

      const messageUserId =
        newMessage?.user?._id ||
        newMessage?.user;

      // Only receive admin messages
      // belonging to this customer
      if (
        newMessage?.sender === "admin" &&
        messageUserId?.toString() ===
          userId?.toString()
      ) {
        setMessages((previous) => {
          // Duplicate protection
          if (
            newMessage._id &&
            previous.some(
              (item) =>
                item._id ===
                newMessage._id
            )
          ) {
            return previous;
          }

          return [
            ...previous,
            newMessage,
          ];
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
  }, [token, userId]);

  // =====================================
  // SEND CUSTOMER MESSAGE
  // =====================================

  const sendMessage = async (e) => {
    e.preventDefault();

    if (
      !message.trim() ||
      !token ||
      !userId
    ) {
      return;
    }

    try {
      const response = await fetch(
        "https://shop-ease-backend-912xhys0i-e-commerce-e21d.vercel.app/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: message.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Message failed"
        );

        return;
      }

      // =================================
      // ADD MESSAGE LOCALLY ONLY ONCE
      // =================================

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

        return [
          ...previous,
          data,
        ];
      });

      // =================================
      // SEND TO ADMIN THROUGH SOCKET
      // =================================

      socket.emit("sendMessage", {
        ...data,
        sender: "user",
      });

      setMessage("");
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      alert("Server error");
    }
  };

  // =====================================
  // LOGIN REQUIRED
  // =====================================

  if (!user || !token) {
    return null;
  }

  // =====================================
  // UI
  // =====================================

  return (
    <>
      {/* OPEN BUTTON */}

      {!open && (
        <button
          onClick={() =>
            setOpen(true)
          }
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl text-2xl transition"
        >
          💬
        </button>
      )}

      {/* CHAT WINDOW */}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-30px)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

          {/* HEADER */}

          <div className="bg-blue-600 text-white px-4 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold">
                ShopEase Support
              </h2>

              <p className="text-xs text-blue-100">
                Online support
              </p>
            </div>

            <button
              onClick={() =>
                setOpen(false)
              }
              className="text-xl hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* MESSAGES */}

          <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-3">

            {messages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm mt-24">

                <div className="text-3xl mb-2">
                  💬
                </div>

                Ask us anything about our
                products.

              </div>
            ) : (
              messages.map(
                (item, index) => (
                  <div
                    key={
                      item._id ||
                      index
                    }
                    className={`flex ${
                      item.sender ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl ${
                        item.sender ===
                        "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >

                      <p className="text-sm">
                        {item.message}
                      </p>

                      <span className="text-[10px] opacity-60">
                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleTimeString()
                          : ""}
                      </span>

                    </div>

                  </div>
                )
              )
            )}

          </div>

          {/* INPUT */}

          <form
            onSubmit={sendMessage}
            className="p-3 border-t bg-white flex gap-2"
          >

            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              placeholder="Ask about a product..."
              className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl font-semibold"
            >
              Send
            </button>

          </form>

        </div>
      )}
    </>
  );
}

export default ChatBox;