/* ======= COMMON REUSABLE UTILITY FUNCTIONS =============*/
const APP_STORAGE_KEY = "userCredential";

/**
 * Handle the back button navigation.
 * Navigates back to the previous page in browser history.
 */
export function navigateBack() {
  document.querySelectorAll(".back__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (history.length > 1) {
        history.back();
      } else {
        window.Location.href = "/";
      }
    });
  });
}

/**
 * Save a value to localStorage with a specific key.
 *  key    {string}  - The localStorage key.
 *  value  {any}     - The value to store (automatically stringified).
 */

export function saveToLocalStorage(value) {
  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    alert("⛔ Failed to save data. try again later");
  }
}

/**
 *  Retrieve a value from localStorage by key.
 *  key    {string}  - The localStorage key.
 *  value  {any}     - The parsed value from localStorage, or null if not found.
 */

export function getFormLocalStorage() {
  try {
    const value = localStorage.getItem(APP_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Failed to retrieve from localStorage:", error);
    alert("⛔ Failed to retrieve data. try again later");
    return null;
  }
}

/**
 * Creates an image element with fallback behavior.
 * If `src` is not provided or the image fails to load, a default placeholder is shown.
 */

export function fallbackImageElement(src, alt) {
  if (!src) {
    return '<div class="no_product-image">Sorry, no image available</div>';
  } else {
    return `<img src="${src}" 
         alt="${alt}"
        class="product__image" 
        onerror="this.onerror=null;this.parentElement.innerHTML='<div class=${"no_product-image"}>Sorry, no image available</div>'"/>`;
  }
}

/**
 * Calculates the discount percentage between the original price and the discounted price.
 * actualPrice    {number}  -  The original price of the product.
 * discountPrice  {number}  -  The discounted price of the product.
 * Return         {number}  -  Discount percentage rounded to the nearest whole number.
 */

export function calculateDiscount(actualPrice, discountPrice) {
  const discount = actualPrice
    ? Math.round(((actualPrice - discountPrice) / actualPrice) * 100)
    : 0;

  return discount;
}

export function fixDecimalCurrency(number) {
  return `$${number.toFixed(2)}`;
}
