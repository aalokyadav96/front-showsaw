import { getActivityFeed } from "../api/activity.js";

import { getTrendingActivities } from "../api/activity.js";

async function loadActivityFeed() {
    const activities = await getActivityFeed();
    const feedContainer = document.getElementById("activity-feed");

    feedContainer.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <strong>${activity.username}</strong> ${activity.action} at ${new Date(activity.timestamp).toLocaleString()}
        </div>
    `).join("");
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", loadActivityFeed);

async function loadTrendingActivities() {
    const activities = await getTrendingActivities();
    const trendingContainer = document.getElementById("trending-activities");

    trendingContainer.innerHTML = activities.map(activity => `
        <div class="trending-item">
            <strong>${activity.username}</strong> ${activity.action} at ${new Date(activity.timestamp).toLocaleString()}
        </div>
    `).join("");
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", loadTrendingActivities);

const socket = new WebSocket("ws://localhost:8080/ws/activity");

socket.onmessage = function (event) {
    const activity = JSON.parse(event.data);
    console.log("New activity received:", activity);

    const feedContainer = document.getElementById("activity-feed");
    const newActivity = document.createElement("div");
    newActivity.className = "activity-item";
    newActivity.innerHTML = `<strong>${activity.username}</strong> ${activity.action} at ${new Date(activity.timestamp).toLocaleString()}`;
    
    feedContainer.prepend(newActivity); // Show newest activity at the top
};
