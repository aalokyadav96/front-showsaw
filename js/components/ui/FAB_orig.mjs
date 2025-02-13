// Floating Action Button with expandable menu
const FloatingActionButton = (icon, id, fabcon) => {
    const fabContainer = document.createElement("div");
    fabContainer.classList.add("fab-container");

    // FAB button
    const fab = document.createElement("button");
    fab.id = id;
    fab.classList.add("fab");
    fab.innerHTML = icon;

    // Action buttons container (hidden initially)
    const actionContainer = document.createElement("div");
    actionContainer.classList.add("fab-actions", "hidden");

    // Action buttons
    const actions = [
        { label: "New Post", onClick: () => console.log("New Post Clicked") },
        { label: "Upload Image", onClick: () => console.log("Upload Image Clicked") },
        { label: "Settings", onClick: () => console.log("Settings Clicked") },
    ];

    actions.forEach(({ label, onClick }) => {
        const actionBtn = document.createElement("button");
        actionBtn.classList.add("fab-action-btn");
        actionBtn.textContent = label;
        actionBtn.addEventListener("click", onClick);
        actionContainer.appendChild(actionBtn);
    });

    // Toggle menu visibility when clicking FAB
    fab.addEventListener("click", () => {
        actionContainer.classList.toggle("hidden");
    });

    // Append everything
    fabContainer.appendChild(actionContainer);
    fabContainer.appendChild(fab);
    document.body.appendChild(fabContainer);
};

export default FloatingActionButton;
export { FloatingActionButton };

// // Draggable Floating Action Button (FAB) Component
// const FloatingActionButton = (icon, id, events = {}) => {
//     const fab = document.createElement("button");
//     fab.id = id;
//     fab.classList.add("fab");

//     // Set icon (text, emoji, or SVG)
//     if (typeof icon === "string") {
//         fab.innerHTML = icon;
//     } else {
//         fab.appendChild(icon);
//     }

//     // Add event listeners from props
//     for (const event in events) {
//         fab.addEventListener(event, events[event]);
//     }

//     // Make FAB draggable
//     let isDragging = false;
//     let offsetX, offsetY;

//     fab.addEventListener("mousedown", (e) => {
//         isDragging = true;
//         offsetX = e.clientX - fab.getBoundingClientRect().left;
//         offsetY = e.clientY - fab.getBoundingClientRect().top;
//         fab.style.transition = "none"; // Disable transition during drag
//     });

//     document.addEventListener("mousemove", (e) => {
//         if (!isDragging) return;
//         const x = e.clientX - offsetX;
//         const y = e.clientY - offsetY;

//         // Keep the button inside the viewport
//         const maxX = window.innerWidth - fab.clientWidth;
//         const maxY = window.innerHeight - fab.clientHeight;

//         fab.style.left = `${Math.min(Math.max(0, x), maxX)}px`;
//         fab.style.top = `${Math.min(Math.max(0, y), maxY)}px`;
//     });

//     document.addEventListener("mouseup", () => {
//         isDragging = false;
//         fab.style.transition = "transform 0.2s"; // Re-enable transition after drag
//     });

//     return fab;
// };

// export default FloatingActionButton;
// export { FloatingActionButton };
