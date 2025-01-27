import { calculateDiscount, fallbackImageElement } from "../modules/utility.js";

export const LoaderHTML = `<div class="loader__container "><span class="loader"></span></div>`;

export function fallbackMessage(message) {
  return `<div class="loader__container">
      <p class="container__message">${message}</p>
    </div>`;
}

/**
 * Generates a product card as an HTML string.
 *   productId      {string}  -  Unique ID of the product.
 *   discount       {boolean} -  Indicates if the product is on sale.
 *   productImage   {string}  -  URL of the product image.
 *   productName    {string}  -  Name of the product.
 *   category       {string}  -  Category of the product.
 *   discountPrice  {number}  -  Sale price of the product.
 *   price          {number}  -  Original price of the product.
 */

export function productCardHTML(
  productId,
  discount = false,
  productImage,
  productName = "unKnown",
  category = "unKnown",
  discountPrice = 0,
  price = 0
) {
  return `
  <div class="product__card" data-discount="${discount}">
  <!-- Image , Name & Category -->
  <a
    href="product-detail.html?productId=${productId}"
    class="product_detail-link"
  >
    <div class="product_image-holder">
     ${fallbackImageElement(productImage, productName)}
    </div>
    <!-- Name & Category -->
    <div class="product__meta">
      <h6 class="product__name">
        ${productName}
      </h6>
      <span class="product__category">${category}</span>
    </div>
  </a>
  <!--  Price , Discount Price , Discount Percentage -->
  <div class="product__data">
    <!-- Price & Discount Price -->
    <div class="product__value">
      <span class="product_discount-price">$${discountPrice}</span>
      <span class="product__price">$${price}</span>
    </div>
    <span class="product_discount-percent">-${calculateDiscount(
      price,
      discountPrice
    )}%</span>
  </div>
</div>
`;
}

/**
 * Generates the HTML structure for the product details section.
 *  productId           {string}   -  Unique identifier for the product.
 *  discount            {boolean}  -  Indicates if the product is on sale.
 *  productImage        {string}   -  Image URL of the product.
 *  productName         {string}   -  Name of the product.
 *  productDescription  {string}   -  Description of the product.
 *  productsSizes       {Array}    -  List of available sizes for the product.
 *  discountPrice       {number}   -  Sale price of the product.
 *  price               {number}   -  Regular price of the product.
 *  availableStock      {number}   -  Available stock for the product.
 */

export function productDetailHTML(
  productId,
  discount = false,
  productImage,
  productName = "unKnown",
  productDescription = "No description available.",
  productsSizes = [],
  discountPrice = 0,
  price = 0,
  availableStock = 0
) {
  return `
  <div class="product_detail-card" data-discount="${discount}">
<!-- Product Image -->
<div class="product_detail-image">
${fallbackImageElement(productImage, productName)}
</div>
<!-- Product Details -->
<div class="product_detail-data">
  <!-- Name , Discount Price , Price , Description & Discount Percent -->
  <div class="product_detail-summary">
    <h2 class="product_detail-name">
    ${productName}
    </h2>
    <!--  Discount Price , Price & Discount Percent  -->
    <div class="product_detail-value">
      <!--  Discount Price & Price  -->
      <div class="detail_buy-value">
        <span class="product_detail-discount">  $${discountPrice}</span>
        <span class="product_detail-price">$${price}</span>
      </div>
      <span class="product_detail-dispercent">-${calculateDiscount(
        price,
        discountPrice
      )}%</span>
    </div>
    <p class="product_detail-description">
    ${productDescription}
    </p>
  </div>
  <!-- Choose Size -->
  <hr />
  <div class="product_choose-size">
    <h6>Choose Size</h6>
    <div class="product__sizes">

    ${productsSizes
      .map(
        (size, index) =>
          `  <div>
          <input
            type="radio"
            title="size"
            name="size"
            class="radio__input"
            value="${size}"
            id="${size}"
            ${index === 0 ? "checked" : ""}
          />
          <label for="${size}" class="radio__label">
          ${size}
          </label>
        </div>`
      )
      .join("")}
    </div>
  </div>
  <hr />
  <!-- Quantity & Add to cart btn -->
  ${
    availableStock >= 1
      ? `
  <div class="product_detail-actions">
    <!-- Increase & Decrease Quantity -->
    <div class="product__quantity">
      <!-- Decrease Quantity Btn -->
      <button class="decrease__qty" id="decrease-qty">
        <i class="ri-subtract-line"></i>
      </button>

      <input
        type="text"
        class="product_qty-input"
        id="qty-input"
        value="1"
        min="1"
        max="${availableStock}"
        readonly
      />
      <button class="increase__qty" id="increase-qty">
        <i class="ri-add-line"></i>
      </button>

      <span class="product__instock">stock:${availableStock}</span>
    </div>
    <button
      class="product_add-cart primary__btn"
      id="add-to-cart-btn"
      onclick="handleAddToCart('${productId}')"
    >
      Add to Cart
    </button>
  </div>`
      : `
  <div class="product__outofstock">Out of stock</div>`
  }
</div>
</div>
`;
}

/**
 * Generates the HTML structure for displaying an individual order item in the cart.
 *  productId               {string}  -  Unique identifier for the product.
 *  discount                {boolean} -  Whether the item is on sale.
 *  productImage            {string}  -  Image URL of the product.
 *  productName             {string}  -  Name of the product.
 *  category                {string}  -  Category of the product.
 *  discountPrice           {number}  -  Sale price of the product.
 *  price                   {number}  -  Regular price of the product.
 *  productSelectedQty      {number}  -  Quantity of the product in the cart.
 *  productSelectedSize     {string}  -  Selected size of the product.
 */

export function orderItemHTML(
  productId,
  discount = false,
  productImage,
  productName = "unKnown",
  category = "unKnown",
  discountPrice = 0,
  price = 0,
  productSelectedSize,
  productSelectedQty
) {
  return `
  <div class="order__item" data-discount="${discount}">
<!-- Item image -->
<div class="order_item-image">
${fallbackImageElement(productImage, productName)}
</div>
<!-- Item Details -->
<div class="order_item-data">
  <!-- Name , Remove Btn , Size & Category -->
  <div class="order_item-summary">
    <!-- Name & Remove Btn -->
    <div class="order_item-meta">
      <h3 class="order_item-name">
      ${productName}
      </h3>
      <button class="order_item-remove" id="order-remove"
      onclick="handleRemoveCartItem('${productId}')">
        <i class="ri-delete-bin-line"></i>
      </button>
    </div>
    <!-- Size & Category -->
    <p class="order_item-size">size: ${productSelectedSize}</p>
    <p class="order_item-category">${category}</p>
  </div>
  <!-- Discount Price , Price & Quantity -->
  <div class="order_item-purchase">
    <!-- Discount Price & Price -->
    <div class="order_item-value">
      <span class="order_item-disPrice">$${discountPrice}</span>
      <span class="order_item-price">$${price}</span>
    </div>
    <span class="order_item-quantity">Qty: ${productSelectedQty}</span>
  </div>
</div>
</div>
  `;
}
