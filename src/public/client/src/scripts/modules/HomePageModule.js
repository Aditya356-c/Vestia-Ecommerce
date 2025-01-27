import {
  LoaderHTML,
  fallbackMessage,
  productCardHTML,
} from "../templates/template.js";
import { GetProductsByCategory } from "./ApiService.js";

/**
 * Renders a list of products in a given section based on the specified category.
 * Fetches products from the server, handles errors, and updates the UI accordingly.
 *
 * sectionId   {string} - The ID of the DOM element where products will be rendered.
 * category    {string} - The category of products to fetch and display.
 */
async function renderProducts(sectionId, category) {
  const section = document.getElementById(sectionId);
  section.innerHTML = LoaderHTML; //Show loader while fetching products.

  try {
    const fetchProducts = await GetProductsByCategory(category);
    // Render the products or show a fallback message if none exists.
    if (fetchProducts.length > 0) {
      section.innerHTML = fetchProducts
        .map((product) =>
          productCardHTML(
            product._id,
            product.ondiscount,
            product.image,
            product.name,
            product.category,
            product.discountPrice,
            product.price
          )
        )
        .join("");
    } else {
      section.innerHTML = fallbackMessage(
        "No Products available at the moment" || fetchProducts.message
      );
    }
  } catch (error) {
    console.error("Error while fetching products:", error);
    section.innerHTML = fallbackMessage(
      "Something went wrong. Please try again later.</"
    );
  }
}

// Initializes the homepage by rendering products for specific sections
export function initializeHomePage() {
  if (document.getElementById("arrival-container")) {
    renderProducts("arrival-container", "new-arrivals");
  }
  if (document.getElementById("menswear-container")) {
    renderProducts("menswear-container", "men");
  }
  if (document.getElementById("womenwear-container")) {
    renderProducts("womenwear-container", "women");
  }
}
