/**
 * page-transitions.js
 * Handles smooth fade-in/out transitions between pages.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial fade-in when page loads
    document.body.style.opacity = "0";
    // Force a reflow
    void document.body.offsetWidth;
    document.body.style.transition = "opacity 0.4s ease-in-out";
    document.body.style.opacity = "1";

    // 2. Intercept internal link clicks for fade-out
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");

        // Only handle internal links that are not:
        // - target="_blank"
        // - jumping to an anchor on the same page (#)
        // - external URLs (http/https on different domain)
        // - download links
        // - javascript: links
        if (link && 
            link.href && 
            !link.target && 
            !link.download &&
            link.href.includes(window.location.origin) &&
            !link.getAttribute("href").startsWith("#") &&
            !link.getAttribute("href").startsWith("javascript:") &&
            !e.ctrlKey && !e.shiftKey && !e.metaKey && e.button === 0 // Standard left click
        ) {
            e.preventDefault();
            const targetUrl = link.href;

            // Trigger fade out
            document.body.classList.add("fade-out");

            // Wait for transition to complete before navigating
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400); // Matches CSS transition duration
        }
    });

    // 3. Handle back button (pageshow event ensures visibility)
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            document.body.classList.remove("fade-out");
            document.body.style.opacity = "1";
        }
    });
});
