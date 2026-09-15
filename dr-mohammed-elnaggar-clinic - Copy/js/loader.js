/**
 * Dr. Mohammed Elnaggar Clinic - Page Loader
 */

(function () {
    "use strict";

    // Create loader element
    function createLoader() {
        var loader = document.createElement("div");
        loader.className = "page-loader";
        loader.id = "pageLoader";
        loader.innerHTML =
            '<div class="loader-spinner"></div>' +
            '<div class="loader-text">جاري التحميل...</div>';
        document.body.prepend(loader);
    }

    // Hide loader when page is ready
    function hideLoader() {
        var loader = document.getElementById("pageLoader");
        if (loader) {
            loader.classList.add("hidden");
            setTimeout(function () {
                loader.remove();
            }, 500);
        }
    }

    // Initialize
    createLoader();

    // Hide on load
    if (document.readyState === "complete") {
        hideLoader();
    } else {
        window.addEventListener("load", hideLoader);
    }

    // Fallback: hide after 3 seconds max
    setTimeout(hideLoader, 3000);
})();
