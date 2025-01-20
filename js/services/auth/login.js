import { state, API_URL } from "../../state/state.js";
import { escapeHTML } from "../../utils/utils.js";
import { renderPage, navigate } from "../../routes/index.js";
import Snackbar from '../../components/ui/Snackbar.mjs';



async function login(event) {
    event.preventDefault();

    const username = escapeHTML(document.getElementById("login-username").value.trim());
    const password = escapeHTML(document.getElementById("login-password").value);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const res = await response.json();
        if (response.ok) {
            state.token = res.data.token;
            state.user = res.data.userid;
            localStorage.setItem("token", state.token);
            localStorage.setItem("user", state.user);
            localStorage.setItem("refreshToken", res.data.refreshToken); // Save the refresh token
            navigate('/');
            renderPage();
        } else {
            Snackbar(res.message || "Error logging in.", 3000);
        }
    } catch (error) {
        Snackbar("Error logging in. Please try again.", 3000);
    }
}


export { login };