import Snackbar from '../../components/ui/Snackbar.mjs';
import { fetchUserProfile, fetchUserProfileData } from "./fetchProfile.js";
import profilGen from "./renderUserProfile.js";
import {displayFollowSuggestions} from "./userProfileService.js";

async function displayUserProfile(isLoggedIn, content, username) {
    // const content = document.getElementById("content");
    // content.textContent = ""; // Clear existing content

    console.log(isLoggedIn);
    console.log("profile");
    try {
        const userProfile = await fetchUserProfile(username);

        if (userProfile) {
            const profileElement = profilGen(userProfile, isLoggedIn);
            content.appendChild(profileElement);
            displayFollowSuggestions(userProfile.userid);
        } else {
            const notFoundMessage = document.createElement("p");
            notFoundMessage.textContent = "User not found.";
            content.appendChild(notFoundMessage);
        }
    } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to load user profile. Please try again later.";
        content.appendChild(errorMessage);


        Snackbar("Error fetching user profile.", 3000);
    }
}

async function displayUserProfileData(isLoggedIn, content, username) {
    content.innerHTML = ""; // Clear existing content

    console.log("profile");

    // Define entity types grouped under "Content" and "Subcontent"
    const contentTabs = ["userhome", "place", "event", "feedpost", "blogpost"];
    const subcontentTabs = ["media", "ticket", "merch", "review"];

    // Initialize main tabs
    const { mainTabContainer, mainTabButtons, mainTabContents } = initializeMainTabs(content);

    // Create "Content" and "Subcontent" structures
    const contentStructure = createTabStructure("Content", contentTabs, username);
    const subcontentStructure = createTabStructure("Subcontent", subcontentTabs, username);

    // Add "Content" and "Subcontent" as main tabs
    addMainTabs(mainTabButtons, mainTabContents, [
        { title: "Content", section: contentStructure.tabSection },
        { title: "Subcontent", section: subcontentStructure.tabSection },
    ]);

    // Activate the first main tab and its first child tab by default
    activateMainTab(contentStructure.tabSection);
    activateChildTab(contentStructure.childTabs[0], contentStructure.tabContentContainers[0]);
}

/** Initialize main tabs for "Content" and "Subcontent". */
function initializeMainTabs(content) {
    const mainTabContainer = document.createElement("div");
    mainTabContainer.classList.add("main-tab-container");

    const mainTabButtons = document.createElement("div");
    mainTabButtons.classList.add("main-tab-buttons");

    const mainTabContents = document.createElement("div");
    mainTabContents.classList.add("main-tab-contents");

    content.appendChild(mainTabContainer);
    mainTabContainer.appendChild(mainTabButtons);
    mainTabContainer.appendChild(mainTabContents);

    return { mainTabContainer, mainTabButtons, mainTabContents };
}

function createTabStructure(title, tabs, username) {
    const tabSection = document.createElement("div");
    tabSection.id = `${title.toLowerCase()}-section`;
    tabSection.style.display = "none"; // Initially hidden

    const tabContainer = document.createElement("div");
    tabContainer.classList.add(`${title.toLowerCase()}-tab-container`);

    const tabButtons = document.createElement("div");
    tabButtons.classList.add(`${title.toLowerCase()}-tab-buttons`);

    const tabContents = document.createElement("div");
    tabContents.classList.add(`${title.toLowerCase()}-tab-contents`);

    tabSection.appendChild(tabContainer);
    tabContainer.appendChild(tabButtons);
    tabContainer.appendChild(tabContents);

    // Create containers and buttons for each child tab
    const tabContentContainers = tabs.map((entityType) => {
        const tabContent = document.createElement("div");
        tabContent.id = `${entityType}-container`;
        tabContent.classList.add("tabs-content");
        tabContent.style.display = "none"; // Initially hidden
        tabContents.appendChild(tabContent);
        return tabContent;
    });

    const childTabs = tabs.map((entityType, index) => {
        const tabButton = document.createElement("button");
        tabButton.textContent = entityType.charAt(0).toUpperCase() + entityType.slice(1);
        tabButton.classList.add("tab-button");

        // Add event listener to activate the tab
        tabButton.addEventListener("click", () => {
            activateChildTab(
                childTabs[index],
                tabContentContainers[index],
                tabButtons,
                tabContentContainers
            );
        });

        tabButtons.appendChild(tabButton);

        return {
            title: entityType,
            id: `${entityType}-tab`,
            render: async () => {
                const container = tabContentContainers[index];
                try {
                    container.textContent = "Loading...";
                    const data = await fetchUserProfileData(username, entityType);
                    displayEntityData(container, data, entityType);
                } catch (error) {
                    console.error(`Error fetching data for ${entityType}:`, error);
                    Snackbar(`Failed to load ${entityType} data. Please try again.`, 3000);
                    container.textContent = "Error loading data.";
                }
            },
        };
    });

    return { tabSection, childTabs, tabContentContainers };
}


/** Add main tabs ("Content" and "Subcontent"). */
function addMainTabs(mainTabButtons, mainTabContents, tabs) {
    tabs.forEach(({ title, section }) => {
        const mainTabButton = document.createElement("button");
        mainTabButton.textContent = title;
        mainTabButton.classList.add("main-tab-button");

        mainTabButton.addEventListener("click", () => {
            activateMainTab(section);
        });

        mainTabButtons.appendChild(mainTabButton);
        mainTabContents.appendChild(section);
    });
}

/** Activate a main tab (e.g., "Content" or "Subcontent"). */
function activateMainTab(activeSection) {
    Array.from(activeSection.parentElement.children).forEach((section) => {
        section.style.display = section === activeSection ? "block" : "none";
    });
}

/** Activate a child tab under "Content" or "Subcontent". */
function activateChildTab(childTab, contentContainer) {
    childTab.render(); // Render the content

    Array.from(contentContainer.parentElement.children).forEach((tab) => {
        tab.style.display = tab === contentContainer ? "block" : "none";
    });
}

/** Render data for an entity inside a container. */
function displayEntityData(container, data, entityType) {
    container.innerHTML = ""; // Clear previous content
    if (!data || data.length === 0) {
        container.textContent = `No ${entityType} data found.`;
        return;
    }

    const list = document.createElement("ul");
    data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.appendChild(renderEntityLink(item, entityType));
        list.appendChild(listItem);
    });

    container.appendChild(list);
}

/** Render an entity link based on its type. */
// function renderEntityLink(item, entityType) {
//     const link = document.createElement("a");
//     link.href = `/${entityType}/${item.entity_id}`;
//     link.textContent = `Entity ID: ${item.entity_id} - Created At: ${new Date(item.created_at).toLocaleString()}`;
//     return link;
// }

function renderEntityLink(item, entityType) {
    const entitylink = document.createElement("a");
    if (entityType === "place") {
        entitylink.href = `/place/${item.entity_id}`;
    } else if (entityType === "event") {
        entitylink.href = `/event/${item.entity_id}`;
    } else if (entityType === "feedpost") {
        entitylink.href = `/post/${item.entity_id}`;
    } else if (entityType === "blogpost") {
        entitylink.href = `/blog/${item.entity_id}`;
    } else {
        entitylink.href = "#";
    }
    entitylink.textContent = `Post ID: ${item.entity_id} - Created At: ${new Date(item.created_at).toLocaleString()}`;
    return entitylink;
}


export { displayUserProfile, displayUserProfileData };
