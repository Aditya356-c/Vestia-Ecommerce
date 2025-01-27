// ========= MAIN ENTRY POINT FOR THE APP =============
import { handleRegisterDialog } from "./components/dialogModule.js";
import { loadUserCart } from "./modules/CartModule.js";
import { initializeHomePage } from "./modules/HomePageModule.js";
import {
  initializeProductDetails,
  updateCartCount,
} from "./modules/ProductModule.js";
import { navigateBack } from "./modules/utility.js";

// Determines the current page based on the URL path.
function getCurrentPage() {
  const path = window.location.pathname;

  if (path === "/" || path.includes("index.html")) {
    return "home";
  } else if (path.includes("product-detail.html")) {
    return "product-details";
  } else if (path.includes("cart.html")) {
    return "cart";
  }

  return "unknown"; // Fallback for unknown paths
}

function initializeApp() {
  navigateBack();
  handleRegisterDialog();
  updateCartCount();

  const currentPage = getCurrentPage();

  switch (currentPage) {
    case "home":
      initializeHomePage();
      break;
    case "product-details":
      initializeProductDetails();
      break;
    case "cart":
      loadUserCart();
      break;
    default:
      console.warn(
        `No specific initialization defined for page: ${currentPage}`
      );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});
