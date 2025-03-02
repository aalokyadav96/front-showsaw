import { renderTabContent } from "./tabRenderer.js";

/**
 * Creates a tab structure for "Content" and "Subcontent" sections.
 * @param {string} title - The title of the section.
 * @param {string[]} tabs - List of tab names.
 * @param {string} username - The username for fetching data.
 * @returns {Object} - Main tab button, section, child tabs, and containers.
 */
function createTabStructure(title, tabs, username) {
    const sectionId = `${title.toLowerCase()}-section`;

    const tabSection = createElement("div", { id: sectionId, style: "display: none;" });
    const tabContainer = createElement("div", { class: `${title.toLowerCase()}-tab-container` });
    const tabButtons = createElement("div", { class: `${title.toLowerCase()}-tab-buttons` });
    const tabContents = createElement("div", { class: `${title.toLowerCase()}-tab-contents` });

    tabSection.appendChild(tabContainer);
    tabContainer.append(tabButtons, tabContents);

    const tabContentContainers = {};
    tabs.forEach((entityType) => {
        console.log(`Creating tab for: ${entityType} | Username: ${username}`);

        const tabContent = createElement("div", {
            id: `${entityType}-container`,
            class: "tabs-content",
            style: "display: none;"
        });

        tabContents.appendChild(tabContent);
        tabContentContainers[entityType] = tabContent;

        const tabButton = createTabButton(entityType, tabContent, username);
        tabButtons.appendChild(tabButton);
    });

    const mainTabButton = createElement("button", { class: "main-tab-button" }, title);
    mainTabButton.addEventListener("click", () => {
        tabSection.style.display = "block";
    });

    return { mainTabButton, tabSection, tabContentContainers };
}

/**
 * Creates a tab button and adds a click event to activate it.
 * @param {string} entityType - The tab entity type.
 * @param {HTMLElement} contentContainer - The associated content container.
 * @param {string} username - The username for fetching data.
 * @returns {HTMLButtonElement} - The created tab button.
 */
function createTabButton(entityType, contentContainer, username) {
    const tabButton = createElement("button", { class: "tab-button" }, capitalize(entityType));

    tabButton.addEventListener("click", () => {
        activateChildTab(tabButton, contentContainer, username, entityType);
    });

    return tabButton;
}

/**
 * Activates a child tab and loads content if it hasn’t been loaded yet.
 * @param {HTMLElement} tabButton - The button element to activate.
 * @param {HTMLElement} contentContainer - The associated content container.
 * @param {string} username - The username for fetching data.
 * @param {string} entityType - The entity type for the tab.
 */
function activateChildTab(tabButton, contentContainer, username, entityType) {
    if (!entityType) {
        console.error("❌ ERROR: entityType is undefined. Cannot activate tab.");
        return;
    }

    const allTabContainers = Array.from(contentContainer.parentElement.children);
    const allTabButtons = Array.from(tabButton.parentElement.children);

    // Hide all tab contents and remove active class from buttons
    allTabContainers.forEach(tab => (tab.style.display = "none"));
    allTabButtons.forEach(btn => btn.classList.remove("active"));

    // Show the selected tab and set it active
    contentContainer.style.display = "block";
    tabButton.classList.add("active");

    // Load content if not already fetched
    if (!contentContainer.dataset.loaded) {
        console.log(`🔍 Fetching data for: ${username} | Entity: ${entityType}`);
        renderTabContent(contentContainer, username, entityType);
        contentContainer.dataset.loaded = "true";
    }
}

/** 
 * Utility function to create an HTML element with attributes and text content.
 * @param {string} tag - The HTML tag name.
 * @param {Object} attributes - Attributes to add to the element.
 * @param {string} [textContent] - Optional text content.
 * @returns {HTMLElement} - The created element.
 */
function createElement(tag, attributes = {}, textContent = "") {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    if (textContent) element.textContent = textContent;
    return element;
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - Capitalized string.
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export { createTabStructure, activateChildTab };
