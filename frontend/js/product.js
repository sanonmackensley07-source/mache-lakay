/* =======================================================
   MACHE LAKAY - PRODUCTS JS (VERSION SELLER DROITS COMPLÈTE)
======================================================= */

// Si API pa deklare nan HTML la, l ap pran pò 5000 pa defo
const BASE_URL = typeof API !== 'undefined' ? API : "http://localhost:5000/api";

/* =====================================
   PRODUCTS STORAGE & STATE
===================================== */
let allProducts = [];
let currentList = [];

/* =====================================
   1. CHARGE PWODWI DEPIS NAN MONGODB ATLAS
===================================== */
async function loadProducts() {
    try {
        // Rele backend lan pou pran pwodwi yo nan MongoDB
        const response = await fetch(`${BASE_URL}/products`);
        if (!response.ok) throw new Error("Erè koneksyon rezo");
        
        allProducts = await response.json();
        
        // Si baz done a konekte men li vid, n ap mete fo done sa yo pou tès vizyèl
        if (!allProducts || allProducts.length === 0) {
            throw new Error("Baz done a vid");
        }
    } catch (error) {
        console.log("⚠️ N ap itilize fo pwodwi pou tès kòm API a vid oswa offline:", error.message);
        allProducts = [
            { id: 1, name: "iPhone 13", category: "telefòn", price: 450, vande: "Tech Lakay Store", desc: "Bon telefòn Apple" },
            { id: 2, name: "Samsung A24", category: "telefòn", price: 220, vande: "Mobile Store", desc: "Samsung nouvo" },
            { id: 3, name: "HP Laptop", category: "laptop", price: 600, vande: "Tech Lakay Store", desc: "Laptop pou travay" },
            { id: 4, name: "Dell PC", category: "laptop", price: 550, vande: "Mackensley", desc: "Òdinatè biwo" },
            { id: 5, name: "PS5 Console", category: "gaming", price: 650, vande: "Gaming Center", desc: "Panyen jwèt" },
            { id: 6, name: "Samsung TV", category: "tv", price: 500, vande: "Lakay Deco", desc: "Smart TV 50 inch" },
            { id: 7, name: "Headphones", category: "audio", price: 80, vande: "Tech Lakay Store", desc: "Bèl kask" },
            { id: 8, name: "Nike Shoes", category: "soulye", price: 80, vande: "Fashion Haiti", desc: "Tenis orijinal" }
        ];
    }

    // LOJIK ENTÈLIJAN: Tcheke si se yon Vandè k ap gade pwòp boutik pa l
    const urlParams = new URLSearchParams(window.location.search);
    const vandeFilter = urlParams.get('vande');

    if (vandeFilter) {
        console.log("Mòd Boutik Vandè: Filtre pwodwi pou " + vandeFilter);
        // Filtre pou n pran sèlman pwodwi ki gen non vandè sa a
        currentList = allProducts.filter(p => p.vande && p.vande.toLowerCase() === vandeFilter.toLowerCase());
        
        // Chanje tit la otomatikman nan paj la pou l di "Boutik mwen"
        const titShop = document.querySelector("main h2");
        if (titShop) titShop.innerText = `Boutik mwen: ${vandeFilter} 🏪`;
    } else {
        // Si se yon kliyan nòmal, li wè tout pwodwi nèt
        currentList = [...allProducts];
    }

    renderProducts(currentList);
}

/* =====================================
   2. AFICHE PWODWI YO ANNDAN HTML
===================================== */
function renderProducts(list) {
    const container = document.getElementById("products-container");
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `<p style="padding:20px; font-weight:bold;">Pa gen pwodwi ki disponib pou kounye a 😕</p>`;
        return;
    }

    container.innerHTML = list.map(p => {
        const productId = p._id || p.id;
        const fallbackImage = p.image || "assets/laptop.jpg"; // Si pa gen foto, li mete yon foto pa defo
        return `
            <div class="product-card" style="background: white; padding: 15px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: center;">
                <div style="height: 150px; background: #f0f0f0; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; font-size: 40px;">
                    📦
                </div>
                <h3 style="margin: 5px 0; font-size: 18px; color: #333;">${p.name}</h3>
                <p style="margin: 5px 0; font-size: 13px; color: #777;">🏪 Vandè: <b>${p.vande || 'Mache Lakay'}</b></p>
                <p style="margin: 5px 0; color: #2196f3; font-weight: bold; font-size: 16px;">$${p.price}</p>
                <button onclick="addToCart(null, ${JSON.stringify(p).replace(/"/g, '&quot;')})" style="width: 100%; padding: 8px; background: #4caf50; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top: 5px;">Ajoute nan panier</button>
            </div>
        `;
    }).join("");
}

/* =====================================
   3. FILTRE PA KATEGORI (MAPPING OTO)
===================================== */
function filterCategory(category) {
    if (!category || category === "all") {
        currentList = [...allProducts];
    } else {
        currentList = allProducts.filter(p => 
            p.category && p.category.toLowerCase() === category.toLowerCase()
        );
    }
    renderProducts(currentList);
}

/* =====================================
   4. SISTÈM RECHÈCH (SEARCH BAR)
===================================== */
function searchProducts(value = "") {
    const v = value.toLowerCase();

    currentList = allProducts.filter(p =>
        (p.name && p.name.toLowerCase().includes(v)) ||
        (p.category && p.category.toLowerCase().includes(v)) ||
        (p.vande && p.vande.toLowerCase().includes(v))
    );

    renderProducts(currentList);
}

/* =====================================
   5. DEKLANCHE LOJIK YO SOU LOAD
===================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Chaje tout pwodwi yo depi nan MongoDB
    loadProducts();

    // KONEKTE BOUTON KATEGORI YO (Pou paj index.html la)
    document.querySelectorAll(".category-grid button").forEach(btn => {
        btn.addEventListener("click", () => {
            let text = btn.textContent
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Retire aksan
                .replace(/[^a-z0-9 ]/g, "")
                .trim();

            /* Lojik rapid Mapping Kategori */
            if (text.includes("telefon") || text.includes("table")) filterCategory("telefòn");
            else if (text.includes("odinate") || text.includes("laptop")) filterCategory("laptop");
            else if (text.includes("desktop")) filterCategory("desktop");
            else if (text.includes("gaming")) filterCategory("gaming");
            else if (text.includes("tv")) filterCategory("tv");
            else if (text.includes("audio")) filterCategory("audio");
            else if (text.includes("kamera")) filterCategory("kamera");
            else if (text.includes("mont") || text.includes("smart")) filterCategory("mont");
            else if (text.includes("soulye")) filterCategory("soulye");
            else if (text.includes("bote") || text.includes("kosmetik")) filterCategory("bote");
            else if (text.includes("kwizin")) filterCategory("kwizin");
            else if (text.includes("espo") || text.includes("fitness")) filterCategory("espo");
            else if (text.includes("pwason") || text.includes("vyann")) filterCategory("pwason");
            else filterCategory("all");
        });
    });

    // KONEKTE INPUT BANYÈ RECHÈCH LA
    const searchInput = document.querySelector(".search input") || document.getElementById("shop-search-input");
    const searchBtn = document.querySelector(".search button") || document.getElementById("shop-search-btn");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => searchProducts(e.target.value));
    }
    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => searchProducts(searchInput.value));
    }
});
