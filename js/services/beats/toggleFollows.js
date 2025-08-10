import { state, setState } from "../../state/state.js";
import { apiFetch } from "../../api/api.js";
import Snackbar from "../../components/ui/Snackbar.mjs";
import Notify from "../../components/ui/Notify.mjs";

/**
 * Generic toggle action (e.g., follow/unfollow, subscribe/unsubscribe)
 *
 * @param {Object} options
 * @param {string} options.entityId - ID of the target entity (user, channel, etc.)
 * @param {HTMLElement} options.button - The toggle button element
 * @param {Object} options.targetObject - The object representing the user/channel/etc.
 * @param {string} options.apiPath - The API path (e.g., "/follows/", "/subscriptions/")
 * @param {string} options.property - Boolean property to toggle (e.g., "isFollowing")
 * @param {string} options.labels - Labels for states: { on: "Unfollow", off: "Follow" }
 * @param {string} options.actionName - Action name for Snackbar message (e.g., "followed", "unfollowed")
 */
export async function toggleAction({
    entityId,
    button,
    targetObject,
    apiPath,
    property = "isFollowing",
    labels = { on: "Unfollow", off: "Follow" },
    actionName = "follow",
}) {
    if (!state.token) {
        Snackbar("Please log in to continue.", 3000);
        return;
    }

    if (!button) {
        Snackbar("Action button not found.", 3000);
        return;
    }

    if (!targetObject) {
        Snackbar("Target data is unavailable.", 3000);
        return;
    }

    const isCurrentlyOn = !!targetObject[property];
    const method = isCurrentlyOn ? "DELETE" : "PUT";
    const newState = !isCurrentlyOn;
    const originalText = button.textContent;
    const originalClass = button.className;

    // Optimistic UI update
    button.disabled = true;
    button.textContent = newState ? labels.on : labels.off;
    button.classList.toggle("active", newState);
    targetObject[property] = newState;

    try {
        const response = await apiFetch(`${apiPath}${entityId}`, method);
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        // Optional: refresh profile after success
        // setState({ userProfile: fetchProfile() }, true);

        Snackbar(
            `You have ${newState ? actionName : `un${actionName}`} ${targetObject.username || "the entity"}.`,
            3000
        );
    } catch (err) {
        // Revert UI on failure
        targetObject[property] = isCurrentlyOn;
        button.textContent = originalText;
        button.className = originalClass;
        button.disabled = false;

        console.error("Toggle action failed:", err);
        Snackbar(`Failed to ${newState ? "" : "un"}${actionName}: ${err.message}`, 3000);
    } finally {
        button.disabled = false;
    }
}


/*

✅ Example Usage for Follow Button


import { toggleAction } from "../path/to/toggleAction.js";

const followBtn = document.getElementById("follow-btn");

followBtn.addEventListener("click", () => {
    toggleAction({
        entityId: user.id,
        button: followBtn,
        targetObject: user,
        apiPath: "/follows/",
        property: "isFollowing",
        labels: { on: "Unfollow", off: "Follow" },
        actionName: "followed",
    });
});



✅ Example Usage for Subscribe Button

toggleAction({
    entityId: channel.id,
    button: subscribeBtn,
    targetObject: channel,
    apiPath: "/subscriptions/",
    property: "isSubscribed",
    labels: { on: "Unsubscribe", off: "Subscribe" },
    actionName: "subscribed",
});


*/