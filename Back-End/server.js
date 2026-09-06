require("dotenv").config();

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const connectDB = require("./db");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

const server = http.createServer(app);

// ===============================
// SOCKET.IO
// ===============================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// ===============================
// DATABASE
// ===============================

connectDB();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());

// ===============================
// UPLOADS
// ===============================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ===============================
// ROUTES
// ===============================

app.use("/api/products", productRoutes);

app.use("/api/users", userRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/chat", chatRoutes);

// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "E-commerce API is running",
  });
});

// ===============================
// SOCKET.IO CHAT
// ===============================

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // =================================
  // CUSTOMER JOIN CHAT
  // =================================

  socket.on("joinChat", (userId) => {
    if (!userId) {
      return;
    }

    const room = `user_${userId}`;

    socket.join(room);

    console.log(
      `Customer joined room: ${room}`
    );
  });

  // =================================
  // ADMIN JOIN CHAT
  // =================================

  socket.on("joinAdmin", () => {
    socket.join("admin");

    console.log(
      "Admin joined admin chat room"
    );
  });

  // =================================
  // SEND MESSAGE
  // =================================

  socket.on("sendMessage", (message) => {
    console.log(
      "Socket message received:",
      message
    );

    if (!message) {
      return;
    }

    const userId =
      message.user?._id ||
      message.user;

    if (!userId) {
      console.log(
        "Message does not contain user ID"
      );

      return;
    }

    // =================================
    // CUSTOMER -> ADMIN
    // =================================

    if (message.sender === "user") {
      io.to("admin").emit(
        "receiveMessage",
        message
      );

      console.log(
        "Customer message sent to admin"
      );
    }

    // =================================
    // ADMIN -> CUSTOMER
    // =================================

    if (message.sender === "admin") {
      io.to(`user_${userId}`).emit(
        "receiveMessage",
        message
      );

      console.log(
        "Admin reply sent to customer"
      );
    }
  });

  // =================================
  // DISCONNECT
  // =================================

  socket.on("disconnect", () => {
    console.log(
      "Socket disconnected:",
      socket.id
    );
  });
});

// ===============================
// 404
// ===============================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ===============================
// START SERVER
// ===============================

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );

  console.log(
    "Socket.IO chat server is running"
  );
});