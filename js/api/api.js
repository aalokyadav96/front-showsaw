import { API_URL, SRC_URL, state, setState } from "../state/state.js";
// Replace this with your actual API base URL

// let state = {
//     token: "",           // Set on login
//     refreshToken: "",    // Set on login
// };

async function apiFetch(endpoint, method = "GET", body = null, options = {}) {
    const controller = options.controller || new AbortController();
    const signal = controller.signal;
    const fullUrl = `${API_URL}${endpoint}`;

    return apixFetch(fullUrl, method, body, { ...options, signal });
}

async function apixFetch(endpoint, method = "GET", body = null, options = {}) {
    const fetchOptions = {
        method,
        headers: {
            "Authorization": state.token ? `Bearer ${state.token}` : "",
        },
        signal: options.signal,
    };

    if (body) {
        if (body instanceof FormData) {
            fetchOptions.body = body;
        } else {
            fetchOptions.headers["Content-Type"] = "application/json";
            fetchOptions.body = JSON.stringify(body);
        }
    }

    try {
        const response = await fetch(endpoint, fetchOptions);

        if (response.status === 429) {
            console.warn("Too many requests");
            return;
        }

        if (response.status === 401 && state.refreshToken) {
            console.warn("Token expired, attempting to refresh...");
            const refreshed = await refreshToken();
            if (refreshed) {
                return apixFetch(endpoint, method, body, options); // use apixFetch to avoid infinite loop
            } else {
                throw new Error("Session expired. Please log in again.");
            }
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
        }

        switch (options.responseType) {
            case "blob": return response;
            case "arrayBuffer": return await response.arrayBuffer();
            case "text": return await response.text();
            case "stream": return response.body;
            default:
                const text = await response.text();
                return text ? JSON.parse(text) : null;
        }

    } catch (error) {
        if (error.name === "AbortError") {
            console.warn("Fetch aborted:", endpoint);
            return;
        }
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

// Dummy refresh function (replace with actual logic)
async function refreshToken() {
    // Perform refresh token request
    console.log("Refreshing token...");
    return false; // Simulate failed refresh
}


// async function apiFetch(endpoint, method = "GET", body = null, options = {}) {
//     const controller = options.controller || new AbortController();
//     const signal = controller.signal;

//     const fullUrl = `${API_URL}${endpoint}`;
//     return apixFetch(fullUrl, method, body, { ...options, signal });
// }

// async function apixFetch(endpoint, method = "GET", body = null, options = {}) {
//     const fetchOptions = {
//         method,
//         headers: {
//             "Authorization": state.token ? `Bearer ${state.token}` : "",
//         },
//         signal: options.signal,
//     };

//     if (body) {
//         if (body instanceof FormData) {
//             fetchOptions.body = body;
//         } else if (typeof body === "object") {
//             fetchOptions.headers["Content-Type"] = "application/json";
//             fetchOptions.body = JSON.stringify(body);
//         } else {
//             fetchOptions.headers["Content-Type"] = "application/json";
//             fetchOptions.body = body;
//         }
//     }

//     try {
//         const response = await fetch(endpoint, fetchOptions);

//         if (response.status === 429) {
//             console.warn("Too many requests");
//             return;
//         }

//         if (response.status === 401 && state.refreshToken) {
//             console.warn("Token expired, attempting to refresh...");
//             const refreshed = await refreshToken();
//             if (refreshed) {
//                 return apiFetch(endpoint, method, body, options);
//             } else {
//                 throw new Error("Session expired. Please log in again.");
//             }
//         }

//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(errorText || `HTTP ${response.status}`);
//         }

//         // Handle supported response types
//         switch (options.responseType) {
//             case 'blob':
//                 return response; // caller handles .blob()
//             case 'arrayBuffer':
//                 return await response.arrayBuffer();
//             case 'text':
//                 return await response.text();
//             case 'stream':
//                 return response.body; // caller must handle ReadableStream
//             default:
//                 // default to JSON
//                 const text = await response.text();
//                 return text ? JSON.parse(text) : null;
//         }

//     } catch (error) {
//         if (error.name === "AbortError") {
//             console.warn("Fetch aborted:", endpoint);
//             return;
//         }

//         console.error(`Error fetching ${endpoint}:`, error);
//         throw error;
//     }
// }


/**********Usage Examples***********/
// // Blob (PDF, image, etc.)
// const blobResponse = await apiFetch('/file', 'GET', null, { responseType: 'blob' });
// const blob = await blobResponse.blob();

// // ArrayBuffer (binary processing)
// const buffer = await apiFetch('/audio.raw', 'GET', null, { responseType: 'arrayBuffer' });

// // Plain text
// const text = await apiFetch('/textfile.txt', 'GET', null, { responseType: 'text' });

// // Stream (advanced use)
// const stream = await apiFetch('/bigdata', 'GET', null, { responseType: 'stream' });


// import { API_URL, state } from "../state/state.js";

// async function apiFetch(endpoint, method = "GET", body = null, options = {}) {
//     const controller = options.controller || new AbortController();
//     const signal = controller.signal;

//     const fullUrl = `${API_URL}${endpoint}`;
//     return apixFetch(fullUrl, method, body, { ...options, signal });
// }

// async function apixFetch(endpoint, method = "GET", body = null, options = {}) {
//     const fetchOptions = {
//         method,
//         headers: {
//             "Authorization": state.token ? `Bearer ${state.token}` : "",
//         },
//         signal: options.signal,
//     };

//     // Handle request body
//     if (body) {
//         if (body instanceof FormData) {
//             fetchOptions.body = body;
//         } else if (typeof body === "object") {
//             fetchOptions.headers["Content-Type"] = "application/json";
//             fetchOptions.body = JSON.stringify(body);
//         } else {
//             fetchOptions.headers["Content-Type"] = "application/json";
//             fetchOptions.body = body;
//         }
//     }

//     try {
//         const response = await fetch(endpoint, fetchOptions);

//         // Handle rate limit
//         if (response.status === 429) {
//             console.warn("Too many requests");
//             return;
//         }

//         // Handle token refresh
//         if (response.status === 401 && state.refreshToken) {
//             console.warn("Token expired, attempting to refresh...");
//             const refreshed = await refreshToken();
//             if (refreshed) {
//                 return apiFetch(endpoint, method, body, options);
//             } else {
//                 throw new Error("Session expired. Please log in again.");
//             }
//         }

//         // Throw if response is not OK
//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(errorText || `HTTP ${response.status}`);
//         }

//         // --- Response type handling ---
//         if (options.responseType === 'blob') {
//             return response; // Caller must handle response.blob()
//         }

//         if (options.responseType === 'arrayBuffer') {
//             return await response.arrayBuffer();
//         }

//         // Default: assume JSON/text
//         const text = await response.text();
//         return text ? JSON.parse(text) : null;

//     } catch (error) {
//         if (error.name === "AbortError") {
//             console.warn("Fetch aborted:", endpoint);
//             return;
//         }

//         console.error(`Error fetching ${endpoint}:`, error);
//         throw error;
//     }
// }

// export { apiFetch };

// // import { API_URL, SRC_URL, state, setState } from "../state/state.js";

// // async function apiFetch(endpoint, method = "GET", body = null, options = {}) {
// //     const controller = options.controller || new AbortController(); // allow external controller
// //     const signal = controller.signal;
    
// //     let endpointx = `${API_URL}${endpoint}`;
// //     return apixFetch(endpointx, method, body, { ...options, signal });
// // }

// // async function apixFetch(endpoint, method = "GET", body = null, options = {}) {
// //     const fetchOptions = {
// //         method,
// //         headers: {
// //             "Authorization": state.token ? `Bearer ${state.token}` : "",
// //         },
// //         signal: options.signal, // Add abort signal support
// //     };

// //     // Handle body formatting
// //     if (body) {
// //         if (body instanceof FormData) {
// //             fetchOptions.body = body;
// //         } else if (typeof body === "object") {
// //             fetchOptions.headers["Content-Type"] = "application/json";
// //             fetchOptions.body = JSON.stringify(body);
// //         } else {
// //             fetchOptions.headers["Content-Type"] = "application/json";
// //             fetchOptions.body = body;
// //         }
// //     }

// //     try {
// //         const response = await fetch(endpoint, fetchOptions);

// //         if (response.status === 429) {
// //             console.warn("Too many Requests");
// //             return;
// //         }

// //         if (response.status === 401 && state.refreshToken) {
// //             console.warn("Token expired, attempting to refresh...");
// //             const refreshed = await refreshToken();
// //             if (refreshed) {
// //                 return apiFetch(endpoint, method, body, options); // Retry after refresh
// //             } else {
// //                 throw new Error("Session expired. Please log in again.");
// //             }
// //         }

// //         const text = await response.text();
// //         const data = text ? JSON.parse(text) : null;

// //         if (!response.ok) {
// //             if (response.status === 404) {
// //                 throw new Error("404: Details not found");
// //             } else {
// //                 throw new Error(data?.message || "Unknown error");
// //             }
// //         }

// //         return data;
// //     } catch (error) {
// //         if (error.name === "AbortError") {
// //             console.warn("Fetch aborted:", endpoint);
// //             return; // Optional: return or throw depending on desired behavior
// //         }

// //         console.error(`Error fetching ${endpoint}:`, error);
// //         throw error;
// //     }
// // }

// async function refreshToken() {
//     try {
//         const response = await fetch(`${API_URL}/auth/refresh`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ refreshToken: state.refreshToken }),
//         });

//         if (!response.ok) {
//             console.warn("Failed to refresh token. Logging out...");
//             setState({ token: null, refreshToken: null, user: null });
//             return false;
//         }

//         const res = await response.json();
//         setState({ token: res.token }, true);
//         console.log("Token refreshed successfully.");
//         return true;
//     } catch (error) {
//         console.error("Error refreshing token:", error);
//         setState({ token: null, refreshToken: null, user: null });
//         return false;
//     }
// }

export { apiFetch, API_URL, SRC_URL, apixFetch };


/******Usage Example***** */
// // Create controller
// const controller = new AbortController();

// // Start request
// apiFetch("/search?q=test", "GET", null, { controller })
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

// // Abort after 1 second
// setTimeout(() => {
//     controller.abort();
// }, 1000);

/********** */

// import { API_URL, SRC_URL, state, setState } from "../state/state.js";

// async function apiFetch(endpoint, method = "GET", body = null, options = {}) {
//     let endpointx =  `${API_URL}${endpoint}`;
//     return apixFetch(endpointx, method, body, options);
// }

// async function apixFetch(endpoint, method = "GET", body = null, options = {}) {
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
//         const response = await fetch(`${endpoint}`, fetchOptions);

//         if (response.status === 429) {
//             console.warn("Too many Requests");
//             return
//         }
        
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
        
//         if (!response.ok) {
//             if (response.status === 404) {
//                 throw new Error("404: Details not found");
//             } else {
//                 throw new Error(data?.message || "Unknown error");
//             }
//         }

//         return data;
//     } catch (error) {
//         console.error(`Error fetching ${endpoint}:`, error);
//         throw error;
//     }
// }



// /**
//  * Refreshes the access token using the stored refresh token.
//  * @returns {Promise<boolean>} - True if token was refreshed successfully, otherwise false
//  */
// async function refreshToken() {
//     try {
//         const response = await fetch(`${API_URL}/auth/refresh`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ refreshToken: state.refreshToken }),
//         });

//         if (!response.ok) {
//             console.warn("Failed to refresh token. Logging out...");
//             setState({ token: null, refreshToken: null, user: null });
//             return false;
//         }

//         const res = await response.json();
//         setState({ token: res.token }, true);
//         console.log("Token refreshed successfully.");
//         return true;
//     } catch (error) {
//         console.error("Error refreshing token:", error);
//         setState({ token: null, refreshToken: null, user: null });
//         return false;
//     }
// }

// export { apiFetch, API_URL, SRC_URL, apixFetch };
