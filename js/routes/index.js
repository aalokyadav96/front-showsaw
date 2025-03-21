import { createNav, attachNavEventListeners } from "../components/navigation.js";
import { renderPageContent } from "./render.js";
import { state } from "../state/state.js";
import RadarMenu from "../components/ui/RadarMenu.js";
// import { createProfileDropdown } from "../components/navigation.js";

async function loadContent(url) {
    const app = document.getElementById("app");
    app.innerHTML = ""; // Clear previous content

    state.token = sessionStorage.getItem("token") || localStorage.getItem("token") || null;
    const isLoggedIn = !!state.token;
    console.log("User logged in:", isLoggedIn);

    const main = document.createElement("main");
    main.id = "content";

    app.appendChild(createNav());
    app.appendChild(main);

    const menuItems = [
        { text: "Events", action: () => navigate("/events") },
        { text: "Places", action: () => navigate("/places") },
        { text: "Feed", action: () => navigate("/feed") },
        { text: "Search", action: () => navigate("/search") },
        { text: "Eva", action: () => navigate("/create-event") },
        { text: "Loca", action: () => navigate("/create-place") },
    ];

    if (isLoggedIn) {
        menuItems.push(
            { text: "Profile", action: () => navigate("/profile") },
            { text: "Settings", action: () => navigate("/settings") },
        );
    } else {
        menuItems.push(
            { text: "Login", action: () => navigate("/login") }
        );
    }

    const radarMenuElement = RadarMenu(menuItems, {
        buttonText: "+",
        menuSize: 300,
        radius: 100,
        baseAngle: 0,
        startAngle: 0
    });

    app.appendChild(radarMenuElement);

    attachNavEventListeners();
    await renderPageContent(isLoggedIn, url, main);
}

// SPA Navigation Function
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

// Initial Render
async function renderPage() {
    await loadContent(window.location.pathname);
}

export { navigate, renderPage, loadContent };
