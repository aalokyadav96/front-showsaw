import { apiFetch } from "../../api/api";
import { createElement } from "../../components/createElement.js";

// Fetch business data
async function fetchBusinessData(businessId) {
    const businessData = await apiFetch(`/businesses/${businessId}`);
    if (!businessData) {
        throw new Error("Invalid business data received.");
    }
    return businessData;
}

// Fetch menu data for a specific business
async function fetchMenuData(businessId) {
    const menuData = await apiFetch(`/businesses/${businessId}/menu`);
    if (!menuData) {
        throw new Error("Invalid menu data received.");
    }
    return menuData;
}

// Fetch promotions data for a specific business
async function fetchPromotionsData(businessId) {
    const promotionsData = await apiFetch(`/businesses/${businessId}/promotions`);
    if (!promotionsData) {
        throw new Error("Invalid promotions data received.");
    }
    return promotionsData;
}

// Function to book a slot for a business
async function bookSlot(businessId, bookingData) {
    const response = await apiFetch(`/businesses/${businessId}/book-slot`, {
        method: "POST",
        body: JSON.stringify(bookingData),
    });
    if (!response) {
        throw new Error("Failed to book slot.");
    }
    return response;
}

// Function to display business data
async function displayBusiness(isLoggedIn, businessId, content) {
    try {
        // Fetch business data asynchronously
        const businessDetails = await fetchBusinessData(businessId);

        // Fetch additional business-related data
        const menuData = await fetchMenuData(businessId);
        const promotionsData = await fetchPromotionsData(businessId);

        // Call displayNewBusiness with fetched business data and related info
        displayNewBusiness(isLoggedIn, content, businessDetails, menuData, promotionsData);
    } catch (error) {
        console.error("Error fetching or displaying business data:", error);
        alert("Failed to fetch business data. Please try again later.");
    }
}

// Function to display the business details, menu, and promotions
function displayNewBusiness(isLoggedIn, content, businessDetails, menuData, promotionsData) {
    if (!isLoggedIn) {
        alert("Please log in to view this business.");
        return;
    }

    // Clear existing content
    content.innerHTML = "";

    // Create a container for the business details
    const businessContainer = document.createElement("div");
    businessContainer.className = "business-details-container";

    // Create a header section for the business
    const businessHeader = document.createElement("div");
    businessHeader.className = "business-header";

    const businessTitle = document.createElement("h1");
    businessTitle.className = "business-title";
    businessTitle.textContent = businessDetails.name;
    businessHeader.appendChild(businessTitle);

    const businessBanner = document.createElement("img");
    businessBanner.className = "business-banner";
    businessBanner.src = businessDetails.banner_image;
    businessBanner.alt = `${businessDetails.name} Banner`;
    businessHeader.appendChild(businessBanner);

    businessContainer.appendChild(businessHeader);

    // Create a section for the business information
    const businessInfo = document.createElement("div");
    businessInfo.className = "business-info";

    const fields = [
        { label: "Business ID", value: businessDetails._id },
        { label: "About", value: businessDetails.about },
        { label: "Contact", value: businessDetails.contact },
        { label: "Location", value: `${businessDetails.city}, ${businessDetails.state}` },
        { label: "Created At", value: new Date(businessDetails.created_at).toLocaleString() },
    ];

    fields.forEach(({ label, value }) => {
        const detailRow = document.createElement("div");
        detailRow.className = "business-info-row";

        const labelElement = document.createElement("strong");
        labelElement.className = "detail-label";
        labelElement.textContent = `${label}:`;

        const valueElement = document.createElement("span");
        valueElement.className = "detail-value";
        valueElement.textContent = value;

        detailRow.appendChild(labelElement);
        detailRow.appendChild(valueElement);

        businessInfo.appendChild(detailRow);
    });

    businessContainer.appendChild(businessInfo);

    // Create a section for the menu
    const menuSection = document.createElement("div");
    menuSection.className = "menu-section";
    const menuTitle = document.createElement("h2");
    menuTitle.textContent = "Menu";
    menuSection.appendChild(menuTitle);

    const menuList = document.createElement("ul");
    menuData.forEach(item => {
        const menuItem = document.createElement("li");
        menuItem.textContent = `${item.name} - $${item.price}`;
        menuList.appendChild(menuItem);
    });
    menuSection.appendChild(menuList);
    businessContainer.appendChild(menuSection);

    // Create a section for promotions
    const promotionsSection = document.createElement("div");
    promotionsSection.className = "promotions-section";
    const promotionsTitle = document.createElement("h2");
    promotionsTitle.textContent = "Promotions";
    promotionsSection.appendChild(promotionsTitle);

    const promotionsList = document.createElement("ul");
    promotionsData.forEach(promo => {
        const promoItem = document.createElement("li");
        promoItem.textContent = `${promo.title} - ${promo.discount}% off`;
        promotionsList.appendChild(promoItem);
    });
    promotionsSection.appendChild(promotionsList);
    businessContainer.appendChild(promotionsSection);

    // Append the entire business container to the content area
    content.appendChild(businessContainer);
}

export { displayBusiness, bookSlot };
