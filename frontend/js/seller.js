const BASE_URL = typeof API !== 'undefined' ? API : "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("product-modal");
    const btnOpen = document.getElementById("btn-open-modal");
    const btnClose = document.getElementById("btn-close-modal");
    const addProductForm = document.getElementById("add-product-form");
    
    const prodCategory = document.getElementById("prod-category");
    const prodDesc = document.getElementById("prod-desc");

    /* =======================================================
       1. TOUT MODÈL DESKRIPSYON OTOMATIK NET (TEMPLATES)
    ======================================================= */
    const descriptionTemplates = {
        "telefòn": "📱 DETAY TELEFÒN / TABLÈT:\n- Mak / Modèl: \n- Memwa (GB): \n- Eta (Nèf/Ized): \n- Sante Batri (%): \n- Koulè: ",
        "laptop": "💻 DETAY ÒDINATÈ / LAPTOP:\n- Mak / Modèl: \n- Processeur (CPU): \n- Memwa (RAM): \n- Depo (SSD/HDD): \n- Eta Batri: ",
        "desktop": "🖥️ DETAY DESKTOP PC:\n- Karakteristik Pwosesè: \n- RAM & Depo: \n- Kat Grafik (GPU): \n- Èske Screen ladan l: ",
        "gaming": "🎮 DETAY GAMING (Console / Jwèt):\n- Aparèy (PS5, Xbox, PC): \n- Akseswa (Manch, Fil): \n- Tit Jwèt (Si se jwèt): \n- Eta: ",
        "tv": "📺 DETAY TV & ELEKTWONIK:\n- Mak: \n- Gwosè Ekran (Pouces): \n- Smart TV (Wi/Non): \n- Rezolisyon: ",
        "audio": "🎧 DETAY AUDIO (Kask, Speaker):\n- Kalite (Bluetooth/Briye): \n- Mak: \n- Otonomi Batri: \n- Kalite Son: ",
        "kamera": "📷 DETAY KAMERA / APARÈY FOTO:\n- Mak / Modèl: \n- Kalite Lantiy: \n- Rezolisyon Megapixel: \n- Akseswa ki ladan l: ",
        "mont": "⌚ DETAY MONT / SMART WATCH:\n- Mak: \n- Koneksyon (Bluetooth/Sim): \n- Koulè Brajle: \n- Sistèm (iOS/Android): ",
        
        "rad gason": "👕 DETAY RAD GASON:\n- Kalite (Mayo, Chemiz, Kanson): \n- Gwosè (Size): \n- Koulè: \n- Tisi / Materyèl: ",
        "rad fanm": "👗 DETAY RAD FANM:\n- Kalite (Ròb, Jip, Top): \n- Gwosè (Size): \n- Koulè: \n- Style / Okazyon: ",
        "rad timoun": "👶 DETAY RAD TIMOUN:\n- Laj (Kalkile an mwa/ane): \n- Kalite Rad: \n- Materyèl (Koton dou): \n- Koulè: ",
        "soulye": "👟 DETAY SOULYE / TENIS:\n- Mak: \n- Pointure (Size): \n- Koulè: \n- Eta: ",
        "sak & valiz": "👜 DETAY SAK & VALIZ:\n- Materyèl (Kwi, Twal): \n- Kalite (Sakit, Valiz Lekòl): \n- Koulè: \n- Kantite Pòch: ",
        "bijou": "💍 DETAY BIJOU:\n- Kalite (Bag, Chenn, Zanno): \n- Materyèl (Lò, Ajan, Plake): \n- Gwosè: \n- Okazyon: ",
        "linèt": "🕶️ DETAY LINÈT:\n- Kalite (Solèy / Medikal): \n- Koulè Kad: \n- Mak / Style: ",
        
        "bote": "💄 DETAY BOTE & KOSMETIK:\n- Kalite (Makiyaj, Pafen): \n- Mak: \n- Volim (ml/oz): \n- Dat Ekspirasyon: ",
        "swen kò": "🧴 DETAY SWEN KÒ:\n- Kalite Pwodwi (Krèm, Savon): \n- Kalite Po (Sèch, Gra): \n- Benefis prensipal: \n- Volim: ",
        "famasi": "💊 DETAY FAMASI:\n- Non Pwodwi / Medikaman: \n- Kantite Tablèt/Dòz: \n- Dat Ekspirasyon: \n- Konsèy pou itilize: ",
        "sante": "🩺 DETAY SANTE / MEDIKAL:\n- Aparèy (Tansyonmèt, Tèmomèt): \n- Mak / Modèl: \n- Fonksyon prensipal: ",
        
        "kay": "🏠 DETAY KAY & MÈB:\n- Kalite (Kòf, Tab, Chèz): \n- Materyèl (Bwa, Fè, Plastik): \n- Dimansyon (Gwosè): \n- Koulè: ",
        "chanm": "🛏️ DETAY CHANM (Kabann, Dra):\n- Kalite Atik: \n- Gwosè (King, Queen, Twin): \n- Koulè / Modèl: ",
        "salon": "🛋️ DETAY SALON (Kanape, Tapi):\n- Kantite Plas (Pou kanape): \n- Koulè / Tisi: \n- Kondisyon: ",
        "kwizin": "🍽️ DETAY KWIZIN (Blender, Chodyè):\n- Aparèy / Akseswa: \n- Mak: \n- Kapasite (Volim): \n- Pouvwa Watts (Si l elektrik): ",
        "twalèt": "🚿 DETAY TWALÈT:\n- Atik: \n- Materyèl (Seramik, Plastik): \n- Koulè: ",
        
        "manje": "🍔 DETAY PWODWI MANJE:\n- Non Pwodwi: \n- Kantite / Pwa: \n- Dat Ekspirasyon: \n- Peyi ki fè l: ",
        "bwason": "🥤 DETAY BWASON (Ji, Likè):\n- Kalite (Ji, Gazez, Alkòl): \n- Gwosè Boutèy / Bwat: \n- Gou / Saveur: ",
        "fwi & legim": "🍎 DETAY FWI & LEGIM:\n- Kalite (Frè / Sèch): \n- Kantite (Pa mamit / liv): \n- Kote l soti (Lokal): ",
        "vyann": "🥩 DETAY VYANN:\n- Kalite (Bèf, Kabrit, Kochon, Poul): \n- Pwa (Liv): \n- Kondisyon (Frè / Jele): ",
        "pwason": "🐟 DETAY PWASON / FRUI DE MÈ:\n- Kalite Pwason: \n- Pwa (Liv): \n- Kondisyon (Fre nan glas / Jele): ",
        
        "machin": "🚗 DETAY MACHIN / OTOMOBIL:\n- Mak / Modèl: \n- Ane: \n- Transmisyon (Oto/Manyèl): \n- Kilometraj: \n- Kondisyon (Avan, Dwa): ",
        "moto": "🏍️ DETAY MOTO / REKÒT:\n- Mak / Modèl: \n- Ane: \n- Silendraj (CC): \n- Koulè & Plak: ",
        "bisiklèt": "🚲 DETAY BISIKLÈT:\n- Kalite (Espò, Timoun): \n- Gwosè Wou: \n- Mak & Koulè: ",
        "pyès machin": "🔧 DETAY PYÈS MACHIN / MOTO:\n- Non Pyès la: \n- Pou ki machin/moto li fèt: \n- Mak / Referans: \n- Eta (Nouvo/Ized): ",
        
        "konstriksyon": "🏗️ DETAY MATERYÈL KONSTRIKSYON:\n- Kalite (Siman, Fè, Blòk): \n- Kantite / Pwa: \n- Mak / Kalite: ",
        "zouti": "🔨 DETAY ZOUTI (Mato, Sye):\n- Non Zouti a: \n- Kalite (Manyèl / Elektrik): \n- Mak & Eta: ",
        "elektrisite": "⚡ DETAY ELEKTRISITE (Inverter, Panèl):\n- Aparèy / Materyèl: \n- Kapasite (Watts / Volt): \n- Mak / Otonomi: ",
        "plonbri": "🚰 DETAY PLONBRI:\n- Materyèl (Tiyo, Tiyo PVC, Tiyo kòb): \n- Dimansyon / Longè: \n- Kalite: ",
        
        "jaden": "🌱 DETAY JADEN / PO POT:\n- Atik: \n- Itilizasyon: \n- Koulè / Gwosè: ",
        "agrikilti": "🌾 DETAY AGRIKITLI (Grenn, Angrè):\n- Kalite Grenn / Pwodwi: \n- Pwa Sak la: \n- Itilizasyon / Rekòmandasyon: ",
        "elvaj": "🐄 DETAY ELVAJ (Manje bèt):\n- Pwodwi / Manje pou ki bèt: \n- Pwa Bwat / Sak: \n- Benefis: ",
        "bèt lakay": "🐓 DETAY BÈT LAKAY (Zannimo Vivan):\n- Kalite (Poul, Kabrit, Chen): \n- Laj / Ras: \n- Sante & Vaksen: ",
        
        "espò": "⚽ DETAY ESPÒ (Jwèt, Ballon):\n- Disiplin (Futbòl, Baskètbòl): \n- Atik / Ekipman: \n- Mak & Gwosè: ",
        "fitness": "🏋️ DETAY FITNESS (Altè, Tapi roulant):\n- Aparèy / Ekipman: \n- Pwa (Liv/Kg): \n- Mak & Eta: ",
        "baskètbòl": "🏀 DETAY BASKÈTBÒL:\n- Atik (Balo, Panyen, Soulye): \n- Mak: \n- Gwosè: ",
        "lapèch": "🎣 DETAY LAPÈCH:\n- Ekipman (Kanna, Fil, Zameson): \n- Mak / Kalite: ",
        
        "liv": "📚 DETAY LIV / WOMAN:\n- Tit Liv la: \n- Otè: \n- Lang (Kreyòl, Fransè, Anglè): \n- Sijè / Kategori: ",
        "lekòl": "📝 DETAY LEKÒL (Kaye, Sak lekòl):\n- Atik: \n- Kantite nan bwat: \n- Koulè / Style: ",
        "atizay": "🎨 DETAY ATIZAY (Penti, Tablo):\n- Kalite Travay: \n- Atis ki fè l (Si w konnen): \n- Materyèl / Dimansyon: ",
        "mizik": "🎵 DETAY MIZIK (Gitra, Pyano):\n- Enstriman: \n- Mak / Modèl: \n- Akseswa ki vin avè l: \n- Eta: ",
        
        "kado": "🎁 DETAY KADO / SOUVENIR:\n- Kalite Atik: \n- Pou ki okazyon: \n- Èske personnalisable (Wi/Non): ",
        "evènman": "🎉 DETAY EVÈNMAN (Dekorasyon):\n- Atik pou fèt: \n- Tèm / Koulè: \n- Kantite: ",
        "otèl": "🏨 DETAY OTÈL / REZÈVASYON:\n- Sèvis / Chanm: \n- Kote l ye (Vil): \n- Avantaj (Pisin, Dejene): ",
        "vwayaj": "✈️ DETAY VWAYAJ (Sak vwayaj, Tikè):\n- Atik / Sèvis: \n- Karakteristik: ",
        
        "biznis": "💼 DETAY BIZNIS / BIWO:\n- Ekipman Biwo: \n- Mak / Kalite: \n- Kondisyon: ",
        "sèvis dijital": "📱 DETAY SÈVIS DIJITAL:\n- Kalite Sèvis (Logisyèl, Grafik): \n- Tan livrezon: \n- Sa k enkli ladan l: ",
        "freelance": "💻 DETAY SÈVIS FREELANCE:\n- Konpetans / Travay: \n- Pri pa èdtan / pa pwojè: \n- Eksperyenz (Ane): ",
        "enpresyon": "🖨️ DETAY ENPRESYON (Banyè, Kat):\n- Kalite Enpresyon: \n- Papye / Materyèl: \n- Dimansyon / Pri pa kantite: "
    };

    // Chanje deskripsyon an otomatikman selon sa vandè a chwazi
    function updateDescriptionTemplate() {
        const selectedCat = prodCategory.value;
        if (descriptionTemplates[selectedCat]) {
            prodDesc.value = descriptionTemplates[selectedCat];
        } else {
            prodDesc.value = "📝 Deskripsyon pwodwi a:\n- \n- ";
        }
    }

    if (prodCategory && prodDesc) {
        updateDescriptionTemplate();
        prodCategory.addEventListener("change", updateDescriptionTemplate);
    }

    /* =======================================================
       2. LOJIK POP-UP MODAL (LOUVRI / FÈMEN)
    ======================================================= */
    if (btnOpen && modal && btnClose) {
        btnOpen.addEventListener("click", () => {
            modal.style.display = "flex";
            updateDescriptionTemplate();
        });
        btnClose.addEventListener("click", () => modal.style.display = "none");
    }

    /* =======================================================
       3. SUBMIT FÒM LAN BAY BACKEND NODE.JS
    ======================================================= */
    if (addProductForm) {
        addProductForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append("name", document.getElementById("prod-name").value);
            formData.append("price", document.getElementById("prod-price").value);
            formData.append("category", prodCategory.value);
            formData.append("desc", prodDesc.value);
            
            // Otomatisasyon non vandè a ki sove nan sesyon an
            const currentVendor = localStorage.getItem("userName") || "Vandè Mache Lakay";
            formData.append("vande", currentVendor);
            
            const imageFile = document.getElementById("prod-image").files;
            if (imageFile && imageFile.length > 0) {
                formData.append("productImage", imageFile[0]);
            }

            try {
                const response = await fetch(`${BASE_URL}/products/add`, {
                    method: "POST",
                    body: formData
                });

