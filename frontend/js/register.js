const BASE_URL = typeof API !== 'undefined' ? API : "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
    const roleSelect = document.getElementById("role");
    const sellerInfoBox = document.getElementById("seller-info-box");
    const sellerPaymentBox = document.getElementById("seller-payment-box");
    const registerForm = document.getElementById("register-form");
    const btnSubmit = document.getElementById("btn-submit-register");

    // Tout eleman jaden vandè pou verifikasyon lojistik ak legal
    const shopName = document.getElementById("shop-name");
    const shopAddress = document.getElementById("shop-address");
    const shopPhone = document.getElementById("shop-phone");
    const shopNif = document.getElementById("shop-nif");
    const shopCin = document.getElementById("shop-cin");
    const shopDocument = document.getElementById("shop-document");
    const sellerPayoutDetails = document.getElementById("seller-payout-details");
    
    // Jwenn eleman kote yo chwazi metòd peman enskripsyon an (MonCash / NatCash / Wise / Bank)
    const regPaymentMethod = document.getElementById("registration-payment-method");

    /* =====================================
       1. MONSTRE/KACHE JADEN VANDÈ YO OTO
    ===================================== */
    roleSelect.addEventListener("change", () => {
        if (roleSelect.value === "seller") {
            sellerInfoBox.style.display = "block";
            sellerPaymentBox.style.display = "block";
            
            // Tcheke premye chwa a pou mete bon tèks ak koulè sou bouton an
            updateButtonText();
            
            // Mete tout jaden legal yo obligatwa pou Vandè a
            shopName.setAttribute("required", "true");
            shopAddress.setAttribute("required", "true");
            shopPhone.setAttribute("required", "true");
            shopNif.setAttribute("required", "true");
            shopCin.setAttribute("required", "true");
            sellerPayoutDetails.setAttribute("required", "true");
        } else {
            sellerInfoBox.style.display = "none";
            sellerPaymentBox.style.display = "none";
            btnSubmit.innerText = "Kreye Kont Gratis";
            btnSubmit.style.background = "#2196f3"; // Koulè Ble pa defo
            btnSubmit.style.color = "white";
            
            // Retire obligasyon yo si se yon senp Kliyan
            shopName.removeAttribute("required");
            shopAddress.removeAttribute("required");
            shopPhone.removeAttribute("required");
            shopNif.removeAttribute("required");
            shopCin.removeAttribute("required");
            sellerPayoutDetails.removeAttribute("required");
        }
    });

    // Chanje koulè ak tèks bouton an si l chanje ant MonCash, NatCash, Wise oswa Bank
    if (regPaymentMethod) {
        regPaymentMethod.addEventListener("change", updateButtonText);
    }

    /* =====================================
       2. CHANJE KOULÈ AK TÈKS BOUTON AN OTO
    ===================================== */
    function updateButtonText() {
        if (roleSelect.value !== "seller") return;
        
        const method = regPaymentMethod ? regPaymentMethod.value : "moncash";
        
        if (method === "natcash") {
            btnSubmit.innerText = "Konfime epi Peye 2,500 HTG sou NatCash";
            btnSubmit.style.background = "#ff5500"; // Koulè Natcom Orange
            btnSubmit.style.color = "white";
        } 
        else if (method === "wise") {
            btnSubmit.innerText = "Konfime epi Peye $20.00 USD sou Wise";
            btnSubmit.style.background = "#9fe870"; // Koulè Vèt Wise Flash
            btnSubmit.style.color = "#131921"; // Tèks nwa Amazon
        } 
        else if (method === "bank_haiti") {
            btnSubmit.innerText = "Konfime epi Depoze 2,500 HTG pa Bank";
            btnSubmit.style.background = "#131921"; // Nwa Amazon
            btnSubmit.style.color = "#ff9900"; // Jòn kontou
        }
        else {
            btnSubmit.innerText = "Konfime epi Peye 2,500 HTG sou MonCash";
            btnSubmit.style.background = "#ff9800"; // Koulè Digicel MonCash
            btnSubmit.style.color = "white";
        }
    }

    /* =====================================
       3. JERE ENSRIPSYON AK REDIREKSYON STRIK
    ===================================== */
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const role = roleSelect.value;
        const chosenMethod = regPaymentMethod ? regPaymentMethod.value : "moncash";

        // Prepare done de baz yo an JSON nòmal pou evite erè 'req.body undefined'
        const userData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            role: role
        };

        if (role === "seller") {
            userData.shopName = shopName.value;
            userData.shopAddress = shopAddress.value;
            userData.shopPhone = shopPhone.value;
            userData.nif = shopNif.value;
            userData.cin = shopCin.value;
            userData.mainCategory = document.getElementById("shop-category").value;
            userData.payoutMethod = document.getElementById("seller-payout-method").value;
            userData.payoutDetails = sellerPayoutDetails.value;
            userData.paymentMethodChosen = chosenMethod;
            userData.image = "assets/default-doc.pdf"; // Lyen tès pou pyès yo
        }

        try {
            btnSubmit.innerText = "N ap prepare kont ou... ⏳";
            btnSubmit.disabled = true;

            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erè pandan enskripsyon an.");
            }

            // Sove kontni sesyon koneksyon otomatik la touswit
            localStorage.setItem("token", data.token);
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("userName", data.name);
            if (data.userId) localStorage.setItem("userId", data.userId);

            // Redireksyon strik sou paj manyèl yo selon metòd vandè a chwazi a:
            if (role === "seller") {
                alert(`Enfòmasyon yo valid! Kounye a n ap redirije w sou paj ${chosenMethod.toUpperCase()} pou w konfime frè enskripsyon an.`);
                
                if (chosenMethod === "natcash") {
                    window.location.href = "natcash-payment.html?type=registration";
                } 
                else if (chosenMethod === "wise") {
                    window.location.href = "wise-payment.html?type=registration";
                } 
                else if (chosenMethod === "bank_haiti") {
                    window.location.href = "bank-payment.html?type=registration";
                }
                else {
                    window.location.href = "moncash-payment.html?type=registration";
                }
            } else {
                alert(`🎉 Bonjou ${data.name}! Enskripsyon ou reyisi. Ou konekte otomatikman, n ap voye w sou boutik la touswit!`);
                window.location.href = "shop.html";
            }

        } catch (error) {
            console.error("Erè:", error);
            alert("❌ Erè: " + error.message);
            btnSubmit.disabled = false;
            updateButtonText();
        }
    });
});
