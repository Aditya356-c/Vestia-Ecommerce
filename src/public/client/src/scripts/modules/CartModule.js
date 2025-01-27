import {
  LoaderHTML,
  fallbackMessage,
  orderItemHTML,
} from "../templates/template.js";
import { CartDetails, RemoveProduct } from "./ApiService.js";
import { fixDecimalCurrency, getFormLocalStorage } from "./utility.js";

/**
 * Calculates and updates the cart's subtotal, discounts, delivery fee, and total price in the UI.
 *
 * - Retrieves the user's id from local storage and fetches their cart details.
 * - If the cart is empty, displays "$0" for all calculations.
 * - Computes the subtotal, total discount, delivery fee, and total price based on product prices and quantities.
 * - Updates the respective HTML elements with the formatted values.
 */

export async function calculateCartTotal() {
  const subTotal = document.getElementById("sub-total");
  const totalDiscount = document.getElementById("total-discount");
  const deliveryFee = document.getElementById("delivery-fee");
  const totalCartPrice = document.getElementById("total_cart-price");

  const getUserId = getFormLocalStorage();
  const items = await CartDetails(getUserId?.userId);

  if (!items.length) {
    subTotal.innerText = "$0";
    totalDiscount.innerText = "$0";
    deliveryFee.innerText = "$0";
    totalCartPrice.innerText = "$0";
    return;
  }

  let subtotalCount = 0;
  let totalDiscountCount = 0;

  const cartSummary = items.reduce(
    (acc, { productId, quantity }) => {
      const itemPrice = productId.ondiscount
        ? productId.discountPrice
        : productId.price;
      const discountAmount = productId.ondiscount
        ? productId.price - productId.discountPrice
        : 0;

      acc.subtotalCount += itemPrice * quantity;
      acc.totalDiscountCount += discountAmount * quantity;

      return acc;
    },

    {
      subtotalCount: 0,
      totalDiscountCount: 0,
    }
  );

  const calculateDeliveryFee = cartSummary.subtotalCount;
  const calculateTotal = cartSummary.subtotalCount + calculateDeliveryFee;

  subTotal.innerText = fixDecimalCurrency(cartSummary.subtotalCount);
  totalDiscount.innerText = fixDecimalCurrency(cartSummary.totalDiscountCount);
  deliveryFee.innerText = fixDecimalCurrency(calculateDeliveryFee);
  totalCartPrice.innerText = fixDecimalCurrency(calculateTotal);
}

/**
 * Handles the removal of a product from the cart.
 *
 * - Verifies if the `productId` and user data are available.
 * - Sends a request to remove the specified product from the user's cart.
 * - Displays a success or error message based on the response.
 * - Reloads the user's cart to reflect the updated cart state.
 */

export async function handleRemoveCartItem(productId) {
  try {
    if (!productId) {
      throw new Error("⛔ ProductId is not available. ");
    }

    const getUserId = getFormLocalStorage();

    if (!getUserId || !getUserId.userId) {
      throw new Error("⛔ User data not found.");
    }

    const removeItem = await RemoveProduct({
      userId: getUserId.userId,
      productId,
    });

    alert(`✅ ${removeItem.message}` || `⛔ ${removeItem.error}`);
    loadUserCart();
  } catch (error) {
    console.log("Error remove item from cart", error);
    alert(
      error || "⛔ Failed to remove product from cart. Please try again later."
    );
  }
}

/**
 * Loads and displays the user's cart items.
 *
 * - Displays a loader while fetching cart data.
 * - Retrieves the user's cart data using their user ID.
 * - Renders cart items or displays a fallback message if the cart is empty.
 * - Initializes cart item removal functionality and updates the cart's total price.
 */

export async function loadUserCart() {
  const section = document.getElementById("order-items");
  section.innerHTML = LoaderHTML; //Show loader while fetching products.

  try {
    const getUserId = getFormLocalStorage();
    const loadCart = await CartDetails(getUserId?.userId);

    if (loadCart.length > 0) {
      section.innerHTML = loadCart
        .map(({ productId, quantity, selectedSize }) => {
          return orderItemHTML(
            productId._id,
            productId.ondiscount,
            productId.image,
            productId.name,
            productId.category,
            productId.discountPrice,
            productId.price,
            selectedSize,
            quantity
          );
        })
        .join("");

      window.handleRemoveCartItem = handleRemoveCartItem;
      calculateCartTotal();
    } else {
      section.innerHTML = fallbackMessage(
        "No products have been added to your cart."
      );
      calculateCartTotal();
    }
  } catch (error) {
    console.log("Error cart loading:", error);
    section.innerHTML = fallbackMessage(
      "Something went wrong. Please try again later."
    );
  }
}
