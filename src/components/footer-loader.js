/**
 * Institutional Footer Loader
 */
document.addEventListener("DOMContentLoaded", () => {
    const footerContainer = document.getElementById("global-footer");
    if (!footerContainer) return;

    const pathname = window.location.pathname;
    const subdirectories = ["/report/", "/src/"];
    const isSubdirectory = subdirectories.some(subdir => {
        return pathname.includes(subdir) || pathname.endsWith(subdir.replace(/\/$/, ""));
    });

    const basePrefix = isSubdirectory ? "../" : "";
    const footerPath = basePrefix + "src/components/footer.html";

    fetch(footerPath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(html => {
            footerContainer.innerHTML = html;
        })
        .catch(err => console.error("Failed to load Institutional Footer:", err));
});
