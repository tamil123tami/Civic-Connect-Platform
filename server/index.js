import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import complaintRoutes from "./routes/complaintRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for dev
    methods: ["GET", "POST", "PATCH"]
  }
});

// Middleware to make io accessible in controllers
app.set("io", io);

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Complaint routes
app.use("/complaints", complaintRoutes);

// Socket.io connection logging
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Server start
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
