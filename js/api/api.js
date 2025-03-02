import { API_URL, SRC_URL, state, setState } from "../state/state.js";

/**
 * Makes an API request with authentication and handles errors.
 * @param {string} endpoint - The API endpoint (e.g., "/users")
 * @param {string} method - HTTP method (default: "GET")
 * @param {Object | FormData | null} body - Request body (default: null)
 * @param {Object} options - Additional fetch options (e.g., signal for aborting)
 * @returns {Promise<any>} - The parsed JSON response or throws an error
 */
// async function apiFetch(endpoint, method = "GET", body = null, options = {}) {
//     const fetchOptions = {
//         method,
//         headers: {
//             "Authorization": state.token ? `Bearer ${state.token}` : "",
//         },
//         body: body || undefined,
//         signal: options.signal, // Support for request aborting
//     };

//     // If body is JSON, add Content-Type
//     if (body && !(body instanceof FormData)) {
//         fetchOptions.headers["Content-Type"] = "application/json";
//         fetchOptions.body = JSON.stringify(body);
//     }

//     try {
//         const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

//         // Handle unauthorized (401) responses by refreshing the token
//         if (response.status === 401 && state.refreshToken) {
//             console.warn("Token expired, attempting to refresh...");
//             const refreshed = await refreshToken();
//             if (refreshed) {
//                 return apiFetch(endpoint, method, body, options); // Retry original request
//             } else {
//                 throw new Error("Session expired. Please log in again.");
//             }
//         }

//         // Process response
//         const text = await response.text();
//         const data = text ? JSON.parse(text) : null;
        
//         if (!response.ok) throw new Error(data?.message || "Unknown error");

//         return data;
//     } catch (error) {
//         console.error(`Error fetching ${endpoint}:`, error);
//         throw error;
//     }
// }

// async function apiFetch(endpoint, method = "GET", body = null, options = {}) {
//     const fetchOptions = {
//         method,
//         headers: {
//             "Authorization": state.token ? `Bearer ${state.token}` : "",
//         },
//         signal: options.signal, // Support for request aborting
//     };

//     // Check if body is provided and ensure it's properly formatted
//     if (body) {
//         if (body instanceof FormData) {
//             fetchOptions.body = body; // FormData is sent as is (don't set Content-Type)
//         } else if (typeof body === "object") {
//             fetchOptions.headers["Content-Type"] = "application/json";
//             fetchOptions.body = JSON.stringify(body); // Convert object to JSON
//         } else {
//             // If body is already a string (JSON.stringify was done before), send it as is
//             fetchOptions.headers["Content-Type"] = "application/json";
//             fetchOptions.body = body;
//         }
//     }

//     try {
//         const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

//         // Handle unauthorized (401) responses by refreshing the token
//         if (response.status === 401 && state.refreshToken) {
//             console.warn("Token expired, attempting to refresh...");
//             const refreshed = await refreshToken();
//             if (refreshed) {
//                 return apiFetch(endpoint, method, body, options); // Retry original request
//             } else {
//                 throw new Error("Session expired. Please log in again.");
//             }
//         }

//         // Process response
//         const text = await response.text();
//         const data = text ? JSON.parse(text) : null;
        
//         if (!response.ok) throw new Error(data?.message || "Unknown error");

//         return data;
//     } catch (error) {
//         console.error(`Error fetching ${endpoint}:`, error);
//         throw error;
//     }
// }

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

// import { API_URL, state } from "../state/state.js";

// async function apiFetch(endpoint, method = "GET", body = null, options = {}) {
//     // document.getElementById('loading').style.display = 'block';

//     const fetchOptions = {
//         method,
//         headers: {
//             "Authorization": `Bearer ${state.token}`,
//             // Do not set Content-Type for FormData
//         },
//         body: body || undefined,
//         signal: options.signal, // Include the signal for aborting
//     };

//     // If the body is FormData, remove Content-Type header
//     if (body instanceof FormData) {
//         delete fetchOptions.headers['Content-Type'];
//     }

//     try {
//         const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
//         if (response.ok) {
//             const text = await response.text(); // Get response as text
//             return text ? JSON.parse(text) : null; // Parse JSON if there's content
//         } else {
//             const errorData = await response.text(); // Get error message as text
//             throw new Error(errorData || 'Unknown error');
//         }
//     } catch (error) {
//         console.error(`Error fetching ${endpoint}:`, error);
//         throw error; // Rethrow for further handling
//     } finally {
//         // document.getElementById('loading').style.display = 'none';
//     }
// }

// export { apiFetch };