/* =======================================================
   MACHE LAKAY - NAVBAR LOJIK AJUSTE AK KOULÈ AMAZON TRÈ PRO
======================================================= */

document.addEventListener("DOMContentLoaded", () => {
    let accountContainer = document.querySelector(".account");
    
    if (!accountContainer) {
        const navbar = document.querySelector(".navbar");
        if (!navbar) return;
        accountContainer = document.createElement("div");
        accountContainer.className = "account";
        navbar.appendChild(accountContainer);
    }

    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userName = localStorage.getItem("userName");

    // 1. Koulè pou moun ki POTKO konekte (GUEST)
    let linksHtml = `
        <a href="index.html" style="margin-left: 20px; font-size: 15px; color: white;">Akèy</a>
        <a href="shop.html" style="margin-left: 20px; font-size: 15px; color: white;">Boutik</a>
        <a href="cart.html" style="margin-left: 20px; font-size: 15px; color: white;">🛒 Panyen</a>
        <a href="login.html" style="margin-left: 20px; font-size: 15px; color: #ff9900; font-weight: bold; border: 1px solid #ff9900; padding: 5px 12px; border-radius: 4px;">Konekte</a>
    `;

    // 2. Koulè si moun nan se yon VANDÈ ki konekte
    if (token && userRole === "seller") {
        linksHtml = `
            <span style="color: #ff9900; font-weight: bold; font-size: 15px; margin-left: 15px;">👋 ${userName}</span>
            <a href="seller.html" style="margin-left: 20px; font-size: 15px; color: #111; background: #ff9900; padding: 6px 12px; border-radius: 4px; font-weight: bold;">Dashboard Vandè 🏪</a>
            <a href="shop.html" style="margin-left: 20px; font-size: 15px; color: white;">Boutik</a>
            <a href="orders.html" style="margin-left: 20px; font-size: 15px; color: white;">Kòmand</a>
            <button id="btn-logout" style="margin-left: 20px; background: none; border: 1px solid #ff4d4d; color: #ff4d4d; padding: 5px 10px; border-radius: 4px; font-size: 14px; font-weight: bold; cursor: pointer;">Soti</button>
        `;
    }
    // 3. Koulè si moun nan se yon KLIYAN nòmal ki konekte
    else if (token) {
        linksHtml = `
            <span style="color: #ff9900; font-weight: bold; font-size: 15px; margin-left: 15px;">👋 ${userName}</span>
            <a href="index.html" style="margin-left: 20px; font-size: 15px; color: white;">Akèy</a>
            <a href="shop.html" style="margin-left: 20px; font-size: 15px; color: white;">Boutik</a>
            <a href="cart.html" style="margin-left: 20px; font-size: 15px; color: white;">🛒 Panyen</a>
            <a href="orders.html" style="margin-left: 20px; font-size: 15px; color: white;">Kòmand mwen</a>
            <button id="btn-logout" style="margin-left: 20px; background: none; border: 1px solid #ff4d4d; color: #ff4d4d; padding: 5px 10px; border-radius: 4px; font-size: 14px; font-weight: bold; cursor: pointer;">Soti</button>
        `;
    }

    accountContainer.innerHTML = linksHtml;

    // Lojik bouton Soti (Logout)
    const logoutBtn = document.getElementById("btn-logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear();
            alert("Ou dekonekte ak siksè.");
            window.location.href = "index.html";
        });
    }
});
