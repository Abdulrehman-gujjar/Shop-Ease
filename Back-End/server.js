require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");

const connectDB = require("./db");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// ============================================
// CORS
// ============================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://shop-ease-frontend-neon.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an origin
    // such as Postman/server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(`CORS blocked: ${origin}`)
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  credentials: true,

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

// ============================================
// BODY PARSER
// ============================================

app.use(express.json());

// ============================================
// DATABASE
// ============================================

connectDB();

// ============================================
// UPLOADS
// ============================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ============================================
// API ROUTES
// ============================================

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

// ============================================
// HOME
// ============================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-commerce API is running",
  });
});

// ============================================
// SOCKET.IO
// ============================================

const io = new Server({
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },

  transports: ["polling", "websocket"],
});

// ============================================
// SOCKET CONNECTION
// ============================================

io.on("connection", (socket) => {
  console.log(
    "Socket connected:",
    socket.id
  );

  // ========================================
  // CUSTOMER JOIN CHAT
  // ========================================

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

  // ========================================
  // ADMIN JOIN CHAT
  // ========================================

  socket.on("joinAdmin", () => {
    socket.join("admin");

    console.log(
      "Admin joined admin room"
    );
  });

  // ========================================
  // SEND MESSAGE
  // ========================================

  socket.on("sendMessage", (message) => {
    if (!message) {
      return;
    }

    console.log(
      "Socket message:",
      message
    );

    const userId =
      message.user?._id ||
      message.user?.id ||
      message.user;

    if (!userId) {
      console.log(
        "No user ID found in message"
      );

      return;
    }

    // CUSTOMER -> ADMIN
    if (message.sender === "user") {
      io.to("admin").emit(
        "receiveMessage",
        message
      );

      console.log(
        "Customer message sent to admin"
      );
    }

    // ADMIN -> CUSTOMER
    if (message.sender === "admin") {
      io.to(`user_${userId}`).emit(
        "receiveMessage",
        message
      );

      console.log(
        "Admin message sent to customer"
      );
    }
  });

  // ========================================
  // DISCONNECT
  // ========================================

  socket.on("disconnect", (reason) => {
    console.log(
      `Socket disconnected: ${socket.id}`,
      reason
    );
  });
});

// ============================================
// 404
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error(
    "Server error:",
    err
  );

  if (err.message?.startsWith("CORS blocked")) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ============================================
// EXPORT FOR VERCEL
// ============================================

module.exports = app;