import { initializeMainTabs, activateMainTab } from "./mainTabs.js";
import { createTabStructure, activateChildTab } from "./subTabs.js";

/** Display user profile data and initialize the tab system. */
async function displayUserProfileData(isLoggedIn, content, username) {
    content.innerHTML = ""; // Clear existing content

    console.log("Loading profile tabs...");

    const contentTabs = ["userhome", "place", "event", "feedpost", "blogpost"];
    const subcontentTabs = ["media", "ticket", "merch", "review"];

    // Initialize main tabs
    const { mainTabContainer, mainTabButtons, mainTabContents } = initializeMainTabs(content);

    // Create tab structures for "Content" and "Subcontent"
    const contentStructure = createTabStructure("Content", contentTabs, username);
    const subcontentStructure = createTabStructure("Subcontent", subcontentTabs, username);

    // Append main tab buttons and sections
    mainTabButtons.appendChild(contentStructure.mainTabButton);
    mainTabButtons.appendChild(subcontentStructure.mainTabButton);

    mainTabContents.appendChild(contentStructure.tabSection);
    mainTabContents.appendChild(subcontentStructure.tabSection);

    // Set up event listeners for main tab switching
    contentStructure.mainTabButton.addEventListener("click", () => activateMainTab(contentStructure.tabSection));
    subcontentStructure.mainTabButton.addEventListener("click", () => activateMainTab(subcontentStructure.tabSection));

    // Activate the first main tab and its first child tab
    activateMainTab(contentStructure.tabSection);

    // if (contentStructure.childTabs.length > 0) {
    //     activateChildTab(contentStructure.childTabs[0], contentStructure.tabContentContainers[0]);
    // }
    if (contentStructure && contentStructure.childTabs && contentStructure.childTabs.length > 0) {
        activateChildTab(contentStructure.childTabs[0], contentStructure.tabContentContainers[0]);
    } else {
        console.warn("⚠️ No child tabs available to activate.");
    }
}


export { displayUserProfileData };
