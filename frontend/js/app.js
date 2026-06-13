/* =========================
   MACHE LAKAY - APP JS FINAL
========================= */

// Si API pa deklare nan HTML la, l ap pran pò 5000 pa defo
const BASE_URL = typeof API !== 'undefined' ? API : "http://localhost:5000/api";

/* === PRODUCTS STORAGE === */
let products = [];

/* === CART SYSTEM === */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id) {
    // Tcheke si se yon ID fòm chif oswa string (MongoDB itilize String _id)
    const product = products.find(p => p.id === id || p._id === id);
    if (!product) return;
    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Pwodwi ajoute nan panier ✔");
}

/* === FETCH PRODUCTS FROM MONGODB === */
async function loadProducts() {
    try {
        // Rele backend lan pou pran pwodwi yo nan MongoDB
        const response = await fetch(`${BASE_URL}/products`);
        if (!response.ok) throw new Error("Erè rezo");
        products = await response.json();
    } catch (error) {
        console.log("⚠️ Sèvè a pa voye done, n ap itilize fo pwodwi pou tès:", error.message);
        // Si backend lan poko gen pwodwi, nou mete fo done sa yo pou tès
        products = [
            { id: 1, name: "iPhone 13", category: "telefòn", price: 450, image: "assets/iphone.jpg", desc: "Bon telefòn Apple" },
            { id: 2, name: "Samsung TV", category: "tv", price: 600, image: "assets/tv.jpg", desc: "Smart TV 50 inch" },
            { id: 3, name: "Gaming Laptop", category: "laptop", price: 900, image: "assets/laptop.jpg", desc: "Laptop pou gaming" },
            { id: 4, name: "Headphones", category: "audio", price: 80, image: "assets/headphones.jpg", desc: "Audio pwofesyonèl" },
            { id: 5, name: "T-Shirt Gason", category: "rad gason", price: 25, image: "assets/tshirt.jpg", desc: "Rad Gason" },
            { id: 6, name: "Bijou Fanm", category: "bijou", price: 50, image: "assets/bijou.jpg", desc: "Bijou pou fanm" },
            { id: 7, name: "Pwason fre", category: "pwason", price: 10, image: "assets/fish.jpg", desc: "Pwason fre chak jou" }
        ];
    }
    renderProducts(products);
}

/* === RENDER PRODUCTS === */
function renderProducts(list) {
    const container = document.getElementById("products-container");
    if (!container) return;
    container.innerHTML = "";
    
    if (list.length === 0) {
        container.innerHTML = "<p>Pa gen pwodwi ki disponib pou kounye a.</p>";
        return;
    }

    list.forEach(p => {
        // MongoDB bay _id, fo done yo gen id
        const productId = p._id || p.id; 
        container.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.desc}</p>
                    <p><b>$${p.price}</b></p>
                    <button onclick="addToCart('${productId}')">Ajoute nan panier</button>
                </div>
            </div>
        `;
    });
}

/* === SHOW ALL OR CATEGORY === */
function showAll() { renderProducts(products); }

function showCategory(cat) {
    const filtered = products.filter(p => p.category && p.category.toLowerCase() === cat.toLowerCase());
    renderProducts(filtered);
}

/* === CATEGORY MAP === */
const categoryMap = {
    "telefòn & tablèt": "telefòn",
    "òdinatè & laptop": "laptop",
    "desktop pc": "laptop",
    "gaming": "laptop",
    "tv & elektwonik": "tv",
    "audio": "audio",
    "kamera": "kamera",
    "smart watch": "smartwatch",
    "rad gason": "rad gason",
    "rad fanm": "rad fanm",
    "rad timoun": "rad timoun",
    "soulye": "soulye",
    "sak & valiz": "sak & valiz",
    "bijou": "bijou",
    "linèt": "linèt",
    "mont": "mont",
    "bote & kosmetik": "bote",
    "swen kò": "swen kò",
    "famasi": "famasi",
    "sante": "sante",
    "kay & mèb": "kay",
    "chanm": "chanm",
    "salon": "salon",
    "kwizin": "kwizin",
    "twalèt": "twalèt",
    "manje": "manje",
    "bwason": "bwason",
    "fwi & legim": "fwi & legim",
    "vyann": "vyann",
    "pwason": "pwason",
    "machin": "machin",
    "moto": "moto",
    "bisiklèt": "bisiklèt",
    "pyès machin": "pyès machin",
    "konstriksyon": "konstriksyon",
    "zouti": "zouti",
    "elektrisite": "elektrisite",
    "plonbri": "plonbri",
    "jaden": "jaden",
    "agrikilti": "agrikilti",
    "elvaj": "elvaj",
    "bèt lakay": "bèt lakay",
    "espò": "espò",
    "fitness": "fitness",
    "baskètbòl": "baskètbòl",
    "lapèch": "lapèch",
    "liv": "liv",
    "lekòl": "lekòl",
    "atizay": "atizay",
    "mizik": "mizik",
    "kado": "kado",
    "evènman": "evènman",
    "otèl": "otèl",
    "vwayaj": "vwayaj",
    "biznis": "biznis",
    "sèvis dijital": "sèvis dijital",
    "freelance": "freelance",
    "enpresyon": "enpresyon",
    "lòt kategori": ""
};

/* === CONNECT CATEGORY BUTTONS === */
document.addEventListener("DOMContentLoaded", () => {
    loadProducts(); // chaje pwodwi yo depi nan MongoDB lè paj la louvri

    const buttons = document.querySelectorAll(".category-grid button");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Retire ikòn emoji yo nan tèks bouton an pou konpare l ak map la
            const text = btn.innerText.toLowerCase().replace(/[^a-z0-9& ]/gi,"").trim();
            const cat = categoryMap[text];
            if (cat === undefined || cat === "") showAll();
            else showCategory(cat);
        });
    });

    /* === SEARCH BAR === */
    const searchBtn = document.querySelector(".search button");
    const searchInput = document.querySelector(".search input");
    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            const val = searchInput.value.toLowerCase();
            const filtered = products.filter(p => p.name && p.name.toLowerCase().includes(val));
            renderProducts(filtered);
        });
    }
});
