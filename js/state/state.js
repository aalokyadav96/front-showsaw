import { renderPage } from "../routes/index.js";

const API_URL = "http://localhost:4000/api"; // Adjust the URL as needed
const SOCK_URL = "ws://localhost:4000/ws"; // Adjust the URL as needed
const SRC_URL = "http://localhost:4000"; // Adjust the URL as needed
// const SRC_URL = "https://zincate.onrender.com/";
// const API_URL = "https://zincate.onrender.com/api";

// State management
const state = {
    token: sessionStorage.getItem("token") || localStorage.getItem("token") || null,
    userProfile: JSON.parse(sessionStorage.getItem("userProfile") || localStorage.getItem("userProfile")) || null,
    // user: JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user")) || null,
    user: JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user")) || null,
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

    // renderPage(); // Re-render after state change
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

// Restore session state when returning from bfcache
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        console.log("Restoring session state from bfcache...");
        state.token = sessionStorage.getItem("token") || localStorage.getItem("token");
        state.userProfile = JSON.parse(sessionStorage.getItem("userProfile") || localStorage.getItem("userProfile"));
        state.user = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user"));
    }
});

export { API_URL, SOCK_URL, SRC_URL, state, setState, clearState };

// const API_URL = "http://localhost:4000/api"; // Adjust the URL as needed
// const SOCK_URL = "ws://localhost:4000/ws"; // Adjust the URL as needed
// const SRC_URL = "http://localhost:4000"; // Adjust the URL as needed
// // const SRC_URL = "https://zincate.onrender.com/";
// // const API_URL = "https://zincate.onrender.com/api";

// // State management
// const state = {
//     token: sessionStorage.getItem("token") || localStorage.getItem("token") || null,
//     userProfile: JSON.parse(sessionStorage.getItem("userProfile") || localStorage.getItem("userProfile")) || null,
//     user: JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user")) || null,
// };

// /**
//  * Updates the application state and persists changes to storage.
//  * @param {Object} newState - The new state properties to merge.
//  * @param {boolean} persist - Whether to store the state in localStorage (default: false).
//  */
// function setState(newState, persist = false) {
//     Object.assign(state, newState);

//     // Store in sessionStorage or localStorage if needed
//     if (persist) {
//         if (newState.token) localStorage.setItem("token", newState.token);
//         if (newState.userProfile) localStorage.setItem("userProfile", JSON.stringify(newState.userProfile));
//         if (newState.user) localStorage.setItem("user", JSON.stringify(newState.user));
//     } else {
//         if (newState.token) sessionStorage.setItem("token", newState.token);
//         if (newState.userProfile) sessionStorage.setItem("userProfile", JSON.stringify(newState.userProfile));
//         if (newState.user) sessionStorage.setItem("user", JSON.stringify(newState.user));
//     }

//     renderPage(); // Re-render after state change
// }

// /**
//  * Clears the state and removes stored user data.
//  */
// function clearState() {
//     sessionStorage.clear();
//     localStorage.removeItem("token");
//     localStorage.removeItem("userProfile");
//     localStorage.removeItem("user");

//     state.token = null;
//     state.userProfile = null;
//     state.user = null;

//     renderPage(); // Ensure the UI updates after logout
// }

// // Restore session state when returning from bfcache
// window.addEventListener("pageshow", (event) => {
//     if (event.persisted) {
//         console.log("Restoring session state from bfcache...");
//         state.token = sessionStorage.getItem("token") || localStorage.getItem("token");
//         state.userProfile = JSON.parse(sessionStorage.getItem("userProfile") || localStorage.getItem("userProfile"));
//         state.user = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user"));
//     }
// });

// export { API_URL, SOCK_URL, SRC_URL, state, setState, clearState };

// // const API_URL = "http://localhost:4000/api"; // Adjust the URL as needed
// // const SOCK_URL = "ws://localhost:4000/ws"; // Adjust the URL as needed
// // const SRC_URL = "http://localhost:4000"; // Adjust the URL as needed
// // // const SRC_URL = "https://zincate.onrender.com/"; // Adjust the URL as needed
// // // const API_URL = "https://zincate.onrender.com/api"; // Adjust the URL as needed

// // // State management
// // const state = {
// //     token: localStorage.getItem("token"),
// //     userProfile: localStorage.getItem("userProfile"),
// //     user: localStorage.getItem("user"),
// // };


// // function setState(newState) {
// //     Object.assign(state, newState);
// //     // localStorage.setItem("token", state.token);
// //     renderPage(); // Re-render after state change
// // }


// // export { API_URL, SOCK_URL, SRC_URL, state, setState }