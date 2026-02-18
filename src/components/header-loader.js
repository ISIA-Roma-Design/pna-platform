/**
 * Header Loader
 * Fetches components/header.html and injects it into #global-header
 * Adjusts paths based on current location depth.
 */

document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("global-header");
    if (!headerContainer) return;

    // Determine depth based on known subdirectories
    // This supports both local (/) and GitHub Pages (/repo-name/) paths
    // If the path contains specific subfolders, we are 1 level deep.
    // Otherwise, we assume we are at the root context.

    const pathname = window.location.pathname;

    // List of known first-level directories that contain HTML pages
    const subdirectories = ["/report/", "/src/"];

    // Check if current path contains any of these
    // Use a more robust check that works if the URL ends with the directory name without trailing slash
    const isSubdirectory = subdirectories.some(subdir => {
        return pathname.includes(subdir) || pathname.endsWith(subdir.replace(/\/$/, ""));
    });

    // If in subdirectory, we need to go up one level (../) to reach root resources
    const basePrefix = isSubdirectory ? "../" : "";

    // Special case: "components" should be reachable from root
    // But header-loader.js is likely loaded via a relative script tag in the HTML.
    // The fetch request is relative to the PAGE URL.
    const headerPath = basePrefix + "src/components/header.html";

    fetch(headerPath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(html => {
            headerContainer.innerHTML = html;

            // Fix links
            const links = headerContainer.querySelectorAll("cds-header-name, cds-header-nav-item, cds-side-nav-link");
            links.forEach(link => {
                const originalHref = link.getAttribute("href");
                if (originalHref) {
                    // Prepend prefix to all relative links
                    // Skip absolute links (http...), root-relative links (/...), and already relative links (./ or ../)
                    const isRelative = !originalHref.startsWith("http") &&
                        !originalHref.startsWith("/") &&
                        !originalHref.startsWith("./") &&
                        !originalHref.startsWith("../");

                    if (isRelative) {
                        const newHref = basePrefix + originalHref;
                        link.setAttribute("href", newHref);

                        // Set active state if current pathname matches the link
                        // Use a simple check: if pathname contains the original link's path
                        if (pathname.includes(originalHref)) {
                            link.setAttribute("active", "");
                        }
                    }
                }
            });

            // Initialize Menu Toggle
            const menuButton = headerContainer.querySelector("cds-header-menu-button");
            const sideNav = headerContainer.querySelector("cds-side-nav");

            if (menuButton && sideNav) {
                // Carbon Web Component emits a custom event when toggled
                menuButton.addEventListener("cds-header-menu-button-toggled", (event) => {
                    // event.detail.active contains the new state
                    const isActive = event.detail.active;
                    if (isActive) {
                        sideNav.setAttribute("expanded", "");
                    } else {
                        sideNav.removeAttribute("expanded");
                    }
                });
            }
        })
        .catch(err => console.error("Failed to load header:", err));
});
