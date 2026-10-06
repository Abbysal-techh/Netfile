let cart = [];

const GOOGLE_ADS_CONVERSIONS = {
    phoneCall: "AW-18233511983/YBW6CMrM0uocEK-gtfZD",
    whatsapp: "AW-18233511983/zDB3CImgsf0cEK-gtfZD",
    formSubmit: "AW-18233511983/zDB3CImgsf0cEK-gtfZD"
};

function trackGoogleAdsEvent(e, t) {
    "function" == typeof window.gtag && window.gtag("event", e, t);
}

function trackWhatsAppClick() {
    trackGoogleAdsEvent("whatsapp_click"), trackGoogleAdsEvent("conversion", {
        send_to: GOOGLE_ADS_CONVERSIONS.whatsapp
    });
}

function trackOfferSubmission() {
    trackGoogleAdsEvent("conversion", {
        send_to: GOOGLE_ADS_CONVERSIONS.formSubmit,
        value: 1,
        currency: "TRY"
    });
}

function trackPhoneClick() {
    trackGoogleAdsEvent("phone_click"), trackGoogleAdsEvent("conversion", {
        send_to: GOOGLE_ADS_CONVERSIONS.phoneCall
    });
}

function normalizeCartItem(e) {
    return "string" == typeof e ? {
        name: e,
        m2: null
    } : {
        name: e.name,
        m2: e.m2 ?? null
    };
}

