// =======================
// SHOP SYSTEM - MACHE LAKAY
// =======================


// 🔥 SIMULATION PRODUITS
let products = [
    {
        id: 1,
        name: "Telefòn Samsung",
        price: 150,
        category: "Telefòn",
        image: "assets/images/products/product.png"
    },
    {
        id: 2,
        name: "Laptop HP",
        price: 500,
        category: "Òdinatè",
        image: "assets/images/products/product.png"
    },
    {
        id: 3,
        name: "T-Shirt",
        price: 20,
        category: "Rad",
        image: "assets/images/products/product.png"
    }
];


// 🔥 CART (pou add to cart)
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// =======================
// AFFICHER PRODUITS
// =======================
function displayProducts(list) {

    let container = document.getElementById("products-container");
    container.innerHTML = "";

    list.forEach(product => {

        let div = document.createElement("div");
        div.classList.add("product-card");

        div.innerHTML = `
            <img src="${product.image}" onclick="viewProduct(${product.id})">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Ajoute 🛒</button>
        `;

        container.appendChild(div);
    });
}


// =======================
// ADD TO CART
// =======================
function addToCart(id) {

    let product = products.find(p => p.id === id);

    let existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Ajoute nan panier ✔");
}


// =======================
// VIEW PRODUCT
// =======================
function viewProduct(id) {

    window.location.href = "product.html?id=" + id;
}


// =======================
// FILTER CATEGORY
// =======================
function filterCategory(category) {

    if (category === "Tout") {
        displayProducts(products);
    } else {
        let filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
}


// =======================
// SEARCH
// =======================
document.querySelector(".search button").addEventListener("click", function () {

    let value = document.querySelector(".search input").value.toLowerCase();

    let filtered = products.filter(p =>
        p.name.toLowerCase().includes(value)
    );

    displayProducts(filtered);
});


// =======================
// CATEGORY BUTTONS
// =======================
document.querySelectorAll(".categories button").forEach(btn => {

    btn.addEventListener("click", function () {
        filterCategory(this.innerText);
    });
});


// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", function () {
    displayProducts(products);
});