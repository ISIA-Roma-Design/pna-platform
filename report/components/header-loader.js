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
    const assetsPrefix = isSubdirectory ? "assets/" : "report/assets/";
    const headerPath = isSubdirectory ? "components/header.html" : "report/components/header.html";

    // Global Page Transitions Injection
    if (!document.getElementById('pna-transition-script')) {
        const transitionScript = document.createElement("script");
        transitionScript.id = 'pna-transition-script';
        // Try local report/assets if the first path fails, or use current assetsPrefix
        transitionScript.src = assetsPrefix + "page-transitions.js";
        document.body.appendChild(transitionScript);
    }

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

            // 2. Smart Sticky Header Logic
            const navbar = headerContainer.querySelector('.main-navbar');
            if (navbar) {
                let lastScrollTop = 0;
                navbar.style.transition = 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
                
                window.addEventListener('scroll', () => {
                    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    // Hide on scroll down, show on scroll up
                    // Threshold of 100px to avoid hiding on initial small scrolls
                    if (scrollTop > lastScrollTop && scrollTop > 100) {
                        navbar.style.transform = 'translateY(-100%)';
                    } else {
                        navbar.style.transform = 'translateY(0)';
                    }
                    lastScrollTop = Math.max(0, scrollTop); // Avoid negative values on bounce
                }, { passive: true });
            }

            // 3. Initialize Bootstrap Components (if needed)
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
