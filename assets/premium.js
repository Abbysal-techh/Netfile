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

    const header = document.getElementById("site-header");
    if (!header) return;

    function updateHeader() {
        header.classList.toggle("is-scrolled", window.scrollY > 50);
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    document.addEventListener("scroll", updateHeader, { passive: true });

    updateHeader();
})();