(function () {
    var header = document.getElementById("site-header");
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".nav-menu");

    /* Mobile nav */
    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            var expanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!expanded));
            menu.classList.toggle("is-open");
        });

        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                toggle.setAttribute("aria-expanded", "false");
                menu.classList.remove("is-open");
            });
        });
    }

    /* Header background on scroll */
    function onScroll() {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 60);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("load", onScroll);
    onScroll();

    /* Active nav link */
    var sections = document.querySelectorAll("section[id]");
    var navLinks = document.querySelectorAll(".nav-menu a");

    if (sections.length && navLinks.length) {
        window.addEventListener(
            "scroll",
            function () {
                var current = "";
                sections.forEach(function (section) {
                    var top = section.offsetTop - 120;
                    if (window.scrollY >= top) {
                        current = section.getAttribute("id");
                    }
                });
                navLinks.forEach(function (link) {
                    var href = link.getAttribute("href");
                    link.classList.toggle("is-active", href === "#" + current);
                });
            },
            { passive: true }
        );
    }

    /* Hero carousel */
    var slides = document.querySelectorAll("[data-slide]");
    var dotsContainer = document.querySelector("[data-carousel-dots]");

    if (!slides.length) return;

    var index = 0;
    var intervalMs = 5000;
    var timer;

    function goTo(i) {
        index = (i + slides.length) % slides.length;
        slides.forEach(function (slide, n) {
            slide.classList.toggle("is-active", n === index);
        });
        if (dotsContainer) {
            dotsContainer.querySelectorAll("button").forEach(function (dot, n) {
                dot.classList.toggle("is-active", n === index);
                dot.setAttribute("aria-selected", n === index ? "true" : "false");
            });
        }
    }

    function next() {
        goTo(index + 1);
    }

    function startAutoplay() {
        clearInterval(timer);
        timer = setInterval(next, intervalMs);
    }

    if (dotsContainer) {
        slides.forEach(function (_, n) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("role", "tab");
            dot.setAttribute("aria-label", "Slide " + (n + 1));
            dot.addEventListener("click", function () {
                goTo(n);
                startAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
    }

    goTo(0);
    startAutoplay();
})();
