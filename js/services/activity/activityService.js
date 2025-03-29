import Snackbar from '../components/ui/Snackbar.mjs';

let activityAbortController;
let activityQueue = []; // Store activities before sending
let syncInterval = null; // Timer for periodic syncing

// Get user and device details
function getUserMetadata() {
    return {
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || 'Direct',
        url: window.location.href
    };
}

// Add activity to queue
function queueActivity(action, additionalData = {}) {
    if (!state.token) {
        Snackbar("Please log in to log activities.", 3000);
        return;
    }

    const activity = {
        userId: state.userId || 'guest',
        action: action,
        timestamp: new Date().toISOString(),
        metadata: getUserMetadata(),
        ...additionalData // Merge any extra data
    };

    activityQueue.push(activity);
}

// Send batch activities
async function syncActivities() {
    if (!state.token || activityQueue.length === 0) return;

    if (activityAbortController) {
        activityAbortController.abort();
    }

    activityAbortController = new AbortController();
    const signal = activityAbortController.signal;

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${state.token}`
    };

    try {
        const response = await fetch('/api/activity/log', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(activityQueue),
            signal: signal
        });

        if (response.ok) {
            Snackbar("Activities logged successfully.", 3000);
            activityQueue = []; // Clear queue after successful sync
        } else {
            const errorData = await response.json();
            console.error(`Failed to log activities: ${errorData.message || 'Unknown error'}`);
            Snackbar(`Failed to log activities: ${errorData.message || 'Unknown error'}`, 3000);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Activity log aborted');
            return;
        }
        console.error(`Failed to log activities: ${error.message || 'Unknown error'}`);
        Snackbar(`Failed to log activities: ${error.message || 'Unknown error'}`, 3000);
    }
}

// Automatically sync activities every 10 seconds
function startActivitySync() {
    if (!syncInterval) {
        syncInterval = setInterval(syncActivities, 10000);
    }
}

// Save activities when offline and retry when online
window.addEventListener('offline', () => {
    localStorage.setItem('offlineActivities', JSON.stringify(activityQueue));
});

window.addEventListener('online', async () => {
    const offlineData = localStorage.getItem('offlineActivities');
    if (offlineData) {
        activityQueue = [...JSON.parse(offlineData), ...activityQueue];
        localStorage.removeItem('offlineActivities');
        await syncActivities();
    }
});

// Track specific actions
function trackPageView() {
    queueActivity('page_view', { page: window.location.pathname });
}

function trackButtonClick(buttonName) {
    queueActivity('button_click', { button: buttonName });
}

function trackPurchase(itemId, price) {
    queueActivity('purchase', { itemId, price });
}

// Auto-track page views
window.addEventListener('load', trackPageView);
startActivitySync(); // Start periodic syncing

export { queueActivity, trackPageView, trackButtonClick, trackPurchase, syncActivities };
