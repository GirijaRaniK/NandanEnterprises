/* =========================================================
Nandan Enterprises - User Specific Shopping Cart
========================================================= */

/* =========================================================
GET CURRENT USER
========================================================= */

function getCurrentUser() {
try {
const isLoggedIn =
localStorage.getItem("isLoggedIn") === "true";


const userData =
  localStorage.getItem("user");

if (!isLoggedIn || !userData) {
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
GET USER-SPECIFIC CART STORAGE KEY
========================================================= */

function getCartStorageKey() {

const user = getCurrentUser();

if (!user) {
return null;
}

return "nandan_cart_user_" + user.id;
}

/* =========================================================
GET CART
========================================================= */

function getCart() {

const cartStorageKey = getCartStorageKey();

/*
No logged-in user = no cart
*/

if (!cartStorageKey) {
return [];
}

try {


const cart =
  localStorage.getItem(cartStorageKey);

if (!cart) {
  return [];
}

const parsedCart =
  JSON.parse(cart);

return Array.isArray(parsedCart)
  ? parsedCart
  : [];


} catch (error) {


console.error(
  "Unable to read cart:",
  error
);

return [];


}
}

/* =========================================================
SAVE CART
========================================================= */

function saveCart(cart) {

const cartStorageKey =
getCartStorageKey();

/*
Do not save cart for guest users
*/

if (!cartStorageKey) {


alert(
  "Please login to add products to your cart."
);

return;


}

localStorage.setItem(
cartStorageKey,
JSON.stringify(cart)
);

updateCartCount();
}

/* =========================================================
ADD TO CART
========================================================= */

function addToCart(
productId,
productName,
price,
quantity = 1
) {

/* ---------------------------------------------------------
LOGIN CHECK
--------------------------------------------------------- */

const user = getCurrentUser();

if (!user) {


const loginNow =
  confirm(
    "Please login to add products to your cart.\n\nWould you like to login now?"
  );

if (loginNow) {
  window.location.href = "login.html";
}

return;


}

/* ---------------------------------------------------------
VALIDATE PRODUCT
--------------------------------------------------------- */

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

/* ---------------------------------------------------------
GET USER CART
--------------------------------------------------------- */

const cart = getCart();

/* ---------------------------------------------------------
CHECK EXISTING PRODUCT
--------------------------------------------------------- */

const existingProduct =
cart.find(function (item) {


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

/* ---------------------------------------------------------
SAVE USER CART
--------------------------------------------------------- */

saveCart(cart);

alert(
productName + " added to cart."
);

updateCartCount();
}

/* =========================================================
UPDATE QUANTITY
========================================================= */

function updateCartQuantity(
productId,
quantity
) {

quantity = Number(quantity);

if (
!Number.isFinite(quantity) ||
quantity < 1
) {


quantity = 1;


}

const cart = getCart();

const product =
cart.find(function (item) {


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

const product =
cart.find(function (item) {


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

const product =
cart.find(function (item) {


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
CLEAR CURRENT USER CART
========================================================= */

function clearCart() {

const cartStorageKey =
getCartStorageKey();

if (!cartStorageKey) {


return;


}

localStorage.removeItem(
cartStorageKey
);

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

return cart.reduce(
function (total, item) {


  return (
    total +
    Number(item.quantity || 0)
  );

},
0


);
}

/* =========================================================
UPDATE CART COUNT
========================================================= */

function updateCartCount() {

const count =
getCartItemCount();

const cartCountElements =
document.querySelectorAll(
".cart-count"
);

cartCountElements.forEach(
function (element) {


  element.textContent = count;

}


);
}

/* =========================================================
CART TOTAL
========================================================= */

function getCartTotal() {

const cart = getCart();

return cart.reduce(
function (total, item) {


  return (
    total +
    Number(item.price) *
    Number(item.quantity)
  );

},
0


);
}

/* =========================================================
FORMAT CURRENCY
========================================================= */

function formatCurrency(amount) {

return (
"₹" +
Number(amount).toLocaleString(
"en-IN"
)
);
}

/* =========================================================
INITIALIZE CART
========================================================= */

document.addEventListener(
"DOMContentLoaded",
function () {


updateCartCount();


}
);
