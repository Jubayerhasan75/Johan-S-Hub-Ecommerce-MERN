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

// --- Database connection (Apnar "Niom" Onusare) ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const app = express();

// --- CORS Fix (Shobar jonno Unmukto) ---
// Ei code-ti apnar local ebong live (Vercel) shob jaigay kaj korbe
app.use(cors());

app.use(express.json());

// --- Routes ---
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes); // upload routes

// --- Error Handlers (Jodi Apni Jog Korte Chan) ---
// Error handling-er jonno ei 2-ti file project-e thakte hobe
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));