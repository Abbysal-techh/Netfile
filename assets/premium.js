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
        ".premium-site main button[onclick^='quickAdd']:not(.product-card-btn), " +
        ".premium-site #modal-add-to-cart"
    ).forEach(function (button) {
        button.classList.add("btn-secondary");
    });

    document.querySelectorAll(
        ".premium-site main button[onclick^='showProductDetails']:not(.product-card-btn), " +
        ".premium-site button[onclick='closeProductModal()'], " +
        ".premium-site a[href^='https://wa.me']:not(.product-card-btn)"
    ).forEach(function (button) {
        button.classList.add("btn-ghost");
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