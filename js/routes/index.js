import { createNav, attachNavEventListeners } from "../components/navigation.js";
import { renderPageContent } from "./render.js";
import { state } from "../state/state.js";
import {FloatingActionButton} from "../components/ui/FAB.mjs";

async function loadContent(url) {
    const app = document.getElementById("app");
    
    // Clear previous content
    app.innerHTML = ""; 

    // Persist login state using sessionStorage
    state.token = sessionStorage.getItem("token") || localStorage.getItem("token") || null;  
    const isLoggedIn = !!state.token;
    console.log("User logged in:", isLoggedIn);

    // Create Main Content Section
    const main = document.createElement("main");
    main.id = "content"; // Page content will load here

    // Create Footer
    const footer = document.createElement("footer");
    const footerText = document.createElement("p");
    footerText.textContent = "© 2025 Zincate";
    footer.appendChild(footerText);

    FloatingActionButton("icon","g46hf",isLoggedIn,state.user);

    // Append all sections to the app container
    app.appendChild(createNav());
    app.appendChild(main);
    app.appendChild(footer);

    // Attach navigation event listeners
    attachNavEventListeners();

    // Load page content based on the route
    await renderPageContent(isLoggedIn, url, main);
}

// SPA Navigation Function (PushState)
function navigate(path) {
    if (!path) {
        console.error("🚨 navigate called with null or undefined!", new Error().stack);
        return;
    }
    console.log("Navigating to:", path);
    if (window.location.pathname !== path) {
        history.pushState(null, "", path);
        loadContent(path);
    }
}



// Cleanup event listeners on `pagehide` to support bfcache
window.addEventListener("pagehide", () => {
    document.removeEventListener("click", someHandler);  // Example of proper cleanup
});

// Restore session state if returning from bfcache
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        console.log("Restored from bfcache, refreshing session state");
        state.token = sessionStorage.getItem("token") || localStorage.getItem("token") || null;
    }
});

// Initial Render
async function renderPage() {
    await loadContent(window.location.pathname);
}

export { navigate, renderPage, loadContent };
