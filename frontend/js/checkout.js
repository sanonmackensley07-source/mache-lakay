const BASE_URL = typeof API !== 'undefined' ? API : "http://localhost:5000/api";

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let totalGlobal = 0;

/* =====================================
   1. KALKILE EPI AFICHE REZIME KÒMAND LAN
===================================== */
function renderCheckoutSummary() {
    const totalContainer = document.getElementById("checkout-total");
    if (!totalContainer) return;

    if (cart.length === 0) {
        alert("Panyen ou vid! N ap tounen sou paj prensipal la.");
        window.location.href = "index.html";
        return;
    }

    // Kalkile total tout pwodwi ki nan panyen an
    totalGlobal = cart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
    totalContainer.innerText = `$${totalGlobal.toFixed(2)}`;
}

/* =====================================
   2. JERE KLIKE SOU BOUTON "KONFIME" (SUBMIT)
===================================== */
document.getElementById("checkout-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("customer-name").value;
    const address = document.getElementById("customer-address").value;
    const phone = document.getElementById("customer-phone").value;
    const method = document.getElementById("payment-method").value;

    // Prepare tout enfòmasyon kòmand lan
    const orderData = {
        customer: { name, address, phone },
        items: cart,
        total: totalGlobal,
        paymentMethod: method,
        orderId: "ML-" + Math.floor(100000 + Math.random() * 900000)
    };

    // --- LOGIQUE REDIREKSYON MULTI-PLATEFORME KORIDJE ---
    if (method === "moncash") {
        alert("N ap redirije w sou paj detay MonCash la...");
        window.location.href = `moncash-payment.html?type=checkout&total=${totalGlobal}`;
    } 
    else if (method === "natcash") {
        alert("N ap redirije w sou paj detay NatCash la...");
        window.location.href = `natcash-payment.html?type=checkout&total=${totalGlobal}`;
    } 
    else if (method === "wise") {
        alert("N ap redirije w sou paj detay Wise la pou Dyaspora...");
        window.location.href = `wise-payment.html?type=checkout&total=${totalGlobal}`;
    }
    else if (method === "bank_haiti") {
        alert("N ap redirije w sou paj detay Transfè Bankè an Ayiti...");
        window.location.href = `bank-payment.html?type=checkout&total=${totalGlobal}`;
    }
    else if (method === "stripe") {
        alert("N ap konekte w ak Stripe pou Peman Kat Kredi (Dyaspora)...");
        jenereResiHtml(orderData);
    }
    else if (method === "cod") {
        alert("Kòmand ou anrejistre avèk siksè! W ap peye kòb lan an kach lè n ap livre w pwodwi a.");
        jenereResiHtml(orderData);
    }
});

/* =====================================
   3. JENERE AK TELECHAJE RESI PDF LA
===================================== */
function jenereResiHtml(order) {
    document.getElementById("checkout-form").style.display = "none";
    document.querySelector("h1").innerText = "Mèsi pou Achte ou! 🎉";

    const summaryBox = document.getElementById("checkout-summary");
    
    const resiHtml = `
        <div id="invoice-receipt" style="background: white; padding: 25px; border: 1px solid #eee; font-family: Arial, sans-serif; color: #333; margin-top:10px;">
            <div style="text-align: center; border-bottom: 2px solid #2196f3; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #2196f3; letter-spacing:1px;">MACHE LAKAY</h2>
                <p style="margin: 5px 0; font-size: 13px; color:#666;">Marketplace Pwochen Jenerasyon Ayiti</p>
                <p style="margin: 10px 0 0 0; font-weight: bold; background:#e3f2fd; display:inline-block; padding:3px 10px; border-radius:4px;">Kòmand N°: ${order.orderId}</p>
            </div>
            
            <div style="margin-bottom: 20px; font-size: 14px; line-height: 1.5;">
                <p><b>Kliyan:</b> ${order.customer.name}</p>
                <p><b>Adrès Livrezon:</b> ${order.customer.address}</p>
                <p><b>Telefòn:</b> ${order.customer.phone}</p>
                <p><b>Metòd Peman:</b> <span style="text-transform: uppercase; color:#2196f3; font-weight:bold;">${order.paymentMethod}</span></p>
                <p><b>Dat:</b> ${new Date().toLocaleDateString('ht-HT')}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Pwodwi</th>
                        <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Kantite</th>
                        <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Pri</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                            <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity || 1}</td>
                            <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>

            <div style="text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; border-top: 2px solid #ddd; padding-top: 10px;">
                Total Peye: <span style="color: #4caf50;">$${order.total.toFixed(2)}</span>
            </div>
        </div>
        
        <button id="btn-download-pdf" style="width: 100%; margin-top: 20px; padding: 12px; background: #2196f3; color: white; border: none; font-size: 16px; font-weight: bold; border-radius: 5px; cursor: pointer; transition: 0.3s;">
            📥 Telechaje Resi PDF Kounye a
        </button>
    `;

    summaryBox.innerHTML = resiHtml;
    localStorage.removeItem("cart");

    document.getElementById("btn-download-pdf").addEventListener("click", () => {
        const element = document.getElementById("invoice-receipt");
        const opt = {
            margin:       12,
            filename:     `Resi_MacheLakay_${order.orderId}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    });
}

document.addEventListener("DOMContentLoaded", renderCheckoutSummary);
