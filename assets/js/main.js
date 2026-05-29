(function () {
    var header = document.getElementById("site-header");
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("nav-menu");
    var backdrop = document.getElementById("nav-backdrop");
    var mobileQuery = window.matchMedia("(max-width: 720px)");

    function isMobileNav() {
        return mobileQuery.matches;
    }

    function setMenuOpen(open) {
        if (!toggle || !menu) return;

        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        menu.classList.toggle("is-open", open);
        document.body.classList.toggle("nav-open", open);

        if (header) {
            header.classList.toggle("menu-open", open);
        }

        if (backdrop) {
            backdrop.hidden = !open;
            backdrop.setAttribute("aria-hidden", open ? "false" : "true");
        }
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    /* Mobile nav */
    if (toggle && menu) {
        toggle.addEventListener("click", function (e) {
            e.stopPropagation();
            var isOpen = toggle.getAttribute("aria-expanded") === "true";
            setMenuOpen(!isOpen);
        });

        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                closeMenu();
            });
        });

        if (backdrop) {
            backdrop.addEventListener("click", closeMenu);
        }

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                closeMenu();
            }
        });

        mobileQuery.addEventListener("change", function () {
            if (!isMobileNav()) {
                closeMenu();
            }
        });
    }

    /* Header background on scroll (desktop); mobile header stays solid via CSS */
    function onScroll() {
        if (!header) return;
        if (isMobileNav()) {
            header.classList.add("is-scrolled");
            return;
        }
        header.classList.toggle("is-scrolled", window.scrollY > 60);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("load", onScroll);
    window.addEventListener("resize", onScroll);
    onScroll();

    /* Active nav link */
    var sections = document.querySelectorAll("section[id]");
    var navLinks = document.querySelectorAll(".nav-menu a");

    if (sections.length && navLinks.length) {
        window.addEventListener(
            "scroll",
            function () {
                var current = "";
                var offset = isMobileNav() ? 80 : 120;

                sections.forEach(function (section) {
                    var top = section.offsetTop - offset;
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

    if (slides.length) {
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
    }
})();
