const BASE_URL = typeof API !== 'undefined' ? API : "http://localhost:5000/api";

async function loadOrders() {
    const container = document.getElementById("orders-container");
    if (!container) return;

    try {
        // Rele backend lan pou pran kòmand yo (nou ka pase yon userId pita si gen login)
        const response = await fetch(`${BASE_URL}/orders`);
        if (!response.ok) throw new Error("Sèvè a pa reponn");

        const orders = await response.json();
        renderOrders(orders);

    } catch (error) {
        console.log("⚠️ N ap itilize kòmand tès pou vizyèl la kòm backend lan poko gen done:", error.message);
        
        // Fo kòmand pou tès vizyèl si baz done a poko genyen
        const foOrders = [
            {
                orderId: "ML-584930",
                createdAt: new Date().toLocaleDateString('ht-HT'),
                paymentMethod: "moncash",
                total: 450,
                items: [{ name: "iPhone 13", quantity: 1, price: 450 }]
            },
            {
                orderId: "ML-102948",
                createdAt: new Date().toLocaleDateString('ht-HT'),
                paymentMethod: "cod",
                total: 110,
                items: [
                    { name: "Headphones", quantity: 1, price: 80 },
                    { name: "Football", quantity: 1, price: 30 }
                ]
            }
        ];
        renderOrders(foOrders);
    }
}

function renderOrders(list) {
    const container = document.getElementById("orders-container");
    if (list.length === 0) {
        container.innerHTML = `<p style="padding:20px; text-align:center;">Ou poko pase okenn kòmand 🛒</p>`;
        return;
    }

    container.innerHTML = list.map(order => `
        <div class="order-card" style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px; font-weight: bold;">
                <span style="color: #2196f3;">📦 Kòmand N°: ${order.orderId}</span>
                <span style="color: #666;">📅 Dat: ${order.createdAt}</span>
            </div>
            
            <div class="order-items" style="margin-bottom: 10px;">
                ${order.items.map(item => `
                    <p style="margin: 5px 0; font-size: 15px;">🔹 ${item.name} (x${item.quantity}) - <b>$${item.price}</b></p>
                `).join("")}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 10px; font-size: 15px;">
                <span>Metòd: <b style="text-transform: uppercase; color:#2196f3;">${order.paymentMethod}</b></span>
                <span style="font-size: 17px; font-weight: bold;">Total: <span style="color: #4caf50;">$${order.total.toFixed(2)}</span></span>
            </div>
        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", loadOrders);
