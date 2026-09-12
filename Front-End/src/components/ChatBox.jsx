import { useEffect, useState } from "react";

const API_URL = "https://shop-ease-backend-blush.vercel.app";

function ChatBox() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!token || !userId) return;

    const loadMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/chat`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setMessages(Array.isArray(data) ? data : data.messages || []);
        }
      } catch (error) {
        console.error("Load chat error:", error);
      }
    };

    loadMessages();
  }, [token, userId]);

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!message.trim() || !token || !userId) return;

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Message failed");
        return;
      }

      setMessages((previous) => [...previous, data]);
      setMessage("");
    } catch (error) {
      console.error("Send message error:", error);
      alert("Server error");
    }
  };

  if (!token || !userId) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="flex h-[450px] w-[320px] flex-col rounded-xl bg-white shadow-2xl">
          <div className="flex items-center justify-between rounded-t-xl bg-blue-600 px-4 py-3 text-white">
            <h3 className="font-semibold">Chat with Admin</h3>

            <button
              onClick={() => setOpen(false)}
              className="text-xl"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {messages.length === 0 ? (
              <p className="text-center text-sm text-gray-500">
                No messages yet
              </p>
            ) : (
              messages.map((item, index) => (
                <div
                  key={item._id || index}
                  className={`rounded-lg p-2 text-sm ${
                    item.sender === "admin"
                      ? "mr-8 bg-gray-100"
                      : "ml-8 bg-blue-100"
                  }`}
                >
                  {item.message}
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="flex gap-2 border-t p-3"
          >
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write message..."
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-3 py-2 text-white"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg"
        >
          Chat
        </button>
      )}
    </div>
  );
}

export default ChatBox;