function normalizeCart(e) {
    return Array.isArray(e) ? e.map(normalizeCartItem) : [];
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function findCartItem(e, t = null) {
    const a = null == t || "null" === t ? null : Number(t);
    return cart.find(t => t.name === e && (null === a ? null === t.m2 : Number(t.m2) === a));
}

function scheduleNonCriticalInit(e) {
    "requestIdleCallback" in window ? window.requestIdleCallback(e, {
        timeout: 1200
    }) : setTimeout(e, 0);
}

function buildResponsiveSrcset(e) {
    const t = e.match(/\.(jpe?g|webp)$/i);
    if (!t) return `${e} 1200w`;
    const a = t[0], n = e.slice(0, -a.length);
    return `${n}-480${a} 480w, ${n}-768${a} 768w, ${e} 1200w`;
}

function sanitizeProductName(e) {
    return String(e ?? "").replace(/[<>]/g, "").replace(/[\r\n\t]+/g, " ").trim().slice(0, 180);
}

function openWhatsApp(e) {
    const t = `Merhaba, ${sanitizeProductName(e)} hakkında bilgi ve fiyat teklifi almak istiyorum.`;
    trackWhatsAppClick(), window.open(`https://wa.me/905377342321?text=${encodeURIComponent(t)}`, "_blank", "noopener");
}

function initConversionTracking() {
    document.addEventListener("click", e => {
        const t = e.target.closest("a[href]");
        t && (/^tel:/i.test(t.getAttribute("href")) ? trackPhoneClick() : /^https?:\/\/(?:www\.)?(?:wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(t.href) && trackWhatsAppClick());
    });
}

function initHomepageProducts() {
    const e = document.querySelector("#homepage-products");
    if (!e || "true" === e.dataset.expanded) return;
        [ [ "kus", "Kuş Engelleme Filesi", "Geniş alanların, fabrika çatılarının ve balkonların kuş istilasından korunması için ince gözenekli ağlar.", "images/kusfilesi.webp" ], [ "spor", "Spor & Halı Saha Filesi", "Halı saha tavan ağları, kale arkası koruma fileleri ve tenis kortu çevreleme ağları.", "images/sahafilesi.webp" ], [ "okul", "Okul & Merdiven Boşluğu Filesi", "Kolejler, devlet okulları ve anaokulları için merdiven boşluklarını kapatan emniyet sistemleri.", "images/merdiven.webp" ], [ "golgelik", "Gölgelik Filesi", "Güneş ışığını azaltan, dış alanlarda konfor sağlayan dayanıklı gölgelik fileleri.", "images/golgelikyeni.webp" ], [ "hastane", "Hastane Filesi", "Hastane ve sağlık alanlarına uygun, hijyenik ve güvenli file çözümleri.", "images/hastane.webp" ], [ "sera", "Sera Filesi", "Sera alanlarında bitkileri korumaya ve hava akışını düzenlemeye yardımcı fileler.", "images/serra.webp" ], [ "cimcit", "Çim Çit", "Bahçe ve çevre düzenlemelerinde doğal görünüm sağlayan dayanıklı çim çit.", "images/cimcit.webp" ], [ "voleybol", "Voleybol Filesi", "Voleybol sahaları için ölçülü, sağlam ve uzun ömürlü spor filesi.", "images/voleybol.webp" ], [ "kres", "Kreş Tırmanma Filesi", "Kreş ve oyun alanlarında güvenli tırmanma aktiviteleri için dayanıklı fileler.", "images/kres.webp" ], [ "fabrika", "Fabrika Filesi", "Fabrika ve endüstriyel tesislerde güvenlik ve alan ayırma için profesyonel fileler.", "images/fabrika.webp" ] ].forEach(([t, a, n, i]) => {
        const l = document.createElement("div");
            l.className = "premium-card rounded-3xl border border-steel/20 bg-white/60 p-6 flex flex-col justify-between shadow-sm dark:bg-dark-card dark:border-dark-border";
        const r = escapeHtml(a), o = escapeHtml(n), s = escapeHtml(i);
        l.innerHTML = `\n            <div>\n                <div class="w-full h-44 rounded-2xl mb-4 overflow-hidden relative group">\n                    <img loading="lazy" decoding="async" src="${s}" srcset="${buildResponsiveSrcset(s)}" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" alt="${r}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">\n                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>\n                </div>\n                <h3 class="text-2xl font-bold font-heading text-oxford-blue dark:text-moonlight">${r}</h3>\n                <p class="text-sm text-steel/90 mt-2 dark:text-frost-blue/90">${o}</p>\n            </div>\n            <div><div class="flex flex-col gap-2 mt-3 sm:flex-row"><button onclick="showProductDetails('${t}')" class="product-card-btn product-card-btn-secondary">Detayları İncele</button><button onclick="quickAdd('${r}')" class="product-card-btn product-card-btn-primary">Teklif Listesine Ekle</button></div><a href="https://wa.me/905377342321?text=${encodeURIComponent("Merhaba, "+a+" hakkında bilgi almak istiyorum.")}" target="_blank" rel="noopener noreferrer" class="product-card-btn product-card-btn-whatsapp"><svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>WhatsApp ile Teklif Al</a></div>\n        `,
        e.appendChild(l);
    }), e.dataset.expanded = "true", translatableLeafNodesCache = null;
}

function initWhatsAppButton() {
    document.querySelectorAll('body > a[href^="https://wa.me/"]').forEach(e => {
        e.classList.remove("h-14", "w-14", "h-16", "w-16"), e.classList.add("h-[60px]", "w-[60px]");
        const t = e.querySelector("i");
        t?.classList.remove("h-6", "w-6"), t?.classList.add("h-7", "w-7");
    });
}

function findLegacySocialSidebar() {
    const e = document.querySelector(".js-social-sidebar");
    return e || (Array.from(document.querySelectorAll("div.fixed")).find(e => "toast-container" !== e.id && (!e.querySelector('a[href*="wa.me"]') && (!e.querySelector(".social-menu-toggle") && (e.querySelectorAll("a").length >= 4 && e.querySelector("svg"))))) || null);
}

function createSocialSvg(e) {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    return t.setAttribute("class", "w-6 h-6"), t.setAttribute("viewBox", "0 0 24 24"), 
    t.setAttribute("fill", "none"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "1.75"), 
    t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), 
    "instagram" === e ? t.innerHTML = '<rect x="2" y="2" width="20" height="20" rx="6.5" ry="6.5"></rect><circle cx="12" cy="12" r="4"></circle><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>' : "youtube" === e ? t.innerHTML = '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>' : "facebook" === e ? t.innerHTML = '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>' : "linkedin" === e && (t.innerHTML = '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>'), 
    t;
}

function ensureDynamicSocialSidebar() {
    const e = document.querySelector(".contact-fab") || Array.from(document.querySelectorAll("div.fixed")).find(e => e.querySelector('a[href*="wa.me"]'));
    if (!e || e.querySelector(".social-menu-toggle")) return;
    const t = document.createElement("div");
    t.className = "relative";
    const a = document.createElement("button");
    a.type = "button", a.className = "social-menu-toggle inline-flex h-[60px] w-[60px] items-center justify-center rounded-full bg-storm text-moonlight shadow-xl transition hover:bg-steel", 
    a.setAttribute("aria-label", "Sosyal medya bağlantılarını aç");
    const n = document.createElement("i");
    n.dataset.lucide = "share-2", n.className = "h-6 w-6", a.appendChild(n);
    const i = document.createElement("div");
    i.className = "social-menu-panel hidden absolute right-0 bottom-16 flex flex-col gap-3 rounded-2xl border border-white/20 bg-storm/95 p-3 shadow-xl";
    [ {
        href: "https://www.instagram.com/netfile.com.tr",
        key: "instagram",
        label: "Instagram"
    }, {
        href: "#",
        key: "youtube",
        label: "YouTube"
    }, {
        href: "#",
        key: "facebook",
        label: "Facebook"
    }, {
        href: "#",
        key: "linkedin",
        label: "LinkedIn"
    } ].forEach(e => {
        const t = document.createElement("a");
        t.rel = "noopener noreferrer", t.href = e.href, t.target = "_blank", t.setAttribute("aria-label", e.label), 
        t.className = "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:scale-110 hover:bg-white/20", 
        t.appendChild(createSocialSvg(e.key)), i.appendChild(t);
    }), t.append(a, i), e.prepend(t), a.addEventListener("click", () => i.classList.toggle("hidden")), 
    document.addEventListener("click", e => {
        t.contains(e.target) || i.classList.add("hidden");
    }), "undefined" != typeof lucide && lucide.createIcons();
}

function initSocialMenu() {
    const e = findLegacySocialSidebar(), t = document.querySelector(".contact-fab") || Array.from(document.querySelectorAll("div.fixed")).find(e => e.querySelector('a[href*="wa.me"]'));
    if (e) {
        const a = Array.from(e.querySelectorAll("a"));
        if (e.remove(), !t || 0 === a.length || t.querySelector(".social-menu-toggle")) return;
        const n = document.createElement("div");
        n.className = "relative";
        const i = document.createElement("button");
        i.type = "button", i.className = "social-menu-toggle inline-flex h-[60px] w-[60px] items-center justify-center rounded-full bg-storm text-moonlight shadow-xl transition hover:bg-steel", 
        i.setAttribute("aria-label", "Sosyal medya bağlantılarını aç");
        const l = document.createElement("i");
        l.dataset.lucide = "share-2", l.className = "h-6 w-6", i.append(l);
        const r = document.createElement("div");
        return r.className = "social-menu-panel hidden absolute right-0 bottom-16 flex flex-col gap-3 rounded-2xl border border-white/20 bg-storm/95 p-3 shadow-xl", 
        a.forEach(e => {
            e.className = "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:scale-110 hover:bg-white/20", 
            r.append(e);
        }), n.append(i, r), t.prepend(n), i.addEventListener("click", () => r.classList.toggle("hidden")), 
        document.addEventListener("click", e => {
            n.contains(e.target) || r.classList.add("hidden");
        }), void ("undefined" != typeof lucide && lucide.createIcons());
    }
    ensureDynamicSocialSidebar();
}

document.addEventListener("DOMContentLoaded", () => {
    "undefined" != typeof lucide && lucide.createIcons(), ("true" === localStorage.getItem("darkMode") || !localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches) && document.documentElement.classList.add("dark");
    const e = localStorage.getItem("cart");
    if (e) try {
        cart = normalizeCart(JSON.parse(e)), saveCart();
    } catch (e) {
        cart = [];
    }
    updateCartUI(), initSocialMenu(), scheduleNonCriticalInit(() => {
        processPendingProduct(), initCartDropdown(), initConversionTracking(), initHomepageProducts(), 
        initWhatsAppButton(), initLanguageToggle();
    });
    const t = document.getElementById("mobile-menu-button"), a = document.getElementById("mobile-menu");
    t && a && t.addEventListener("click", () => {
        a.classList.toggle("hidden");
    });
});

const translations = {
    "Ana Sayfa": "Home",
    "Hakkımızda": "About Us",
    "Ürünlerimiz": "Products",
    Galeri: "Gallery",
    "Teklif & Sipariş": "Quote & Order",
    "İletişim": "Contact",
    "Teklif İste": "Request a Quote",
    "İncele →": "View →",
    "Detayları İncele": "View Details",
    "İncele": "View Details",
    Kapat: "Close",
    "Hizmetlerimiz & Ürünler": "Services & Products",
    "Üreticisinden Teslimat": "Direct From the Manufacturer",
    "Antalya Geneli Hizmet Alanlarımız": "Our Service Areas Across Antalya",
    "TSE Belgeli Üretim": "TSE-Certified Production",
    Hizmetlerimiz: "Our Services",
    "Ürün Kataloğumuz": "Our Product Catalog",
    "Ürün Detayları": "Product Details",
    "Takip Et": "Follow Us",
    "NETFİLE file & ağ sistemleri": "NETFİLE file & network systems",
    "Hızlı Bağlantılar": "Quick Links",
    "Ürünlerimiz": "Products",
    "Yasal Bilgiler": "Legal Information",
    "Mesafeli Satış Sözleşmesi": "Distance Sales Agreement",
    "Gizlilik Politikası": "Privacy Policy",
    "KVKK Aydınlatma Metni": "Personal Data Protection Notice",
    "İptal & İade Koşulları": "Cancellation & Return Terms",
    "© 2026 NETFİLE file & ağ sistemleri. Tüm Hakları Saklıdır.": "© 2026 NETFİLE file & network systems. All rights reserved.",
    "Kepez, Antalya": "Kepez, Antalya",
    "0 (532) 000 00 00": "+90 532 000 00 00",
    "netfile07@gmail.com": "netfile07@gmail.com",
    "15 yıllık tecrübemizle Antalya ve çevre illerde profesyonel file montaj hizmeti sunuyoruz.": "With 15 years of experience, we provide professional net installation services in Antalya and surrounding provinces.",
    Projelerimiz: "Our Projects",
    "Antalya ve çevre illerde gerçekleştirdiğimiz profesyonel file montaj projelerimizden örnekler.": "Examples of our professional net installation projects completed in Antalya and surrounding provinces.",
    "Balkon Güvenlik Filesi": "Balcony Safety Net",
    "Kedi & Evcil Hayvan Filesi": "Cat & Pet Net",
    "Kuş Engelleme Filesi": "Bird Protection Net",
    "İnşaat Güvenlik Filesi": "Construction Safety Net",
    "İnşaat Emniyet Ağları": "Construction Safety Nets",
    "Raf Koruma Filesi": "Shelf Protection Net",
    "Havuz Koruma Filesi": "Pool Safety Net",
    "Depo ve raf sistemlerinde ürün düşmesini engelleyen, dayanıklı koruma fileleri.": "Durable protective nets that prevent products from falling in warehouses and shelving systems.",
    "Havuz güvenliği için çocuk ve evcil hayvan koruması sağlayan dayanıklı fileler.": "Durable nets that provide child and pet protection for pool safety.",
    "Spor & Halı Saha Filesi": "Sports & Football Field Net",
    "Okul & Merdiven Boşluğu Filesi": "School & Stairwell Net",
    "Kedi Filesi": "Cat Net",
    "Voleybol Filesi": "Volleyball Net",
    "Gölgelik Filesi": "Shade Net",
    "Hastane Filesi": "Hospital Net",
    "Sera Filesi": "Greenhouse Net",
    "Çim Çit": "Artificial Grass Fence",
    "Kreş Tırmanma Filesi": "Nursery Climbing Net",
    "Fabrika Filesi": "Factory Net",
    "Tümü": "All",
    Balkon: "Balcony",
    "İnşaat": "Construction",
    "Spor Sahası": "Sports Field",
    "Teklif Al": "Get a Quote",
    "PREMİUM ESTETİK KORUMA": "PREMIUM AESTHETIC PROTECTION",
    "Yıllara Meydan Okuyan Sürdürülebilir Yapı": "Sustainable Structure Built to Last for Years",
    "Zorlu dış mekan koşullarında formunu koruyan birinci sınıf hammadde kalitesi.": "Premium raw material quality that maintains its form in demanding outdoor conditions.",
    "GÜVENLİ YAŞAM ALANLARI": "SAFE LIVING SPACES",
    "Balkonlarınızda Güvenli ve Konforlu Yaşam": "Safe and Comfortable Living on Your Balconies",
    "Görüş açınızı kapatmayan, yüksek mukavemetli ve estetik koruma ağları.": "High-strength, aesthetic safety nets that preserve your view.",
    "PROFESYONEL ÇÖZÜM ORTAĞI": "PROFESSIONAL SOLUTIONS PARTNER",
    "Alanınıza Özel Kusursuz Montaj Süreci": "A Flawless Installation Process Tailored to Your Space",
    "Uzman kadromuzla alanınız için en doğru montaj hizmeti": "The right installation service for your space from our expert team",
    "İhtiyacınıza en uygun, dayanıklı ve yüksek mukavemetli file çeşitlerimiz.": "Durable, high-strength netting options selected for your needs.",
    "Antalya üretim tesislerimizden doğrudan, aracı olmadan en uygun fiyatlarla projelerinize sevk. TS EN 1263-1 standartlarında test edilip onaylanmış, TSE belgeli ve güvenilir üretim.": "We ship directly from our Antalya production facilities to your projects at the best prices, without intermediaries. Tested and approved to TS EN 1263-1 standards, with TSE-certified and reliable production.",
    "Çocuklarınız ve aileniz için yüksek katlı balkonlarda tam koruma sağlayan özel montajlı ağlar.": "Custom-installed nets providing full protection for your children and family on high-rise balconies.",
    "Dostlarınızın pencere ve balkonlardan güvenle etrafı izlemesi için yırtılmaz, dayanıklı ipler.": "Tear-resistant, durable nets that let your pets safely enjoy the view from windows and balconies.",
    "Şantiyelerde iş güvenliği standartlarına uygun, düşmeyi önleyici ağır hizmet tipi ağlar.": "Heavy-duty fall-prevention nets compliant with occupational safety standards for construction sites.",
    "Geniş alanların, fabrika çatılarının ve balkonların kuş istilasından korunması için ince gözenekli ağlar.": "Fine-mesh nets that protect large areas, factory roofs, and balconies from birds.",
    "Halı saha tavan ağları, kale arkası koruma fileleri ve tenis kortu çevreleme ağları.": "Football field roof nets, goal-end protection nets, and tennis court enclosure nets.",
    "Kolejler, devlet okulları ve anaokulları için merdiven boşluklarını kapatan emniyet sistemleri.": "Safety systems that cover stairwells in colleges, public schools, and kindergartens.",
    "Güneş ışığını azaltan, dış alanlarda konfor sağlayan dayanıklı gölgelik fileleri.": "Durable shade nets that reduce sunlight and provide comfort in outdoor areas.",
    "Hastane ve sağlık alanlarına uygun, hijyenik ve güvenli file çözümleri.": "Hygienic and safe netting solutions suitable for hospitals and healthcare spaces.",
    "Sera alanlarında bitkileri korumaya ve hava akışını düzenlemeye yardımcı fileler.": "Nets that help protect plants and regulate airflow in greenhouse areas.",
    "Bahçe ve çevre düzenlemelerinde doğal görünüm sağlayan dayanıklı çim çit.": "Durable artificial grass fencing that provides a natural look for gardens and landscaping.",
    "Voleybol sahaları için ölçülü, sağlam ve uzun ömürlü spor filesi.": "Precisely sized, strong, and long-lasting sports netting for volleyball courts.",
    "Kreş ve oyun alanlarında güvenli tırmanma aktiviteleri için dayanıklı fileler.": "Durable nets for safe climbing activities in nurseries and playgrounds.",
    "Fabrika ve endüstriyel tesislerde güvenlik ve alan ayırma için profesyonel fileler.": "Professional nets for safety and space separation in factories and industrial facilities.",
    "Tüm Ürün Kataloğunu Keşfet": "Explore the Full Product Catalog",
    "Gereksinimlerinize uygun olarak hazırlanan profesyonel ağ çözümleri.": "Professional netting solutions prepared to meet your needs.",
    "Antalya'nın yüksek katlı yapılarında çocuk emniyeti için UV katkılı düğümlü file grubu.": "UV-treated knotted netting designed for child safety in Antalya high-rise buildings.",
    "İçerisinde ince çelik tel takviyesi barındıran, kedi tırnağına ve ısırmasına dayanıklı fileler.": "Nets reinforced with fine steel wire, resistant to cat claws and bites.",
    "TS EN 1263-1 standartlarına tam uyumlu yüksek mukavemetli şantiye ağları.": "High-strength construction nets fully compliant with TS EN 1263-1 standards.",
    "Doğrudan Üreticiden Teslimat": "Direct From the Manufacturer",
    "Kuş Filesi": "Bird Net",
    "Çocuk Güvenlik Filesi": "Child Safety Net",
    "Çocuk Filesi": "Child Net",
    "Halı Saha Üst Tavan Filesi": "Football Field Roof Net",
    "Halı Saha Tampon Filesi": "Football Field Barrier Net",
    "Köpek Filesi": "Dog Net",
    "Kale Filesi": "Goal Net",
    "Okul / Hastane Merdiven Boşluğu Filesi": "School / Hospital Stairwell Net",
    "Hakkımızda | NETFİLE file & ağ sistemleri": "About Us | NETFİLE file & network systems",
    "Galeri | NETFİLE file & ağ sistemleri": "Gallery | NETFİLE file & network systems",
    "Teklif & Sipariş - NETFİLE file & ağ sistemleri": "Quote & Order - NETFİLE file & network systems",
    "İletişim | NETFİLE file & ağ sistemleri": "Contact | NETFİLE file & network systems",
    "Firma Hikayemiz": "Our Company Story",
    "Yıllık Deneyim": "Years of Experience",
    "M² File Montajı": "M² of Net Installation",
    "Müşteri Memnuniyeti": "Customer Satisfaction",
    "Hızlı Keşif & Destek": "Fast Survey & Support",
    "Biz Kimiz?": "Who We Are?",
    Vizyonumuz: "Our Vision",
    "Ürün Kalitemiz": "Our Product Quality",
    "Değerlerimiz": "Our Values",
    "Nasıl Çalışıyoruz?": "How We Work",
    "Müşteri Yorumları": "Customer Reviews",
    "Referanslarımız": "Our References",
    "Sıkça Sorulan Sorular": "Frequently Asked Questions",
    "15 yıllık tecrübemiz ile Antalya ve birçok ilde, file çeşitlerimiz ile sizlere hizmet vermeye devam ediyoruz. Filelerimizi yerinde uyguluyor ve en kaliteli hizmeti sizlere sunuyoruz.": "With 15 years of experience, we continue to serve you in Antalya and many other provinces with our range of nets. We install our nets on site and provide you with the highest quality service.",
    "Amacımız; müşterilerimize güvenli, estetik ve uzun ömürlü file sistemleri sunarak yaşam veya çalışma alanlarını — ister ev, ister apartman, ister inşaat ya da kurum alanı olsun — daha güvenli, daha huzurlu ve daha kullanışlı hâle getirmektir.": "Our goal is to make living and working spaces, whether homes, apartment buildings, construction sites, or institutions, safer, more peaceful, and more practical by providing secure, aesthetic, and long-lasting net systems.",
    "File güvenliği ve koruma alanında ilk akla gelen firma olmak; kaliteden ve güvenlikten taviz vermeden, hem bireysel hem kurumsal alanlarda çözüm ortağı olarak tercih edilmek.": "To be the first company that comes to mind for net safety and protection, and to be the preferred solutions partner for both individual and corporate spaces without compromising quality or safety.",
    "Ürünlerimiz, UV katkılı, güneş ışığına dayanıklı ve dış mekân şartlarında uzun süre formunu koruyabilen özel hammaddelerden üretilir. Böylece sıcak ve yüksek güneş alan iklimlerde bile filelerimizde erken yıpranma, gevşeme veya renk solması yaşanmaz.": "Our products are made from special UV-treated, sunlight-resistant raw materials that retain their shape outdoors for a long time. This prevents premature wear, loosening, or fading even in hot, sunny climates.",
    "Güvenlik & Kalite": "Safety & Quality",
    "Şeffaflık & Samimiyet": "Transparency & Sincerity",
    "Müşteri Odaklılık": "Customer Focus",
    "Uzmanlık & Deneyim": "Expertise & Experience",
    "Estetik & Konfor": "Aesthetics & Comfort",
    "Kullanılan file materyallerimiz yüksek mukavemetli, dış ortam ve hava koşullarına dayanıklı; montajlarımız profesyonel ve garantili.": "Our net materials are high-strength and resistant to outdoor and weather conditions; our installations are professional and guaranteed.",
    "Hizmet öncesi — proje, ölçü, fiyat ve uygulanabilirlik konularında netlik; hizmet sonrası destek ve sorulara hızlı yanıt.": "Clarity about the project, measurements, pricing, and feasibility before service, followed by support and prompt answers after service.",
    "Her projenin eşsiz olduğunu bilir, ölçü ve tasarımı proje alanına özel planlar; ihtiyaç ve beklentinize göre çözümler.": "We know every project is unique, so we plan measurements and design for each space and provide solutions based on your needs and expectations.",
    "Yıllar içinde edindiğimiz tecrübe, doğru ürün kullanımı ve sorunsuz montaj ile güvenli ve kalıcı çözümler sunmak.": "We provide safe, lasting solutions through years of experience, the right products, and flawless installation.",
    "Sadece güvenlik değil; yaşam alanlarınızın estetiğini ve konforunu da gözeten, göze hoş gelen file çözümleri.": "Net solutions that consider not only safety, but also the aesthetics and comfort of your living spaces.",
    "Öncelikle — sizinle iletişime geçerek — projenizi, kullanım amacınızı ve beklentinizi dinliyoruz.": "First, we contact you to understand your project, its purpose, and your expectations.",
    "Yerinde keşif veya sizin verdiğiniz ölçülere göre proje planı hazırlıyoruz.": "We prepare a project plan based on an on-site survey or the measurements you provide.",
    "Kullanım amacına göre en uygun file tipini ve malzemeyi seçiyoruz.": "We select the most suitable net type and material for your purpose.",
    "Deneyimli ekibimiz ile profesyonel montaj sağlıyoruz — hem ürün, hem montaj garantili.": "Our experienced team provides professional installation, with guarantees for both the product and the installation.",
    "İş bitiminden sonra memnuniyetinizi önemsiyor, talep hâlinde destek sunuyoruz.": "We care about your satisfaction after completion and provide support when requested.",
    "Montaj ne kadar sürer?": "How long does installation take?",
    "Garanti süresi nedir?": "What is the warranty period?",
    "Kediler bu fileyi yırtabilir mi?": "Can cats tear this net?",
    "UV koruması var mı?": "Does it have UV protection?",
    "Montaj süresi alanın büyüklüğüne göre değişmektedir. Genellikle 1-3 gün içinde tamamlanır.": "Installation time varies depending on the size of the area. It is usually completed within 1 to 3 days.",
    "Tüm ürünlerimiz 2 yıl garanti kapsamındadır. Montaj hizmetimiz de 1 yıl garantidir.": "All our products are covered by a 2-year warranty. Our installation service also carries a 1-year warranty.",
    "Hayır, kedi filelerimiz içeriğinde ince çelik tel takviyesi barındırır ve kedi tırnağına dayanıklıdır.": "No. Our cat nets contain fine steel wire reinforcement and are resistant to cat claws.",
    "Evet, tüm ürünlerimiz UV katkılıdır ve güneş ışığına dayanıklıdır. Renk solması yaşamaz.": "Yes. All our products are UV-treated and resistant to sunlight, so they do not fade.",
    '"Balkonumuza taktırdığımız file çok kaliteli. Çocuklarımız için güvenli bir alan oluşturdular. Teşekkürler!"': '"The net installed on our balcony is excellent quality. They created a safe space for our children. Thank you!"',
    '"Kedilerimiz artık balkondan düşmüyor. Hızlı montaj ve profesyonel ekip. Kesinlikle tavsiye ederim."': '"Our cats no longer fall from the balcony. Fast installation and a professional team. I definitely recommend them."',
    '"Şantiyemizde kullandığımız güvenlik ağları TS standartlarına uygun. Güvenilir bir firma."': '"The safety nets we use at our construction site comply with TS standards. A reliable company."',
    '"Okulumuzun merdiven boşluklarına file taktırdık. Çocuk güvenliği için harika çözüm."': '"We had nets installed in our school stairwells. An excellent solution for child safety."',
    '"Halı sahamızın tavanına file yaptırdık. Top top gidiyor, çok memnunuz."': '"We had a net installed on our football field roof. The ball stays in play and we are very satisfied."',
    '"Villamızın terasına kuş filesi taktırdık. Artık kuş sorunu yok, çok temiz çalışma."': '"We had a bird net installed on our villa terrace. No more bird problems, and very neat work."',
    '"Apartman sitemize toplu file montajı yaptılar. Fiyatlar uygun, kalite yüksek."': '"They installed nets throughout our apartment complex. Reasonable prices and high quality."',
    '"Tenis kortumuzun çevresine file çektirdik. Top dışarı çıkmıyor, mükemmel."': '"We had a net installed around our tennis court. The ball stays inside, perfect."',
    '"İş güvenliği ağları aldık, kalite harika. İşçilerimiz için güvenli ortam sağladılar."': '"We purchased occupational safety nets and the quality is excellent. They created a safe environment for our workers."',
    '"Kedi filesi aldık, kedimiz artık rahat. Montaj hızlı ve temizdi."': '"We purchased a cat net and our cat is comfortable now. Installation was fast and clean."',
    '"Çocuk güvenlik filesi taktırdık, içimiz rahat. Profesyonel ekip."': '"We had a child safety net installed and now we have peace of mind. A professional team."',
    '"Fabrika çatımıza kuş filesi taktırdık. Sorun çözüldü, teşekkürler."': '"We had a bird net installed on our factory roof. Problem solved, thank you."',
    '"Kolejimize merdiven filesi taktırdık. Öğrenci güvenliği için ideal çözüm."': '"We had a stairwell net installed at our college. An ideal solution for student safety."',
    '"Spor salonumuzun tavanına file yaptırdık. Sporcular için güvenli ortam."': '"We had a net installed on our sports hall roof. A safe environment for athletes."',
    '"Balkon güvenlik filesi aldık, kalite harika. Fiyatlar da makul."': '"We purchased a balcony safety net. The quality is excellent and the prices are reasonable."',
    "Lüks Oteller": "Luxury Hotels",
    Belediye: "Municipality",
    "Eğitim": "Education",
    "Spor Kulübü": "Sports Club",
    Turizm: "Tourism",
    "Otel Zinciri": "Hotel Chain",
    "Lüks Konaklama": "Luxury Accommodation",
    "Deniz Turizmi": "Sea Tourism",
    "Balkon güvenlik filesi montajı": "Balcony safety net installation",
    "Kedi güvenlik filesi montajı": "Cat safety net installation",
    "İnşaat güvenlik ağları": "Construction safety nets",
    "Halı saha tavan ağ montajı": "Football field roof net installation",
    "Çocuk güvenlik filesi": "Child safety net",
    "Pencere kedi filesi": "Window cat net",
    "Yüksek bina güvenlik ağları": "High-rise building safety nets",
    "Tenis kortu çevreleme ağları": "Tennis court enclosure nets",
    "Teras güvenlik filesi": "Terrace safety net",
    "Spor Sahası Filesi": "Sports Field Net",
    "Spor sahası ağ montajı": "Sports field net installation",
    "Kedi Balkon Filesi": "Cat Balcony Net",
    "Yapı Güvenlik Filesi": "Building Safety Net",
    "Tenis Filesi": "Tennis Net",
    "Halı Saha Filesi": "Football Field Net",
    "Alan & İletişim Detayları": "Area & Contact Details",
    "Uygulama Yapılacak Alan Türü": "Type of Area",
    "Okul / Merdiven Boşluğu": "School / Stairwell",
    "İnşaat Şantiyesi": "Construction Site",
    "Spor Sahası / Kompleks": "Sports Field / Complex",
    "Pencere / Diğer": "Window / Other",
    "Tahmini Alan Ölçüsü (Metrekare - m²)": "Estimated Area (Square Meters - m²)",
    "Örn: 15": "e.g. 15",
    "Adınız Soyadınız": "Your Full Name",
    "İsminiz": "Your name",
    "Telefon Numaranız": "Your Phone Number",
    "E-Posta Adresiniz (Opsiyonel)": "Your Email Address (Optional)",
    "E-postanızı bilmiyorsanız boş bırakabilirsiniz": "You may leave this blank if you do not know your email address",
    "TEKLİF İSTE & KEŞİF TALEP ET": "REQUEST A QUOTE & SITE SURVEY",
    "BAĞLANALIM": "LET'S CONNECT",
    Adres: "Address",
    Telefon: "Phone",
    "E-Posta": "Email",
    "Çalışma Saatleri": "Working Hours",
    "Hafta İçi 08:00 - 19:00": "Weekdays 08:00 - 19:00",
    "Bir Mesaj Bırakın": "Leave a Message",
    "Mesajınız": "Your Message",
    "Sorunuzu veya talebinizi yazın...": "Write your question or request...",
    "Mesajı Gönder": "Send Message",
    "Gönderiliyor...": "Sending...",
    "Bizi Ziyaret Edin": "Visit Us",
    "Henüz ürün eklemediniz.": "You have not added any products yet.",
    "Teklif Listeniz": "Your Quote List",
    "Teklif listeniz şu an boş.": "Your quote list is currently empty.",
    "Lütfen ürünlerimiz sayfasından ağ çeşidi seçin.": "Please select a net type from our products page.",
    "Teklif Sayfasına Git": "Go to Quote Page",
    "Ölçü girilmedi": "Measurement not entered",
    "Çıkar": "Remove",
    "Antalya File & Ağ Montaj": "Antalya Net & Mesh Installation",
    "Antalya File & Ağ Montaj Sistemleri": "Antalya Net & Mesh Installation Systems",
    "Antalya Stadyumu": "Antalya Stadium",
    "Antalya Şehir Hastanesi": "Antalya City Hospital",
    "Erç Korkmaz Kaleci Akademisi": "Erc Korkmaz Goalkeeper Academy",
    "Ekpe İnşaat": "Ekpe Construction",
    "Antalya Eğitim ve Araştırma Hastanesi": "Antalya Training and Research Hospital",
    "Kepez Devlet Hastanesi": "Kepez State Hospital",
    "Lara Otel Projeleri": "Lara Hotel Projects",
    "Rixos Otel": "Rixos Hotel",
    "Belek Golf Sahası": "Belek Golf Course",
    "Antalya Futbol Akademileri ve Halı Sahaları": "Antalya Football Academies and Football Fields",
    "Döşemealtı Spor Kompleksleri": "Döşemealtı Sports Complexes",
    "Lara Spor Kompleksleri": "Lara Sports Complexes",
    "Belediye Spor Tesisleri": "Municipal Sports Facilities",
    "Toptan Meyve Sebze Fabrikası": "Wholesale Fruit and Vegetable Factory",
    "DHL Kargo": "DHL Cargo",
    "Trendyol Kargo": "Trendyol Cargo",
    Stadyum: "Stadium",
    Hastane: "Hospital",
    "Futbol Akademisi": "Football Academy",
    "İnşaat Firması": "Construction Company",
    "Otel Projeleri": "Hotel Projects",
    Otel: "Hotel",
    "Golf Sahası": "Golf Course",
    "Futbol Akademileri & Halı Sahaları": "Football Academies & Fields",
    "Spor Kompleksleri": "Sports Complexes",
    "Belediye Spor Tesisleri": "Municipal Sports Facilities",
    "Toptan Ürün Fabrikası": "Wholesale Produce Factory",
    "Kargo Hizmetleri": "Cargo Services",
    "NETFİLE file & ağ sistemleri": "NETFİLE file & network systems"
}, reverseTranslations = Object.entries(translations).reduce((e, [t, a]) => (e[a] = t, 
e), {});

let translatableLeafNodesCache = null;

function getTranslatableLeafNodes() {
    return translatableLeafNodesCache || (translatableLeafNodesCache = Array.from(document.querySelectorAll("body *")).filter(e => !e.children.length && (!e.closest("script, style") && e.textContent.trim().length > 0)), 
    translatableLeafNodesCache);
}

function translatePage(e) {
    document.documentElement.lang = "en" === e ? "en" : "tr";
    const t = t => t ? "en" === e ? translations[t] || t : reverseTranslations[t] || t : t;
    document.title = t(document.title), document.querySelectorAll("[data-lang-toggle]").forEach(t => {
        t.textContent = "en" === e ? "TR" : "EN";
    }), document.querySelectorAll("[data-i18n]").forEach(t => {
        const a = t.dataset.i18n;
        t.textContent = "en" === e && translations[a] || a;
    }), document.querySelectorAll("input[placeholder], textarea[placeholder], img[alt]").forEach(e => {
        const a = e.hasAttribute("placeholder") ? "placeholder" : "alt";
        e.setAttribute(a, t(e.getAttribute(a)));
    }), getTranslatableLeafNodes().forEach(t => {
        const a = t.textContent.trim();
        a && ("en" === e && translations[a] && (t.textContent = translations[a]), "tr" === e && reverseTranslations[a] && (t.textContent = reverseTranslations[a]));
    }), localStorage.setItem("language", e);
}

function translateDynamicContent() {
    "en" === localStorage.getItem("language") && translatePage("en");
}

function initLanguageToggle() {
    const e = document.querySelector("header");
    if (!e) return;
    const t = () => {
        const e = document.createElement("button");
        return e.type = "button", e.dataset.langToggle = "true", e.className = "rounded-full border border-steel/30 bg-white/50 px-3 py-2 text-xs font-bold text-oxford-blue dark:bg-dark-card dark:border-dark-border dark:text-moonlight", 
        e.textContent = "en" === localStorage.getItem("language") ? "TR" : "EN", e.title = "Change language", 
        e.addEventListener("click", () => translatePage("en" === document.documentElement.lang ? "tr" : "en")), 
        e;
    }, a = e.querySelector(".hidden.lg\\:flex.items-center.gap-4, .hidden.md\\:flex.items-center.gap-4");
    a?.querySelectorAll("[data-lang-toggle]").forEach(e => e.remove()), e.querySelector("#mobile-menu")?.querySelectorAll("[data-lang-toggle]").forEach(e => e.remove()), 
    e.querySelectorAll(".brand-area [data-lang-toggle]").forEach(e => e.remove());
    const n = e.querySelector(":scope > div > div.flex.items-center.gap-2.lg\\:hidden, :scope > div > div.flex.items-center.gap-2.md\\:hidden");
    if (n && !n.querySelector("[data-lang-toggle]")) {
        const e = t();
        e.classList.add("shrink-0"), n.insertBefore(e, n.firstElementChild);
    }
    if (n && !n.querySelector("[data-mobile-cart]")) {
        const t = e.querySelector("#cart-toggle"), a = document.createElement("button");
        a.type = "button", a.dataset.mobileCart = "true", a.className = "inline-flex items-center justify-center rounded-full border border-steel/30 bg-white/50 text-oxford-blue dark:bg-dark-card dark:border-dark-border dark:text-moonlight", 
        a.setAttribute("aria-label", "Teklif listesini aç"), a.innerHTML = '<i data-lucide="clipboard-list" class="h-4 w-4"></i><span class="mobile-cart-count text-xs font-bold">0</span>', 
        a.addEventListener("click", () => t?.click());
        const i = n.querySelector("#mobile-menu-button");
        n.insertBefore(a, i || null), "undefined" != typeof lucide && lucide.createIcons();
    }
    if (a) {
        const e = t();
        e.classList.add("hidden", a.classList.contains("md:flex") ? "md:inline-flex" : "lg:inline-flex"), 
        a.prepend(e);
    }
    if (!document.getElementById("mobile-header-layout")) {
        const e = document.createElement("style");
        e.id = "mobile-header-layout", e.textContent = '\n            @media (max-width: 1023px) {\n                header > div:first-child {\n                    min-width: 0;\n                    gap: 10px;\n                    padding-left: 12px;\n                    padding-right: 12px;\n                }\n                header > div:first-child > div.flex.items-center.gap-2 {\n                    display: flex;\n                    align-items: center;\n                    justify-content: flex-end;\n                    flex: 0 0 auto;\n                    gap: 8px;\n                }\n                header > div:first-child > div:last-child { flex: 0 0 auto; }\n                header > div:first-child > a[href="index.html"] {\n                    min-width: 0;\n                    flex: 1 1 auto;\n                    overflow: hidden;\n                    display: flex;\n                }\n                header > div:first-child > a[href="index.html"] > div:last-child {\n                    min-width: 0;\n                    overflow: hidden;\n                }\n                header > div:first-child > a[href="index.html"] span {\n                    overflow: hidden;\n                    text-overflow: ellipsis;\n                    white-space: nowrap;\n                }\n                header > div:first-child > div.flex.items-center.gap-2 > button:not([data-lang-toggle]),\n                header > div:first-child > div.flex.items-center.gap-2 #mobile-menu-button {\n                    width: 48px;\n                    height: 48px;\n                    min-width: 48px;\n                    min-height: 48px;\n                    flex: 0 0 48px;\n                    padding: 0;\n                    display: inline-flex;\n                    align-items: center;\n                    justify-content: center;\n                    border: 1px solid rgb(73 91 125 / 0.3);\n                    border-radius: 9999px;\n                    background-color: rgb(255 255 255 / 0.5);\n                    color: #02122f;\n                }\n                header > div:first-child > a[href="index.html"] img { max-width: 100%; }\n                header > div:first-child > div.flex.items-center.gap-2 #mobile-menu-button svg {\n                    width: 21px;\n                    height: 21px;\n                }\n                .dark header > div:first-child > div.flex.items-center.gap-2 > button,\n                .dark header > div:first-child > div.flex.items-center.gap-2 #mobile-menu-button {\n                    border-color: #1e2a3d;\n                    background-color: #121929;\n                    color: #f0ecdd;\n                }\n                header > div:first-child > div.flex.items-center.gap-2 [data-lang-toggle] {\n                    width: 42px;\n                    min-width: 42px;\n                    height: 36px;\n                    min-height: 36px;\n                    flex: 0 0 42px;\n                    padding: 0;\n                    display: inline-flex;\n                    align-items: center;\n                    justify-content: center;\n                    font-size: 12px;\n                    line-height: 1;\n                }\n                header > div:first-child > div.flex.items-center.gap-2 svg {\n                    width: 21px;\n                    height: 21px;\n                    flex: 0 0 21px;\n                }\n            }\n            @media (max-width: 420px) {\n                header > div:first-child {\n                    gap: 6px;\n                    padding-left: 8px;\n                    padding-right: 8px;\n                }\n                header > div:first-child > div.flex.items-center.gap-2 { gap: 6px; }\n                header > div:first-child > a[href="index.html"] span { display: none; }\n                header > div:first-child > a[href="index.html"] > div:first-child { width: 56px; }\n                header > div:first-child > div.flex.items-center.gap-2 > button:not([data-lang-toggle]),\n                header > div:first-child > div.flex.items-center.gap-2 #mobile-menu-button {\n                    width: 46px;\n                    height: 46px;\n                    min-width: 46px;\n                    min-height: 46px;\n                    flex-basis: 46px;\n                }\n                header > div:first-child > div.flex.items-center.gap-2 svg {\n                    width: 20px;\n                    height: 20px;\n                    flex-basis: 20px;\n                }\n            }\n            @media (max-width: 340px) {\n                header > div:first-child > div.flex.items-center.gap-2 { gap: 4px; }\n                header > div:first-child > div.flex.items-center.gap-2 > button:not([data-lang-toggle]),\n                header > div:first-child > div.flex.items-center.gap-2 #mobile-menu-button {\n                    width: 44px;\n                    height: 44px;\n                    min-width: 44px;\n                    min-height: 44px;\n                    flex-basis: 44px;\n                }\n            }\n        ', 
        document.head.appendChild(e);
    }
    "en" === localStorage.getItem("language") && translatePage("en");
}

function processPendingProduct() {
    const e = localStorage.getItem("pendingProduct");
    e && (localStorage.removeItem("pendingProduct"), findCartItem(e, null) || (cart.push({
        name: e,
        m2: null
    }), saveCart(), showToast(`${e} teklif talebinize eklendi!`)));
}

function initCartDropdown() {
    const e = document.getElementById("cart-toggle"), t = document.getElementById("cart-dropdown");
    e && t && (e.addEventListener("click", e => {
        e.preventDefault(), e.stopPropagation(), t.classList.toggle("hidden"), updateCartDropdown();
    }), document.addEventListener("click", a => {
        t.contains(a.target) || e.contains(a.target) || t.classList.add("hidden");
    }));
}

function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
    const e = document.documentElement.classList.contains("dark");
    localStorage.setItem("darkMode", e);
}

