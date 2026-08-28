
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3000;

// =======================
// Database
// =======================
const db = require("./config/db");

// =======================
// Routes
// =======================
const userRoutes = require("./route/userRoutes");
const sellerRoutes = require("./route/sellerRoutes");
const sellerProductRoutes = require("./route/sellerProductRoutes");
const deliveryBoyRoutes = require("./route/deliveryRoutes");
const productRoutes = require("./route/productRoutes");
const cartRoutes = require("./route/cartRoutes");
const adminRoutes = require("./route/adminRoutes");
const orderRoutes = require("./route/orderRoutes");
const paymentRoutes = require("./route/paymentRoutes");

// =======================
// Middleware
// =======================
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:3000",
//       "http://127.0.0.1:5173",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );



app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://full-stack-ecomerce-virid.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.use(express.json());
app.use(cookieParser());

// =======================
// Routes
// =======================
app.get("/", (req, res) => {
  res.send("hello server");
});

app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/seller/products", sellerProductRoutes);
app.use("/api/delivery-boy", deliveryBoyRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// =======================
// HTTP Server & Socket.IO Setup
// =======================
const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:3000",
//       "http://127.0.0.1:5173",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   },
//   transports: ["polling", "websocket"],
// });






const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://full-stack-ecomerce-virid.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  },
  transports: ["polling", "websocket"],
});











// Socket Instance সেট করা
require("./config/socket").setIO(io);

// =======================
// Socket Connection Handlers
// =======================
io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  // কাস্টমার রুম
  socket.on("joinCustomer", (customerId) => {
    if (!customerId) return;
    const room = `customer_${String(customerId)}`;
    socket.join(room);
    console.log(`👤 Customer joined room: ${room}`);
  });

  // সেলার রুম
  socket.on("joinSeller", (sellerId) => {
    if (!sellerId) return;
    const room = `seller_${String(sellerId)}`;
    socket.join(room);
    console.log(`🏪 Seller joined room: ${room}`);
  });

  // ডেলিভারি বয় রুম
  socket.on("joinDeliveryBoy", (deliveryBoyId) => {
    if (!deliveryBoyId) return;
    const room = `deliveryBoy_${String(deliveryBoyId)}`;
    socket.join(room);
    console.log(`🛵 Delivery boy joined room: ${room}`);
  });

  // সরাসরি অর্ডার ব্রডকাস্ট ইভেন্ট
  socket.on("orderPlacedTrigger", (data) => {
    console.log("⚡ [SOCKET SERVER] Order Received:", data);

    const sId = data?.sellerId ? String(data.sellerId) : null;
    const payload = {
      ...data,
      message: "🔔 নতুন অর্ডার এসেছে!",
      timestamp: new Date().toISOString(),
    };

    if (sId) {
      io.to(`seller_${sId}`).emit("newOrderAlert", payload);
      io.to(`seller_${sId}`).emit("new_order_notification", payload);
    }

    // গ্লোবাল ফলব্যাক ব্রডকাস্ট
    io.emit("newOrderAlert", payload);
    io.emit("globalNewOrder", payload);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// =======================
// Start Server
// =======================
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});