import { state, API_URL } from "../../state/state.js";
import { escapeHTML, validateInputs, isValidUsername, isValidEmail, isValidPassword } from "../../utils/utils.js";
import { renderPage, navigate } from "../../routes/index.js";
import Snackbar from '../../components/ui/Snackbar.mjs';




async function signup(event) {
    event.preventDefault(); // Prevent default form submission

    const username = escapeHTML(document.getElementById("signup-username").value.trim());
    const email = escapeHTML(document.getElementById("signup-email").value.trim());
    const password = escapeHTML(document.getElementById("signup-password").value);

    const errors = validateInputs([
        { value: username, validator: isValidUsername, message: "Username must be between 3 and 20 characters." },
        { value: email, validator: isValidEmail, message: "Please enter a valid email." },
        { value: password, validator: isValidPassword, message: "Password must be at least 6 characters long." },
    ]);

    if (errors) {
        Snackbar(errors, 3000);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            Snackbar("Signup successful! You can now log in.", 3000);
            navigate('/login');
            renderPage();
        } else {
            Snackbar(data.message || "Error signing up.", 3000);
        }
    } catch (error) {
        Snackbar("Error signing up. Please try again.", 3000);
    }
}


export { signup };