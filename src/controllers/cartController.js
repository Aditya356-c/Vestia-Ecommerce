import User from "../models/User.js";
import Product from "../models/Product.js";

export const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by ID and populate the cart with product details
    const user = await User.findById(userId).populate("cart.productId");

    // If the user doesn't exist, return a 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If the cart is empty, send a relevant message
    const cart = user.cart || [];
    if (cart.length === 0) {
      return res
        .status(200)
        .json({ message: "No products have been added to your cart" });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    console.error("[Get User Cart]:", error); // for debugging
    res.status(500).json({ error: "Error fetching cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, selectedSize, quantity } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the selected size is available
    if (!product.sizes.includes(selectedSize)) {
      return res
        .status(404)
        .json({ error: "Selected size is not available for this product" });
    }

    // Check if the product and size already exist in the cart
    const existingProduct = user.cart.find(
      (item) =>
        item.productId.toString() === productId &&
        item.selectedSize === selectedSize
    );

    if (existingProduct) {
      // Update the quantity if the product exists
      existingProduct.quantity += parseInt(quantity);
    } else {
      // Add a new product to the cart
      user.cart.push({
        productId,
        selectedSize,
        quantity: parseInt(quantity),
      });
    }
    await user.save(); // Save the updated cart

    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    console.error("[Add To Cart]:", error); // for debugging
    res.status(500).json({
      error: "Failed to add product to cart. Please try again later.",
    });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Filter out the product to be removed
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );
    await user.save();
    res.status(200).json({
      message: "The selected product has been removed successfully.",
      cart: user.cart,
    });
  } catch (error) {
    console.error("[Remove Product]:", error); // for debugging
    res.status(500).json({
      error: "Failed to remove product from cart. Please try again later.",
    });
  }
};
