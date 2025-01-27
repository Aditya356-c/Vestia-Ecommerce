import {
  LoaderHTML,
  fallbackMessage,
  productDetailHTML,
} from "../templates/template.js";
import { ProductDetail, CartDetails, AddToCart } from "./ApiService.js";
import { getFormLocalStorage } from "./utility.js";

/**
 * Updates the cart item count displayed in the UI.
 *
 * - Checks if a user is logged in by retrieving their data from localStorage.
 * - Fetches the user's cart details and updates all cart counter elements.
 * - Handles errors gracefully by logging them and resetting the cart count to zero.
 */

export async function updateCartCount() {
  try {
    const cartCounter = document.querySelectorAll(".item__counter");
    // Retrieve stored user data
    const storedUser = getFormLocalStorage();
    // Check if the user is logged in and has a valid userId
    if (!storedUser || !storedUser.userId) {
      console.warn("No user found or invalid userId.");
      return;
    }
    // Fetch the cart details for the logged-in user
    const totalItemsInCart = await CartDetails(storedUser.userId);
    cartCounter.forEach(
      (label) => (label.innerText = totalItemsInCart.length || 0)
    );
  } catch (error) {
    console.error("Error updating cart count:", error);
    // Optionally show a fallback count in case of error
    cartCounter.forEach((label) => (label.innerText = "0"));
  }
}
// Retrieves the selected product size from the size radio inputs.
function getSelectedSize() {
  const selectedSizeElement = document.querySelector(
    'input[name="size"]:checked'
  );
  return selectedSizeElement ? selectedSizeElement.value : null;
}
// Retrieves the selected product quantity from the input field.
function getSelectedQuantity() {
  const quantityElement = document.getElementById("qty-input");
  return quantityElement ? parseInt(quantityElement.value) : 1;
}

// Handles the addition of a product to the user's cart.
async function handleAddToCart(productId) {
  const getUserId = getFormLocalStorage();

  // Guard clauses to ensure valid input
  if (!getUserId || !getUserId.userId) {
    alert("⚠️ Please register before shopping on Vestia.");
    return;
  }
  // Guard clause: Ensure a valid product ID is provided
  if (!productId) {
    alert("⛔ Product ID is not available.");
    return;
  }

  const selectedSize = getSelectedSize();
  const qualitySelected = getSelectedQuantity();

  try {
    // Call API to add product to the cart
    const addProduct = await AddToCart({
      userId: getUserId.userId,
      productId,
      selectedSize,
      quantity: qualitySelected,
    });

    // Handle response from API
    if (addProduct && addProduct.message) {
      alert(`✅ ${addProduct.message}`);
      await updateCartCount(); // Update the cart count after adding the product
    } else {
      alert("⛔ Failed to add product to cart. Please try again later.");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert(" ⛔ Failed to add product to cart. Please try again later.");
  }
}

/**
 * Handles the functionality for increasing and decreasing the product quantity.
 * Updates the quantity input field and enables/disables the quantity control buttons
 * based on the current value and maximum allowable quantity.
 */
function handleItemQuantity() {
  const increaseQtyBtn = document.getElementById("increase-qty");
  const decreaseQtyBtn = document.getElementById("decrease-qty");
  const inputQtyField = document.getElementById("qty-input");

  // Helper function to update the button state (disabled or not)
  function updateQtyButtonState() {
    const value = parseInt(inputQtyField.value);
    const maxQty = parseInt(inputQtyField.max);
    const minQty = 1;

    increaseQtyBtn.disabled = value >= maxQty;
    decreaseQtyBtn.disabled = value <= minQty;
  }

  // Increase Quantity
  increaseQtyBtn.addEventListener("click", () => {
    let value = parseInt(inputQtyField.value);

    // Increase to max number
    value = isNaN(value) ? 1 : Math.min(value + 1, parseInt(inputQtyField.max));
    inputQtyField.value = value;

    updateQtyButtonState();
  });

  // Decrease Quantity
  decreaseQtyBtn.addEventListener("click", () => {
    let value = parseInt(inputQtyField.value);

    // Decrease to min number (1)
    value = isNaN(value) ? 1 : Math.max(value - 1, 1);
    inputQtyField.value = value;

    updateQtyButtonState();
  });
}

/**
 * Initializes and displays the product details based on the product ID from the URL.
 * Fetches the product details, handles errors, and renders the product page with the necessary information.
 */
export async function initializeProductDetails() {
  const section = document.getElementById("product_detail-wrapper");

  // Extract Product ID from URL
  const extractProductId = new URLSearchParams(window.location.search);
  const currentProductId = extractProductId.get("productId");

  // Validate ProductId
  if (!currentProductId) {
    section.innerHTML = fallbackMessage("Invalid Product Id.");
    return;
  }

  // show loader
  section.innerHTML = LoaderHTML;

  try {
    // Fetch product details
    const product = await ProductDetail(currentProductId);

    if (!product) {
      section.innerHTML = fallbackMessage(
        "Product not found. Please check the product ID."
      );
      return;
    }

    // Render Product Details
    section.innerHTML = productDetailHTML(
      product._id,
      product.ondiscount,
      product.image,
      product.name,
      product.description,
      product.sizes,
      product.discountPrice,
      product.price,
      product.stock
    );
    if (product.stock > 0) {
      handleItemQuantity();
      window.handleAddToCart = handleAddToCart;
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
    section.innerHTML = fallbackMessage(
      "Something went wrong. Please try again later."
    );
  }
}
