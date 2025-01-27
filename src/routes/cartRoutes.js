import express from "express";
import {
  getUserCart,
  addToCart,
  removeProduct,
} from "../controllers/cartController.js";
const router = express.Router();

router.post("/", getUserCart);
router.post("/add", addToCart);
router.delete("/remove", removeProduct);

export default router;
