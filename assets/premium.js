(function () {
    document.querySelectorAll(
        ".premium-site main div.rounded-2xl.border[class*='bg-white'], " +
        ".premium-site main div.rounded-3xl.border[class*='bg-white'], " +
        ".premium-site main .contact-card, " +
        ".premium-site main article, " +
        ".premium-site main > div.text-center"
    ).forEach(function (card) {
        card.classList.add("premium-card");
    });

    document.querySelectorAll(
        ".premium-site a[href='teklif.html'].rounded-full, " +
        ".premium-site main button[type='submit']"
    ).forEach(function (button) {
        button.classList.add("btn-primary");
    });

    document.querySelectorAll(
        ".premium-site main button[onclick^='quickAdd'], " +
        ".premium-site #modal-add-to-cart"
    ).forEach(function (button) {
        button.classList.add("btn-secondary");
    });

    document.querySelectorAll(
        ".premium-site main button[onclick^='showProductDetails'], " +
        ".premium-site button[onclick='closeProductModal()'], " +
        ".premium-site a[href^='https://wa.me']"
    ).forEach(function (button) {
        button.classList.add("btn-ghost");
    });

    document.querySelectorAll(".premium-site main button[onclick^='quickAdd']").forEach(function (quickAdd) {
        const card = quickAdd.closest(".premium-card");
        const actions = quickAdd.parentElement;
        if (!card || !actions) return;

        card.classList.add("premium-product-card");
        actions.classList.add("premium-product-actions");

        const details = actions.querySelector("button[onclick^='showProductDetails']");
        if (details) {
            details.classList.add("btn-ghost");
            details.textContent = "İncele";
        }

        quickAdd.classList.add("premium-add-icon");
        quickAdd.setAttribute("aria-label", "Teklif listesine ekle");
        quickAdd.setAttribute("title", "Teklif listesine ekle");
        quickAdd.innerHTML = '<span aria-hidden="true">+</span>';
        card.appendChild(quickAdd);

        let offer = actions.querySelector("a[data-premium-offer]");
        if (!offer) {
            offer = document.createElement("a");
            offer.href = "teklif.html";
            offer.dataset.premiumOffer = "true";
            offer.textContent = "Teklif Al";
            actions.appendChild(offer);
        }
        offer.classList.add("btn-primary");
    });

    document.querySelectorAll(".premium-site main > section.relative").forEach(function (section) {
        if (!section.querySelector("img") || !section.querySelector("h1")) return;
        section.classList.add("premium-hero");
        document.body.classList.add("premium-has-hero");
        section.querySelectorAll("div.absolute.inset-0[class*='bg-oxford-blue']").forEach(function (overlay) {
            overlay.classList.add("premium-hero-overlay");
        });
    });

    const header = document.getElementById("site-header");
    if (!header) return;

    function updateHeader() {
        header.classList.toggle("is-scrolled", window.scrollY > 50);
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    document.addEventListener("scroll", updateHeader, { passive: true });

    updateHeader();
})();