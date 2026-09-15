/**
 * Dr. Mohammed Elnaggar Clinic - Main JavaScript
 */

(function () {
    "use strict";

    // ===== DOM ELEMENTS =====
    const menuBtn = document.getElementById("menuBtn");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuOverlay = document.getElementById("menuOverlay");
    const iconO = document.getElementById("menuIconOpen");
    const iconC = document.getElementById("menuIconClose");
    const navbar = document.getElementById("navbar");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    // ===== MOBILE MENU =====
    function openMenu() {
        mobileMenu.classList.add("open");
        menuOverlay.classList.remove("hidden");
        iconO.classList.add("hidden");
        iconC.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        mobileMenu.classList.remove("open");
        menuOverlay.classList.add("hidden");
        iconO.classList.remove("hidden");
        iconC.classList.add("hidden");
        document.body.style.overflow = "";
    }

    if (menuBtn) menuBtn.addEventListener("click", openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);
    if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

    document.querySelectorAll(".mobile-nav-link").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    // ===== SCROLL PERFORMANCE (throttled with requestAnimationFrame) =====
    var isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

    var scrolling = false;

    function onScroll() {
        if (scrolling) return;
        scrolling = true;
        requestAnimationFrame(function () {
            handleNavbarScroll();
            updateActiveNav();
            if (!isTouchDevice) {
                handleParallax();
            }
            scrolling = false;
        });
    }

    // ===== NAVBAR SCROLL EFFECT =====
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }
    }

    window.addEventListener("scroll", onScroll);

    // ===== ACTIVE NAV LINK =====
    function updateActiveNav() {
        var currentSection = "";
        sections.forEach(function (section) {
            if (window.scrollY >= section.offsetTop - 100) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove("text-amber-400", "bg-amber-500/10");
            link.classList.add("text-gray-300");
            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("text-amber-400", "bg-amber-500/10");
                link.classList.remove("text-gray-300");
            }
        });
    }

    // ===== SCROLL ANIMATIONS =====
    var animationObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        }
    );

    document
        .querySelectorAll(
            ".fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .stagger-children"
        )
        .forEach(function (el) {
            animationObserver.observe(el);
        });

    // ===== COUNTER ANIMATION =====
    function animateCounter(element, target, duration) {
        var start = 0;
        var startTime = null;

        function update(currentTime) {
            if (!startTime) startTime = currentTime;
            var progress = Math.min((currentTime - startTime) / duration, 1);

            // Ease out cubic
            var easedProgress = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(easedProgress * target);

            element.textContent = "+" + current.toLocaleString("ar-EG");

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = "+" + target.toLocaleString("ar-EG");
            }
        }

        requestAnimationFrame(update);
    }

    var counterObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var counter = entry.target;
                    var target = parseInt(counter.getAttribute("data-target"));
                    if (target && !counter.classList.contains("counted")) {
                        counter.classList.add("counted");
                        animateCounter(counter, target, 2000);
                    }
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll("[data-counter]").forEach(function (el) {
        counterObserver.observe(el);
    });

    // ===== PARALLAX SCROLLING (desktop only) =====
    function handleParallax() {
        var scrolled = window.scrollY;
        var parallaxElements = document.querySelectorAll(".parallax-bg");

        parallaxElements.forEach(function (el) {
            var speed = el.getAttribute("data-speed") || 0.3;
            var yPos = -(scrolled * speed);
            el.style.transform = "translateY(" + yPos + "px)";
        });
    }

    // ===== HERO TEXT ROTATION =====
    function initTextRotation() {
        var rotatingTexts = document.querySelectorAll(".rotating-text");
        rotatingTexts.forEach(function (container) {
            var words = container.querySelectorAll(".word");
            if (words.length === 0) return;

            var currentIndex = 0;
            words[0].classList.add("active");

            setInterval(function () {
                words[currentIndex].classList.remove("active");
                currentIndex = (currentIndex + 1) % words.length;
                words[currentIndex].classList.add("active");
            }, 2500);
        });
    }

    initTextRotation();

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            var targetId = this.getAttribute("href");
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                var offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth",
                });
            }
        });
    });

    // ===== RIPPLE EFFECT ON BUTTONS =====
    document.querySelectorAll(".ripple").forEach(function (button) {
        button.addEventListener("click", function (e) {
            var rect = button.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            button.style.setProperty("--ripple-x", x + "px");
            button.style.setProperty("--ripple-y", y + "px");
        });
    });

    // ===== PRELOAD IMAGES =====
    function preloadImages() {
        var images = document.querySelectorAll("img[data-src]");
        images.forEach(function (img) {
            img.src = img.getAttribute("data-src");
            img.removeAttribute("data-src");
        });
    }

    window.addEventListener("load", preloadImages);

    // ===== BACK TO TOP BUTTON =====
    function createBackToTop() {
        var btn = document.createElement("button");
        btn.innerHTML =
            '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>';
        btn.className =
            "fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center opacity-0 invisible transition-all duration-300 hover:bg-amber-500/30 hover:scale-110 backdrop-blur-md";
        btn.id = "backToTop";
        btn.setAttribute("aria-label", "العودة للأعلى");
        document.body.appendChild(btn);

        var topScrolling = false;
        window.addEventListener("scroll", function () {
            if (topScrolling) return;
            topScrolling = true;
            requestAnimationFrame(function () {
                if (window.scrollY > 500) {
                    btn.style.opacity = "1";
                    btn.style.visibility = "visible";
                } else {
                    btn.style.opacity = "0";
                    btn.style.visibility = "hidden";
                }
                topScrolling = false;
            });
        });

        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    createBackToTop();

    // ===== TYPING EFFECT =====
    function typeWriter(element, text, speed) {
        var i = 0;
        element.textContent = "";

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // ===== MAGNETIC BUTTON EFFECT =====
    document.querySelectorAll(".magnetic-btn").forEach(function (btn) {
        btn.addEventListener("mousemove", function (e) {
            var rect = btn.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform =
                "translate(" + x * 0.3 + "px, " + y * 0.3 + "px)";
        });

        btn.addEventListener("mouseleave", function () {
            btn.style.transform = "translate(0, 0)";
        });
    });

    // ===== TILT EFFECT ON CARDS =====
    document.querySelectorAll(".tilt-card").forEach(function (card) {
        card.addEventListener("mousemove", function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / 20;
            var rotateY = (centerX - x) / 20;

            card.style.transform =
                "perspective(1000px) rotateX(" +
                rotateX +
                "deg) rotateY(" +
                rotateY +
                "deg) scale3d(1.05, 1.05, 1.05)";
        });

        card.addEventListener("mouseleave", function () {
            card.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
        });
    });

    // ===== REEL LIGHTBOX =====
    var reelModal = document.getElementById("reelModal");
    var reelModalFrame = document.getElementById("reelModalFrame");

    function openReel(src) {
        reelModalFrame.src = src;
        reelModal.classList.add("open");
        document.body.classList.add("modal-open");
    }

    function closeReel() {
        reelModal.classList.remove("open");
        reelModalFrame.src = "about:blank";
        document.body.classList.remove("modal-open");
    }

    document.querySelectorAll(".reel-card").forEach(function (card) {
        card.addEventListener("click", function () {
            var src = card.getAttribute("data-reel");
            if (src) openReel(src);
        });
    });

    document
        .querySelectorAll("[data-reel-close]")
        .forEach(function (el) {
            el.addEventListener("click", closeReel);
        });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && reelModal.classList.contains("open")) {
            closeReel();
        }
    });
})();
