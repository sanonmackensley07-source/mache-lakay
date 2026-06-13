// =======================
// MACHE LAKAY - GLOBAL SCRIPT
// =======================


// =======================
// 🔐 CURRENT USER SESSION
// =======================
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("loggedUser"));
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}


// =======================
// 🚪 LOGOUT SYSTEM
// =======================
function logout() {
    localStorage.removeItem("loggedUser");
    alert("Ou dekonekte ✔");
    window.location.href = "login.html";
}


// =======================
// 🔒 PROTECT ADMIN PAGE
// =======================
function protectAdmin() {

    let user = getCurrentUser();

    if (!user || user.role !== "admin") {
        alert("Ou pa gen aksè ❌");
        window.location.href = "../login.html";
    }
}


// =======================
// 🔒 PROTECT USER LOGIN PAGE
// =======================
function requireLogin() {

    if (!isLoggedIn()) {
        alert("Ou dwe konekte ❌");
        window.location.href = "login.html";
    }
}


// =======================
// 🛒 GET CART COUNT
// =======================
function getCartCount() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    return cart.reduce((total, item) => total + item.qty, 0);
}


// =======================
// 🧭 NAV HELPER
// =======================
function goTo(page) {
    window.location.href = page;
}


// =======================
// 📦 CLEAR CART
// =======================
function clearCart() {
    localStorage.removeItem("cart");
}


// =======================
// INIT GLOBAL CHECKS
// =======================
document.addEventListener("DOMContentLoaded", function () {

    console.log("Mache Lakay system loaded ✔");

});