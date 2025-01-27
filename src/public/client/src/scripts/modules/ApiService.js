/**
 * Base API URL (Replace with your actual API base URL)
 */
const BASE_URL = "<YOUR-SERVER-URL>/api/v1/";

/**
 * Handle API requests
 * endpoint   {string}           -  API endpoint
 * method     {string}           -  HTTP method (GET, POST, DELETE)
 * body       {object}           -  Request body (for POST, PUT requests)
 * Returns    {Promise<object>}  -  Parsed JSON response
 */

async function apiRequest(endpoint, method = "GET", body = null) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`Http error ! status : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
}

export function RegisterUser(email) {
  return apiRequest("user/register", "POST", { email });
}

/**
 * Fetch all products by category
 * category  {string}           -    The product category to fetch ( "mens-wear", "women-wear" , "new-arrivals").
 * Returns   {Promise<Array>}   -    List of all products
 */

export function GetProductsByCategory(category) {
  return apiRequest(`products/product-category/${category}`, "GET");
}

export function ProductDetail(productId) {
  return apiRequest(`products/product-detail/${productId}`, "GET");
}

export function CartDetails(userId) {
  return apiRequest("cart", "POST", { userId });
}

export function AddToCart({ userId, productId, selectedSize, quantity }) {
  return apiRequest("cart/add", "POST", {
    userId,
    productId,
    selectedSize,
    quantity,
  });
}

export function RemoveProduct({ userId, productId }) {
  return apiRequest("cart/remove", "DELETE", { userId, productId });
}
