/* =========================================================
   Nandan Enterprises - Shopping Cart
   ========================================================= */

const CART_STORAGE_KEY = "nandan_cart";

/* =========================================================
   GET CART
   ========================================================= */

function getCart() {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);

    if (!cart) {
      return [];
    }

    const parsedCart = JSON.parse(cart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Unable to read cart:", error);

    return [];
  }
}

/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

  updateCartCount();
}

/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(productId, productName, price, quantity = 1) {
  price = Number(price);
  quantity = Number(quantity);

  if (!productId || !productName) {
    alert("Invalid product.");
    return;
  }

  if (!Number.isFinite(price) || price <= 0) {
    alert("Invalid product price.");
    return;
  }

  if (!Number.isFinite(quantity) || quantity < 1) {
    quantity = 1;
  }

  const cart = getCart();

  const existingProduct = cart.find(function (item) {
    return item.id === productId;
  });

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: price,
      quantity: quantity,
    });
  }

  saveCart(cart);

  alert(productName + " added to cart.");

  updateCartCount();
}

/* =========================================================
   UPDATE QUANTITY
   ========================================================= */

function updateCartQuantity(productId, quantity) {
  quantity = Number(quantity);

  if (!Number.isFinite(quantity) || quantity < 1) {
    quantity = 1;
  }

  const cart = getCart();

  const product = cart.find(function (item) {
    return item.id === productId;
  });

  if (!product) {
    return;
  }

  product.quantity = quantity;

  saveCart(cart);

  if (typeof renderCart === "function") {
    renderCart();
  }
}

/* =========================================================
   INCREASE QUANTITY
   ========================================================= */

function increaseCartQuantity(productId) {
  const cart = getCart();

  const product = cart.find(function (item) {
    return item.id === productId;
  });

  if (!product) {
    return;
  }

  product.quantity++;

  saveCart(cart);

  if (typeof renderCart === "function") {
    renderCart();
  }
}

/* =========================================================
   DECREASE QUANTITY
   ========================================================= */

function decreaseCartQuantity(productId) {
  const cart = getCart();

  const product = cart.find(function (item) {
    return item.id === productId;
  });

  if (!product) {
    return;
  }

  if (product.quantity > 1) {
    product.quantity--;
  }

  saveCart(cart);

  if (typeof renderCart === "function") {
    renderCart();
  }
}

/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(productId) {
  let cart = getCart();

  cart = cart.filter(function (item) {
    return item.id !== productId;
  });

  saveCart(cart);

  if (typeof renderCart === "function") {
    renderCart();
  }
}

/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);

  updateCartCount();

  if (typeof renderCart === "function") {
    renderCart();
  }
}

/* =========================================================
   CART ITEM COUNT
   ========================================================= */

function getCartItemCount() {
  const cart = getCart();

  return cart.reduce(function (total, item) {
    return total + Number(item.quantity || 0);
  }, 0);
}

/* =========================================================
   UPDATE CART COUNT
   ========================================================= */

function updateCartCount() {
  const count = getCartItemCount();

  const cartCountElements = document.querySelectorAll(".cart-count");

  cartCountElements.forEach(function (element) {
    element.textContent = count;
  });
}

/* =========================================================
   CART TOTAL
   ========================================================= */

function getCartTotal() {
  const cart = getCart();

  return cart.reduce(function (total, item) {
    return total + Number(item.price) * Number(item.quantity);
  }, 0);
}

/* =========================================================
   FORMAT CURRENCY
   ========================================================= */

function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

/* =========================================================
   INITIALIZE CART
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
});
