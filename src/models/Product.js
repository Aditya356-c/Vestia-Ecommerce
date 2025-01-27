import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  onSale: { type: Boolean, default: false },
  salePrice: Number,
  category: { type: String, required: true, enum: ["men", "women"] },
  sizes: [String, Number],
  stock: { type: Number, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
