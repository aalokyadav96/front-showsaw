import { createNav, attachNavEventListeners } from "../components/navigation.js";
import { renderPageContent } from "./render.js";
import { state } from "../state/state.js";
import RadarMenu from "../components/ui/RadarMenu.js";
// import { profileSVG, searchSVG, liveStreamSVG, chatSVG, heartSVG, moonSVG, settingsSVG, downloadSVG, playSVG, PauseSVG, playCropSVG, headphonesSVG, imageSVG, filterSVG } from "../components/svgs.js";
import { profileSVG, searchSVG, settingsSVG, placesSVG, coffeeSVG, calendarSVG, locaSVG, evaSVG, chatSVG, filterSVG } from "../components/svgs.js";
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

    const menuItems = [];

    if (isLoggedIn) {
        menuItems.push(
            { text: "Eva", action: () => navigate("/create-event"), svg: evaSVG },
            { text: "Loca", action: () => navigate("/create-place"), svg: locaSVG },
            { text: "Artist", action: () => navigate("/create-artist"), svg: filterSVG },
        );
    } else {
        menuItems.push(
            { text: "Login", action: () => navigate("/login"), svg: "" }
        );
    }

    const radarMenuElement = RadarMenu(menuItems, {
        buttonText: "+",
        menuSize: 320,
        radius: 120,
        baseAngle: 0,
        startAngle: 0
    });

    app.appendChild(radarMenuElement);

    attachNavEventListeners();
    await renderPageContent(isLoggedIn, url, main);
}

// SPA Navigation Function
function navigate(path) {
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
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
