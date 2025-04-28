import { createNav, attachNavEventListeners } from "../components/navigation.js";
import { renderPageContent } from "./render.js";
import { state } from "../state/state.js";
import { profileSVG, searchSVG, settingsSVG, placesSVG, coffeeSVG, calendarSVG, locaSVG, evaSVG, chatSVG, filterSVG, plusCircleSVG, liveStreamSVG } from "../components/svgs.js";
import RadarMenu from "../components/ui/RadarMenu.js";
import { createElement } from "../components/createElement.js";


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
        { text: "Events", action: () => navigate("/events"), svg: calendarSVG },
        { text: "Places", action: () => navigate("/places"), svg: placesSVG },
        { text: "Search", action: () => navigate("/search"), svg: searchSVG },
    ];

    if (isLoggedIn) {
        menuItems.push(
            { text: "Feed", action: () => navigate("/feed"), svg: coffeeSVG },
            { text: "Chat", action: () => navigate("/chat"), svg: chatSVG },
            { text: "Settings", action: () => navigate("/settings"), svg: settingsSVG },
            { text: "Profile", action: () => navigate("/profile"), svg: profileSVG },
            { text: "Eva", action: () => navigate("/create-event"), svg: evaSVG },
            { text: "Loca", action: () => navigate("/create-place"), svg: locaSVG },
            { text: "Artist", action: () => navigate("/create-artist"), svg: liveStreamSVG },
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
        baseAngle: 60,
        startAngle: 180
    });

    // xul.appendChild(createElement('li', {rel: `vtab${count}`, class:""}));

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
