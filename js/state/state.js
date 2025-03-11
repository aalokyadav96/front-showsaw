import { renderPage } from "../routes/index.js";

/******* */


const API_URL    = "http://localhost:4000/api";
const SRC_URL    = "http://localhost:4000/static";
// const SOCK_URL   = "ws://localhost:4000/ws";
const SEARCH_URL = API_URL;
const AGI_URL       = "http://localhost:5000/api";

// const SRC_URL       = "https://zincate.onrender.com/static";
// const API_URL       = "https://zincate.onrender.com/api";
// const SEARCH_URL    = "https://zincate.onrender.com/api";

// const API_URL = "/api"; // Adjust the URL as needed
// const SRC_URL = "/static"; // Adjust the URL as needed
// const SEARCH_URL = "/api"; // Adjust the URL as needed


/*********** */


// const AGI_URL = "http://localhost:5000/api"; // Adjust the URL as needed
// const API_URL = "http://localhost:4000/api"; // Adjust the URL as needed
// const SRC_URL = "http://localhost:4000/static"; // Adjust the URL as needed

// State management
const state = {
    token: sessionStorage.getItem("token") || localStorage.getItem("token") || null,
    userProfile: JSON.parse(sessionStorage.getItem("userProfile") || localStorage.getItem("userProfile")) || null,
    user: JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user")) || null,
    lastPath: window.location.pathname // Store last visited path to prevent redundant re-renders
};

/**
 * Updates the application state and persists changes to storage.
 * @param {Object} newState - The new state properties to merge.
 * @param {boolean} persist - Whether to store the state in localStorage (default: false).
 */
function setState(newState, persist = false) {
    Object.assign(state, newState);

    // Store in sessionStorage or localStorage if needed
    if (persist) {
        if (newState.token) localStorage.setItem("token", newState.token);
        if (newState.userProfile) localStorage.setItem("userProfile", JSON.stringify(newState.userProfile));
        if (newState.user) localStorage.setItem("user", JSON.stringify(newState.user));
    } else {
        if (newState.token) sessionStorage.setItem("token", newState.token);
        if (newState.userProfile) sessionStorage.setItem("userProfile", JSON.stringify(newState.userProfile));
        if (newState.user) sessionStorage.setItem("user", JSON.stringify(newState.user));
    }
}

/**
 * Clears the state and removes stored user data.
 */
function clearState() {
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("user");

    state.token = null;
    state.userProfile = null;
    state.user = null;

    renderPage(); // Ensure the UI updates after logout
}

/**
 * Prevents redundant re-renders on back/forward navigation.
 */
window.addEventListener("popstate", () => {
    if (window.location.pathname !== state.lastPath) {
        console.log("🔄 Back/Forward navigation detected, updating content...");
        state.lastPath = window.location.pathname;
        renderPage(); // Load the new content only if the path changes
    }
});

/**
 * Restores session state when returning from bfcache.
 */
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        console.log("Restoring session state from bfcache...");
        state.token = sessionStorage.getItem("token") || localStorage.getItem("token");
        state.userProfile = JSON.parse(sessionStorage.getItem("userProfile") || localStorage.getItem("userProfile"));
        state.user = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user"));

        if (window.location.pathname !== state.lastPath) {
            state.lastPath = window.location.pathname;
            renderPage(); // Ensure content updates properly
        }
    }
});

export { API_URL, AGI_URL, SRC_URL, SEARCH_URL, state, setState, clearState };
