import express from "express";
import {
  getProductById,
  getProductByCategory,
} from "../controllers/productController.js";
const router = express.Router();

router.get("/product-detail/:id", getProductById);
router.get("/product-category/:category", getProductByCategory);

export default router;
