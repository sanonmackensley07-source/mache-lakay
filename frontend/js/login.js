const BASE_URL = typeof API !== 'undefined' ? API : "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                // Voye demand koneksyon an bay API backend la
                const response = await fetch(`${BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Email oswa Modpas pa kòrèk.");
                }

                // 🎉 Koneksyon reyalize! Sove enfòmasyon sesyon yo
                localStorage.setItem("token", data.token);
                localStorage.setItem("userRole", data.role);
                localStorage.setItem("userName", data.name);
                if (data.userId) localStorage.setItem("userId", data.userId);

                alert(`Bonjou ${data.name}! Koneksyon an reyisi 🎉`);

                // LOJIK REDIREKSYON SELON KALITE MOUN LAN
                if (data.role === "seller") {
                    // Si se yon vandè, nou voye l sou paj kòmand oswa dashboard li
                    window.location.href = "orders.html"; 
                } else {
                    // Si se yon kliyan, li tounen sou shop la pou l kontinye achte
                    window.location.href = "shop.html";
                }

            } catch (error) {
                console.error("Erè koneksyon:", error);
                alert("❌ Erè: " + error.message);
            }
        });
    }
});