function getFormM2() {
    const e = document.getElementById("form-m2");
    if (!e || !e.value) return null;
    const t = Number(e.value);
    return !Number.isNaN(t) && t > 0 ? t : null;
}

function quickAdd(e, t = !1) {
    let a = getFormM2();
    const n = sanitizeProductName(e);
    if (findCartItem(n, a)) return showToast(`${escapeHtml(n)} zaten teklif listesinde!`, "warning"), 
    void (t && (window.location.href = "teklif.html"));
    cart.push({
        name: n,
        m2: a
    }), saveCart(), updateCartUI(), showToast(`${escapeHtml(n)} teklif talebinize eklendi!`),
    t && (window.location.href = "teklif.html");
}

function removeFromCartByIndex(e) {
    e < 0 || e >= cart.length || (cart.splice(e, 1), saveCart(), updateCartUI());
}

function escapeHtml(e) {
    return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function formatM2Label(e) {
    return e ? `${e} m²` : "Ölçü girilmedi";
}

function updateCartDropdown() {
    const e = document.getElementById("cart-dropdown-items");
    e && (cart.length ? e.innerHTML = cart.map((e, t) => `\n        <div class="flex items-center justify-between gap-2 px-2 py-2 rounded-xl hover:bg-moonlight/60 dark:hover:bg-dark-bg transition">\n            <div class="min-w-0 flex-1">\n                <p class="text-sm font-semibold text-oxford-blue dark:text-moonlight truncate">${escapeHtml(e.name)}</p>\n                <p class="text-xs text-steel dark:text-frost-blue">${formatM2Label(e.m2)}</p>\n            </div>\n            <button type="button" onclick="removeFromCartByIndex(${t})" class="shrink-0 text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 px-2 py-1">Çıkar</button>\n        </div>\n    `).join("") : e.innerHTML = `\n            <p class="text-center text-sm text-steel/60 dark:text-frost-blue/60 py-6 px-2">\n                ${"en" === localStorage.getItem("language") ? translations["Henüz ürün eklemediniz."] : "Henüz ürün eklemediniz."}\n            </p>\n        `);
}

function updateCartPageList() {
    const e = document.getElementById("cart-items-container");
    if (e) {
        if (!cart.length) return e.innerHTML = '\n            <div class="text-center py-12 text-steel/60 dark:text-frost-blue/60">\n                <i data-lucide="info" class="mx-auto h-8 w-8 mb-2"></i>\n                <p class="text-sm font-medium">Teklif listeniz şu an boş.</p>\n                <p class="text-xs">Lütfen ürünlerimiz sayfasından ağ çeşidi seçin.</p>\n            </div>\n        ', 
        void ("undefined" != typeof lucide && lucide.createIcons());
        e.innerHTML = cart.map((e, t) => `\n        <div class="flex items-center justify-between rounded-2xl border border-steel/20 bg-moonlight/40 p-4 shadow-sm dark:bg-dark-bg dark:border-dark-border">\n            <div class="flex items-center gap-3">\n                <div class="h-10 w-10 bg-steel text-moonlight rounded-xl flex items-center justify-center"><i data-lucide="check-square" class="h-5 w-5"></i></div>\n                <div>\n                    <p class="font-bold text-oxford-blue text-sm leading-tight dark:text-moonlight">${escapeHtml(e.name)}</p>\n                    <p class="text-[11px] text-steel dark:text-frost-blue">${formatM2Label(e.m2)} / Antalya</p>\n                </div>\n            </div>\n            <button type="button" onclick="removeFromCartByIndex(${t})" class="rounded-full bg-white px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50 transition border border-red-200 dark:bg-dark-card dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20">Çıkar</button>\n        </div>\n    `).join(""), 
        "undefined" != typeof lucide && lucide.createIcons();
    }
}

function updateCartUI() {
    const e = document.getElementById("cart-count");
    e && (e.innerText = cart.length), document.querySelectorAll(".mobile-cart-count").forEach(e => {
        e.textContent = cart.length;
    }), updateCartDropdown(), updateCartPageList(), translatableLeafNodesCache = null, 
    translateDynamicContent();
}

function showToast(e, t = "success") {
    let a = document.getElementById("toast-container");
    a || (a = document.createElement("div"), a.id = "toast-container", a.className = "fixed top-24 right-6 z-50 flex flex-col gap-3", 
    document.body.appendChild(a));
    const n = document.createElement("div"), i = "success" === t ? "bg-green-600" : "bg-amber-500", l = "success" === t ? "check-circle" : "alert-circle", r = escapeHtml(e);
    n.className = `${i} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 transform translate-x-full transition-transform duration-300 ease-out`,
    n.innerHTML = `\n        <i data-lucide="${l}" class="h-5 w-5"></i>\n        <span class="font-medium text-sm">${r}</span>\n    `,
    a.appendChild(n), "undefined" != typeof lucide && lucide.createIcons(), setTimeout(() => n.classList.remove("translate-x-full"), 10), 
    setTimeout(() => {
        n.classList.add("translate-x-full"), setTimeout(() => n.remove(), 300);
    }, 3e3);
}