/**
 * Bootstrap UI Shell Loader
 * Fetches components/header.html and injects it into #global-header
 * Manages path adjustments and Bootstrap component initialization
 */

document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("global-header");
    if (!headerContainer) return;

    const pathname = window.location.pathname;
    const subdirectories = ["/report/", "/src/"];
    const isSubdirectory = subdirectories.some(subdir => {
        return pathname.includes(subdir) || pathname.endsWith(subdir.replace(/\/$/, ""));
    });

    const basePrefix = isSubdirectory ? "../" : "";
    const headerPath = basePrefix + "src/components/header.html";

    fetch(headerPath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(html => {
            headerContainer.innerHTML = html;

            // 1. Path Adjustment Logic
            const links = headerContainer.querySelectorAll("a.nav-link, a.navbar-brand");
            links.forEach(link => {
                const originalHref = link.getAttribute("href");
                if (originalHref) {
                    const isRelative = !originalHref.startsWith("http") &&
                        !originalHref.startsWith("/") &&
                        !originalHref.startsWith("./") &&
                        !originalHref.startsWith("../") &&
                        !originalHref.startsWith("#");

                    if (isRelative) {
                        const newHref = basePrefix + originalHref;
                        link.setAttribute("href", newHref);

                        // Active State
                        if (pathname.includes(originalHref)) {
                            link.classList.add("active");
                        }
                    }
                }
            });

            // 2. Initialize Bootstrap Components (if needed)
            // Bootstrap's data-api usually handles this automatically if scripts are loaded.
            // But we might need to close offcanvas on link click for better mobile UX.
            const offcanvasElement = document.getElementById('offcanvasNavbar');
            if (offcanvasElement) {
                const offcanvasLinks = offcanvasElement.querySelectorAll('.nav-link');
                offcanvasLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                        if (bsOffcanvas) bsOffcanvas.hide();
                    });
                });
            }
        })
        .catch(err => console.error("Failed to load Bootstrap UI Shell:", err));
});
