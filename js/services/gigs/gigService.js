import { apiFetch } from "../../api/api";
import { SRC_URL } from "../../state/state.js";

async function fetchGigData(gigId) {
    const gigData = await apiFetch(`/gigs/gig/${gigId}`);
    if (!gigData) {
        throw new Error("Invalid gig data received.");
    }
    return gigData;
}

async function displayGig(isLoggedIn, gigId, content) {
    try {
        // Fetch gig data asynchronously
        const gigDetails = await fetchGigData(gigId);

        // Debugging alerts/logs (remove in production)
        // alert(JSON.stringify(gigDetails, null, 2));
        // console.log(`Gig ID: ${gigDetails.gigid}`);

        // Call displayNewGig with fetched gig data
        displayNewGig(isLoggedIn, content, gigDetails);
    } catch (error) {
        console.error("Error fetching or displaying gig data:", error);
        alert("Failed to fetch gig data. Please try again later.");
    }
}

function displayNewGig(isLoggedIn, content, gigDetails) {
    if (!isLoggedIn) {
        alert("Please log in to view this gig.");
        return;
    }

    // Clear the existing content
    content.innerHTML = "";

    // Create a container for the gig details
    const gigContainer = document.createElement("div");
    gigContainer.className = "gig-details-container";

    // Create a header section for the gig
    const gigHeader = document.createElement("div");
    gigHeader.className = "gig-header";

    const gigTitle = document.createElement("h1");
    gigTitle.className = "gig-title";
    gigTitle.textContent = gigDetails.name;
    gigHeader.appendChild(gigTitle);

    const gigBanner = document.createElement("img");
    gigBanner.className = "gig-banner";
    gigBanner.src = `${SRC_URL}/gigpic/${gigDetails.banner_image}`;
    gigBanner.alt = `${gigDetails.name} Banner`;
    gigHeader.appendChild(gigBanner);

    gigContainer.appendChild(gigHeader);

    // Create a section for the gig details
    const gigInfo = document.createElement("div");
    gigInfo.className = "gig-info";

    const fields = [
        { label: "Creator ID", value: gigDetails.creator_id },
        { label: "Gig ID", value: gigDetails.gigid },
        { label: "About", value: gigDetails.about },
        { label: "Place", value: gigDetails.place },
        { label: "Area", value: gigDetails.area },
        { label: "Type", value: gigDetails.type },
        { label: "Category", value: gigDetails.category },
        { label: "Tags", value: gigDetails.tags.join(", ") },
        { label: "Discount", value: gigDetails.discount },
        { label: "Contact", value: gigDetails.contact },
        { label: "Created At", value: new Date(gigDetails.created_at).toLocaleString() },
    ];

    fields.forEach(({ label, value }) => {
        const detailRow = document.createElement("div");
        detailRow.className = "gig-info-row";

        const labelElement = document.createElement("strong");
        labelElement.className = "detail-label";
        labelElement.textContent = `${label}:`;

        const valueElement = document.createElement("span");
        valueElement.className = "detail-value";
        valueElement.textContent = value;

        detailRow.appendChild(labelElement);
        detailRow.appendChild(valueElement);

        gigInfo.appendChild(detailRow);
    });

    gigContainer.appendChild(gigInfo);

    // Append the entire gig container to the content area
    content.appendChild(gigContainer);
}

export { displayGig, displayNewGig };
