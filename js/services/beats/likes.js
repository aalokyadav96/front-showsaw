import { apiFetch } from "../../api/api.js";

// export async function toggleLike(entityType, entityId) {
//     const response = await apiFetch(`/likes/${entityType}/${entityId}`, "POST");

//     return await response; // { liked: true/false, count: N }
// }
export async function toggleLike(entityType, entityId) {
    const path = `/likes/${entityType}/${entityId}`;
    const response = await apiFetch(path, "POST");
    // Expecting JSON: { liked: boolean, count: number }
    return await response;
}
// export async function toggleLike(entityType, entityId) {
//     return await apiFetch(`/likes/${entityType}/${entityId}`, "POST");
// }

// async function toggleLike(entityType, entityId) {
//     const response = await fetch(`/likes/${entityType}/${entityId}`, {
//         method: "POST",
//         headers: {
//             "Authorization": localStorage.getItem("token"),
//         }
//     });

//     if (!response.ok) throw new Error("Toggle like failed");

//     return await response.json(); // { liked: true/false, count: N }
// }
