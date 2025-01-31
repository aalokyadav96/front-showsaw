const API_URL = "http://localhost:4000/api"; // Adjust the URL as needed
const SOCK_URL = "ws://localhost:4000/ws"; // Adjust the URL as needed
const SRC_URL = "http://localhost:4000"; // Adjust the URL as needed
// const SRC_URL = "https://zincate.onrender.com/"; // Adjust the URL as needed
// const API_URL = "https://zincate.onrender.com/api"; // Adjust the URL as needed

// State management
const state = {
    token: localStorage.getItem("token"),
    userProfile: localStorage.getItem("userProfile"),
    user: localStorage.getItem("user"),
};


function setState(newState) {
    Object.assign(state, newState);
    // localStorage.setItem("token", state.token);
    renderPage(); // Re-render after state change
}


export { API_URL, SOCK_URL, SRC_URL, state, setState }