import "../../css/home.css";

async function Home(isLoggedIn, content) {
    // Clear existing content
    content.innerHTML = "";

    // Create Page Section
    const PageSection = document.createElement("div");
    PageSection.classList.add("home-container");

    // Search Bar
    const searchContainer = document.createElement("div");
    searchContainer.classList.add("search-container");

    const searchInput = document.createElement("input");
    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("placeholder", "Search events...");
    searchInput.classList.add("search-input");

    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";
    searchButton.classList.add("search-button");
    searchButton.addEventListener("click", () => {
        alert(`Searching for: ${searchInput.value}`);
    });

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    
    // Event List Section
    const eventList = document.createElement("div");
    eventList.classList.add("event-list");

    // Simulated Event Data
    const events = [
        { title: "🎉 Music Festival", location: "City Park" },
        { title: "📅 Tech Conference", location: "Convention Center" },
        { title: "🎭 Theatre Night", location: "Grand Theatre" }
    ];

    if (events.length > 0) {
        events.forEach(event => {
            const eventCard = document.createElement("div");
            eventCard.classList.add("event-card");
            eventCard.innerHTML = `<h3>${event.title}</h3><p>${event.location}</p>`;
            eventList.appendChild(eventCard);
        });
    } else {
        eventList.innerHTML = "<p>No events available.</p>";
    }

    // Create Event Button (if logged in)
    if (isLoggedIn) {
        const createEventButton = document.createElement("button");
        createEventButton.textContent = "Create Event";
        createEventButton.classList.add("create-event-button");
        createEventButton.addEventListener("click", () => {
            alert("Redirecting to event creation...");
        });

        PageSection.appendChild(createEventButton);
    }

    // Append everything to Page Section
    PageSection.appendChild(searchContainer);
    PageSection.appendChild(eventList);

    // Add PageSection to Content
    content.appendChild(PageSection);
}

export { Home };
