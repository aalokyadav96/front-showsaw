import Pagination from '../../components/ui/Pagination.mjs';
import { apiFetch } from "../../api/api.js";
// import Breadcrumb from '../../components/ui/Breadcrumb.mjs';
import SnackBar from '../../components/ui/Snackbar.mjs';
import { navigate } from "../../routes/index.js";
import { SRC_URL } from '../../state/state.js';

let abortController = null;

async function fetchGigs(page = 1, limit = 10) {
    // Abort the previous fetch if it's still ongoing
    if (abortController) {
        abortController.abort();
    }

    abortController = new AbortController(); // Create a new instance
    const signal = abortController.signal; // Get the signal to pass to apiFetch

    try {
        // Use apiFetch to fetch gigs and pass the signal for aborting
        const queryParams = new URLSearchParams({ page: page, limit: limit }).toString();
        const gigs = await apiFetch(`/gigs/gigs?${queryParams}`, 'GET', null, { signal });
        console.log(gigs);
        return gigs;
    } catch (error) {
        // If error is due to abort, return null
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
            return null; // Return null for aborted fetch
        }
        console.error('Error fetching gigs:', error);
        SnackBar("An unexpected error occurred while fetching gigs.", 3000);
        return null; // Return null for other errors
    }
}

async function fetchTotalGigCount() {
    return 5;
}


async function displayGigs(isLoggedIn, content, contentcon, page = 1) {
    const gigsPerPage = 4; // Number of gigs per page
    content.innerHTML = ''; // Clear the main content area

    // Create a container for gigs
    const gigDiv = document.createElement("div");
    gigDiv.id = "gigs";
    content.appendChild(gigDiv);

    try {
        // Fetch gigs for the current page
        const gigs = await fetchGigs(page, gigsPerPage);

        if (gigs && gigs.length > 0) {
            gigDiv.innerHTML = gigs.map(generateGigHTML).join('');
            console.log("Displayed refreshed gigs.");
        } else {
            gigDiv.innerHTML = "<h2>No gigs available.</h2>";
        }

        // Handle pagination
        const totalGigs = await fetchTotalGigCount(); // Get the total gig count from the backend
        const totalPages = Math.ceil(totalGigs / gigsPerPage);

        const paginationContainer = document.getElementById("pagination") || document.createElement('div');
        paginationContainer.id = "pagination";
        paginationContainer.className = "pagination";

        // Clear and rebuild pagination
        paginationContainer.innerHTML = '';
        const pagination = Pagination(page, totalPages, (newPage) => {
            displayGigs(isLoggedIn, content, contentcon, newPage);
        });

        paginationContainer.appendChild(pagination);

        // Append the pagination to the content container
        if (!document.getElementById("pagination")) {
            contentcon.appendChild(paginationContainer);
        }
    } catch (error) {
        content.innerHTML = "<h2>Error loading gigs. Please try again later.</h2>";
        console.error("Error fetching gigs:", error);
    }
}


// Generate HTML for each gig
function generateGigHTML(gig) {
    return `
        <div class="gig" id="gig-${gig.gigid}">
            <a href="/gig/${gig.gigid}" title="View gig details" id="a-${gig.gigid}">
                <h1>${gig.name}</h1>
                <img src="${SRC_URL}/gigpic/${gig.banner_image}" alt="${gig.name} Banner" style="width: 100%; max-height: 300px; object-fit: cover;" />
                <p><strong>Place:</strong> ${gig.place}</p>
                <p><strong>Address:</strong> ${gig.area}</p>
                <p><strong>Description:</strong> ${gig.about}</p>
            </a>
        </div>
    `;
}


export { displayGigs, generateGigHTML };