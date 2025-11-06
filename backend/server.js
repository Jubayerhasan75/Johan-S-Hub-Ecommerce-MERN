import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';

// Route file imports
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

// --- Database connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.error("MongoDB Connection Error:", err));
const app = express();
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes); // upload routes

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));