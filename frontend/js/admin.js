// =========================
// ADMIN MACHE LAKAY JS
// =========================


// 🔁 NAVIGATION ENTRE PAGES
function goTo(page) {

    switch (page) {

        case "users":
            window.location.href = "users.html";
            break;

        case "shops":
            window.location.href = "shops.html";
            break;

        case "products":
            window.location.href = "products.html";
            break;

        case "orders":
            window.location.href = "orders.html";
            break;

        default:
            alert("Paj sa pa egziste");
    }
}


// =========================
// SIMULATION DATA (pou kounyea)
// =========================

let users = [
    { id: 1, name: "Jean", role: "client" },
    { id: 2, name: "Marie", role: "seller" },
    { id: 3, name: "Kensley", role: "client" }
];

let shops = [
    { id: 1, name: "Boutik A" },
    { id: 2, name: "Boutik B" }
];

let products = [
    { id: 1, name: "Telefòn", status: "pending" },
    { id: 2, name: "Soulye", status: "approved" }
];

let orders = [
    { id: 1, total: 120, status: "pending" },
    { id: 2, total: 300, status: "delivered" }
];


// =========================
// DASHBOARD UPDATE
// =========================

function updateDashboard() {

    console.log("===== DASHBOARD =====");
    console.log("Users:", users.length);
    console.log("Shops:", shops.length);
    console.log("Products:", products.length);
    console.log("Orders:", orders.length);
}


// =========================
// ACTIONS ADMIN (future use)
// =========================

function deleteUser(id) {
    users = users.filter(u => u.id !== id);
    console.log("User delete:", id);
    updateDashboard();
}

function approveProduct(id) {
    let product = products.find(p => p.id === id);

    if (product) {
        product.status = "approved";
        console.log("Product approved:", id);
    }
}


// =========================
// INIT SYSTEM
// =========================

document.addEventListener("DOMContentLoaded", function () {
    updateDashboard();
});