/**
 * Carbon UI Shell Loader
 * Fetches components/header.html and injects it into #global-header
 * Manages Shell state and path adjustments
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

            const shell = headerContainer;
            const menuButton = shell.querySelector("cds-header-menu-button");
            const sideNav = shell.querySelector("cds-side-nav");

            // 1. Path Adjustment Logic
            const links = shell.querySelectorAll("cds-header-name, cds-header-nav-item, cds-side-nav-link, cds-side-nav-menu-item");
            links.forEach(link => {
                const originalHref = link.getAttribute("href");
                if (originalHref) {
                    const isRelative = !originalHref.startsWith("http") &&
                        !originalHref.startsWith("/") &&
                        !originalHref.startsWith("./") &&
                        !originalHref.startsWith("../");

                    if (isRelative) {
                        const newHref = basePrefix + originalHref;
                        link.setAttribute("href", newHref);

                        // Active State
                        if (pathname.includes(originalHref)) {
                            link.setAttribute("active", "");
                        }
                    }
                }
            });

            // 2. Shell Interaction Logic (Toggling SideNav on mobile)
            if (menuButton && sideNav) {
                // Initial visibility for mobile
                if (window.innerWidth < 1056) {
                    sideNav.removeAttribute("expanded");
                }

                menuButton.addEventListener("cds-header-menu-button-toggled", (event) => {
                    const { active } = event.detail;
                    if (active) {
                        sideNav.setAttribute("expanded", "");
                    } else {
                        sideNav.removeAttribute("expanded");
                    }
                });

                // Close SideNav when clicking a link on mobile
                sideNav.addEventListener("click", (event) => {
                    const target = event.target.closest("cds-side-nav-link");
                    if (target && window.innerWidth < 1056) {
                        sideNav.removeAttribute("expanded");
                        menuButton.setAttribute("active", "false");
                    }
                });
            }

            // Sync SideNav state on resize
            window.addEventListener("resize", () => {
                if (window.innerWidth >= 1056) {
                    sideNav.setAttribute("expanded", "");
                } else if (!menuButton.hasAttribute("active") || menuButton.getAttribute("active") === "false") {
                    sideNav.removeAttribute("expanded");
                }
            });

        })
        .catch(err => console.error("Failed to load Carbon UI Shell:", err));
});
