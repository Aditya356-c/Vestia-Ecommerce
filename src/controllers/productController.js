import Product from "../models/Product.js";

export const getProductByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    let products;
    // Fetch product form the database
    if (category === "new-arrivals") {
      products = await Product.find().sort({ createdAt: -1 }).limit(10);
    } else {
      products = await Product.find({ category });
    }
    if (!products.length) {
      // if products not found , return 404 status
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }
    res.status(200).json(products);
    // Return the products
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const getProductId = req.params.id; // Get the product ID from the URL
    const productDetail = await Product.findById(getProductId);

    if (!productDetail) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(productDetail);
  } catch (error) {
    console.error("[Product details] : ", error); //for debugging
    res.status(500).json({ error: "Error fetching product details" });
  }
};
