import Snackbar from "../../components/ui/Snackbar.mjs";

const API_URL = "/api/activity";

async function logActivity(action, metadata = {}) {
    if (!state.token) {
        Snackbar("Please log in to log activities.", 3000);
        return;
    }

    const activity = {
        action, // Example: "event_created", "ticket_purchased", "liked_post"
        timestamp: new Date().toISOString(),
        metadata // Extra details, like event ID, post ID, etc.
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${state.token}`
            },
            body: JSON.stringify([activity]) // Send as an array to support batch logging
        });

        if (response.ok) {
            Snackbar("Activity logged successfully.", 3000);
            return true;
        } else {
            const errorData = await response.json();
            Snackbar(`Failed to log activity: ${errorData.error || 'Unknown error'}`, 3000);
            return false;
        }
    } catch (error) {
        console.error("Activity logging failed:", error);
        Snackbar("Failed to log activity. Please try again.", 3000);
        return false;
    }
}

// Fetch user's activity feed
async function getActivityFeed() {
    try {
        const response = await fetch(API_URL + "/feed", {
            headers: {
                "Authorization": `Bearer ${state.token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch activities");

        return await response.json();
    } catch (error) {
        console.error("Error fetching activity feed:", error);
        return [];
    }
}

// Fetch trending activities (popular actions across all users)
async function getTrendingActivities() {
    try {
        const response = await fetch(API_URL + "/trending", {
            headers: {
                "Authorization": `Bearer ${state.token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch trending activities");

        return await response.json();
    } catch (error) {
        console.error("Error fetching trending activities:", error);
        return [];
    }
}

export { logActivity, getActivityFeed, getTrendingActivities };
