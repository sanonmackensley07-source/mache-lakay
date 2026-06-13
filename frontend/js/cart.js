// Si API pa deklare nan HTML la, l ap pran pò 5000 pa defo
const BASE_URL = typeof API !== 'undefined' ? API : "http://localhost:5000/api";

/* =====================================
   1. AJOUTE PWODWI NAN PANYEN (BACKEND & LOCAL)
===================================== */
async function addToCart(userId, product) {
    try {
        // 1. Voye l bay MongoDB si gen yon userId (itilizatè a konekte)
        if (userId) {
            const response = await fetch(`${BASE_URL}/cart/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, product })
            });
            if (!response.ok) throw new Error("Erè nan sèvè a");
        }

        // 2. Toujou sove l nan localStorage la tou pou sekirite lokal
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        // Tcheke si pwodwi a deja nan panyen an pou n jis ogmante kantite a
        const productId = product._id || product.id;
        const existingProduct = cart.find(item => (item._id === productId || item.id === productId));

        if (existingProduct) {
            existingProduct.quantity = (existingProduct.quantity || 1) + 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Pwodwi ajoute nan panyen ✔");
        
        // Si nou sou paj cart.html la, rafrechi lis la otomatikman
        if (typeof renderCart === "function") renderCart();

    } catch (error) {
        console.error("Erè ajoute nan panyen:", error);
        alert("Sistèm nan gen yon ti pwoblèm, men nou ajoute l lokalman.");
    }
}

/* =====================================
   2. AFICHE PWODWI NAN PAJ PANYEN AN (cart.html)
===================================== */
function renderCart() {
    const container = document.getElementById("cart-container");
    const totalContainer = document.getElementById("cart-total");
    if (!container) return; // Si nou pa sou paj cart.html la, nou kanpe la

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        container.innerHTML = `<p style="padding:20px; text-align:center;">Panyen ou vid 🛒</p>`;
        if (totalContainer) totalContainer.innerText = "$0.00";
        return;
    }

    let total = 0;

    container.innerHTML = cart.map((p, index) => {
        const qty = p.quantity || 1;
        const price = p.price || 0;
        total += price * qty;
        const productId = p._id || p.id;

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${p.name}</h3>
                    <p>Pri: <b>$${price}</b> x ${qty}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-delete" onclick="removeFromCart('${productId}')">Retire</button>
                </div>
            </div>
        `;
    }).join("");

    if (totalContainer) {
        totalContainer.innerText = `$${total.toFixed(2)}`;
    }
}

/* =====================================
   3. RETIRE YON PWODWI NAN PANYEN AN
===================================== */
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Filtre pou retire pwodwi ki gen ID sa a
    cart = cart.filter(item => item._id !== id && item.id !== id);
    
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Rafrechi afichaj panyen an tou swit
    renderCart();
}

/* =====================================
   4. DEKLANCHE AFICHAJ LA LÈ PAJ LA LOUVRI
===================================== */
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});
