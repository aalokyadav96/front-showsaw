import { API_URL, setState } from "../../state/state.js";
import { escapeHTML } from "../../utils/utils.js";
import { renderPage, navigate } from "../../routes/index.js";
import Snackbar from "../../components/ui/Snackbar.mjs";

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
            // Store tokens & user data securely
            setState(
                {
                    token: res.data.token,
                    user: res.data.userid,
                    refreshToken: res.data.refreshToken,
                },
                true // Persist in localStorage
            );

            navigate("/");
            renderPage();
            Snackbar("Login successful!", 2000);
        } else {
            Snackbar(res.message || "Invalid credentials.", 3000);
        }
    } catch (error) {
        Snackbar("Network error. Please try again.", 3000);
    }
}

export { login };