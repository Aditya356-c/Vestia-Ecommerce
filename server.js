import express from "express";
import path from "path";
import * as url from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Get the directory name of the current file

const PORT = process.env.SERVER_PORT || 5000;

import connectDB from "./src/config/database.js";
import errorHandler from "./src/middlewares/errorHandler.js";

// Import Routes
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public/client"));

// Serve the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "public", "client", "index.html"));
});

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);

// Error handler middleware
app.use(errorHandler);

app
  .listen(PORT, () => {
    console.log(`[Server run] : Server running at port ${PORT}`);
  })
  .on("error", () => {
    // Handle server error
    console.error("[Server error]:", error);
    throw new Error(error.message);
  });
