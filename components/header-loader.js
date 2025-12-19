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
    const subdirectories = ["/viz/", "/prototipo/", "/docs/", "/data/"];

    // Check if current path contains any of these
    const isSubdirectory = subdirectories.some(subdir => pathname.includes(subdir));

    // If in subdirectory, we need to go up one level (../) to reach root resources
    const basePrefix = isSubdirectory ? "../" : "";

    // Special case: "components" should be reachable from root
    // But header-loader.js is likely loaded via a relative script tag in the HTML.
    // The fetch request is relative to the PAGE URL.
    const headerPath = basePrefix + "components/header.html";

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
                    // Ensure we don't double-fix absolute links (starts with http or /)
                    if (!originalHref.startsWith("http") && !originalHref.startsWith("/")) {
                        link.setAttribute("href", basePrefix + originalHref);
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
