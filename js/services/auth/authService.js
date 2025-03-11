import { state } from "../../state/state.js";
import { renderPage } from "../../routes/index.js";
import { signup } from "./signup.js";
import { login } from "./login.js";


async function logout(skip) {
    if (!skip) {
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (!confirmLogout) return;
    }
    state.token = null;
    state.user = null;
    state.userProfile = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("refreshToken");
    renderPage();
}

export { login, signup, logout };