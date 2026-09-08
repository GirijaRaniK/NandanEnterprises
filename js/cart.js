/* =========================================================
   Nandan Enterprises - USER SPECIFIC SHOPPING CART
   ========================================================= */

const CART_STORAGE_PREFIX = "nandan_cart_user_";

/* =========================================================
   GET LOGGED-IN USER
   ========================================================= */

function getLoggedInUser() {
  try {
    const userData = localStorage.getItem("user");

    if (!userData) {
      return null;
    }

    const user = JSON.parse(userData);

    if (!user || !user.id) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Unable to read logged-in user:", error);
    return null;
  }
}

/* =========================================================
   GET USER CART STORAGE KEY
   ========================================================= */

function getCartStorageKey() {
  const user = getLoggedInUser();

  if (!user) {
    return null;
  }

  return CART_STORAGE_PREFIX + user.id;
}

/* =========================================================
   CHECK LOGIN
   ========================================================= */

function isUserLoggedIn() {
  const user = getLoggedInUser();

  return !!user;
}

/* =========================================================
   GET CART
   ========================================================= */

function getCart() {
  try {
    const storageKey = getCartStorageKey();

    if (!storageKey) {
      return [];
    }

    const cart = localStorage.getItem(storageKey);

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
  const storageKey = getCartStorageKey();

  if (!storageKey) {
    console.warn("User is not logged in. Cart was not saved.");
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(cart));

  updateCartCount();
}

/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(productId, productName, price, quantity = 1) {
  /* ---------------------------------------------------------
     LOGIN CHECK
  --------------------------------------------------------- */

  if (!isUserLoggedIn()) {
    alert("Please login to add products to your cart.");
    window.location.href = "login.html";
    return;
  }

  price = Number(price);
  quantity = Number(quantity);

  /* ---------------------------------------------------------
     VALIDATION
  --------------------------------------------------------- */

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

  /* ---------------------------------------------------------
     GET CURRENT USER'S CART
  --------------------------------------------------------- */

  const cart = getCart();

  /* ---------------------------------------------------------
     CHECK EXISTING PRODUCT
  --------------------------------------------------------- */

  const existingProduct = cart.find(function (item) {
    return String(item.id) === String(productId);
  });

  if (existingProduct) {
    existingProduct.quantity = Number(existingProduct.quantity) + quantity;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: price,
      quantity: quantity,
    });
  }

  /* ---------------------------------------------------------
     SAVE
  --------------------------------------------------------- */

  saveCart(cart);

  alert(productName + " added to cart.");

  updateCartCount();
}

/* =========================================================
   UPDATE QUANTITY
   ========================================================= */

function updateCartQuantity(productId, quantity) {
  if (!isUserLoggedIn()) {
    return;
  }

  quantity = Number(quantity);

  if (!Number.isFinite(quantity) || quantity < 1) {
    quantity = 1;
  }

  const cart = getCart();

  const product = cart.find(function (item) {
    return String(item.id) === String(productId);
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
  if (!isUserLoggedIn()) {
    return;
  }

  const cart = getCart();

  const product = cart.find(function (item) {
    return String(item.id) === String(productId);
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
  if (!isUserLoggedIn()) {
    return;
  }

  const cart = getCart();

  const product = cart.find(function (item) {
    return String(item.id) === String(productId);
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
  if (!isUserLoggedIn()) {
    return;
  }

  let cart = getCart();

  cart = cart.filter(function (item) {
    return String(item.id) !== String(productId);
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
  const storageKey = getCartStorageKey();

  if (!storageKey) {
    return;
  }

  localStorage.removeItem(storageKey);

  updateCartCount();

  if (typeof renderCart === "function") {
    renderCart();
  }
}

/* =========================================================
   CART ITEM COUNT
   ========================================================= */

function getCartItemCount() {
  if (!isUserLoggedIn()) {
    return 0;
  }

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
  if (!isUserLoggedIn()) {
    return 0;
  }

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
