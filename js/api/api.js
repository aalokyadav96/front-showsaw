import { API_URL, SRC_URL, state, setState } from "../state/state.js";

async function apiFetch(endpoint, method = "GET", body = null, options = {}) {
    const fetchOptions = {
        method,
        headers: {
            "Authorization": state.token ? `Bearer ${state.token}` : "",
        },
        signal: options.signal, // Support for request aborting
    };

    // Check if body is provided and ensure it's properly formatted
    if (body) {
        if (body instanceof FormData) {
            fetchOptions.body = body; // FormData is sent as is (don't set Content-Type)
        } else if (typeof body === "object") {
            fetchOptions.headers["Content-Type"] = "application/json";
            fetchOptions.body = JSON.stringify(body); // Convert object to JSON
        } else {
            // If body is already a string (JSON.stringify was done before), send it as is
            fetchOptions.headers["Content-Type"] = "application/json";
            fetchOptions.body = body;
        }
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

        if (response.status === 429) {
            console.warn("Too many Requests");
            return
        }
        
        // Handle unauthorized (401) responses by refreshing the token

        if (response.status === 401 && state.refreshToken) {
            console.warn("Token expired, attempting to refresh...");
            const refreshed = await refreshToken();
            if (refreshed) {
                return apiFetch(endpoint, method, body, options); // Retry original request
            } else {
                throw new Error("Session expired. Please log in again.");
            }
        }

        // Process response
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("404: Details not found");
            } else {
                throw new Error(data?.message || "Unknown error");
            }
        }

        return data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}



/**
 * Refreshes the access token using the stored refresh token.
 * @returns {Promise<boolean>} - True if token was refreshed successfully, otherwise false
 */
async function refreshToken() {
    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: state.refreshToken }),
        });

        if (!response.ok) {
            console.warn("Failed to refresh token. Logging out...");
            setState({ token: null, refreshToken: null, user: null });
            return false;
        }

        const res = await response.json();
        setState({ token: res.token }, true);
        console.log("Token refreshed successfully.");
        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        setState({ token: null, refreshToken: null, user: null });
        return false;
    }
}

export { apiFetch, API_URL, SRC_URL };
