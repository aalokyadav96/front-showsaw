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

/** Activate a main tab and hide others. */
function activateMainTab(activeSection) {
    const allSections = document.querySelectorAll(".main-tab-contents > div");

    allSections.forEach((section) => {
        if (section === activeSection) {
            section.style.display = "block";
        } else {
            section.style.display = "none"; // Hide all other sections
        }
    });

    // Ensure only the clicked main tab button is active
    document.querySelectorAll(".main-tab-button").forEach((btn) => {
        btn.classList.remove("active");
    });

    const activeButton = document.querySelector(
        `.main-tab-buttons button:nth-child(${Array.from(activeSection.parentElement.children).indexOf(activeSection) + 1})`
    );
    if (activeButton) activeButton.classList.add("active");
}

document.querySelectorAll(".main-tab-button").forEach((button, index) => {
    button.addEventListener("click", () => {
        const sections = document.querySelectorAll(".main-tab-contents > div");
        activateMainTab(sections[index]); // Switch to the correct section
    });
});



export { initializeMainTabs, activateMainTab };
