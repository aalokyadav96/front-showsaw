import { loadContent } from "./routes/index.js";

// Initialize the page load based on the current URL
function init() {
    // Load the content based on the current URL when the page is first loaded
    loadContent(window.location.pathname);

    // Listen for browser back/forward navigation
    window.addEventListener("popstate", () => {
        if (!document.hidden) {
            loadContent(window.location.pathname);
        }
    });

    // Detect if page is restored from bfcache and prevent unnecessary reload
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            console.log("Page restored from bfcache, skipping reload");
        }
    });
}

// Start the app
init();