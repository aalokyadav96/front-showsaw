import { secnav } from "../../components/secnav.js";

export function displayAasPaas(contentContainer, isLoggedIn) {
    if (!contentContainer) {
        console.error("Content container not found!");
        return;
    }

    const localSection = document.createElement("section");
    localSection.classList.add("local-section");

    const itemsContainer = document.createElement("div");
    itemsContainer.classList.add("items-container");

    const localData = {
        Events: [
            {
                title: "Community Meetup",
                details: "Join us for a fun get-together at the park.",
                date: "May 10, 2025"
            }
        ],
        Shops: [
            {
                title: "New Organic Store Opened",
                details: "Fresh organic produce available in town.",
                date: "May 8, 2025"
            }
        ],
        Restaurants: [
            {
                title: "Food Fest This Weekend",
                details: "Enjoy a variety of cuisines!",
                date: "May 11, 2025"
            }
        ],
        Alerts: [
            {
                title: "Traffic Update",
                details: "Expect congestion near Main Street due to repairs.",
                date: "May 7, 2025"
            }
        ]
    };

    function showCategory(category) {
        itemsContainer.innerHTML = "";

        if (localData[category]) {
            localData[category].forEach(item => {
                const article = document.createElement("article");
                article.classList.add("local-item");

                const title = document.createElement("h2");
                title.textContent = item.title;
                article.appendChild(title);

                const metaInfo = document.createElement("p");
                metaInfo.classList.add("meta-info");
                metaInfo.textContent = `Date: ${item.date}`;
                article.appendChild(metaInfo);

                const details = document.createElement("p");
                details.textContent = item.details;
                article.appendChild(details);

                itemsContainer.appendChild(article);
            });
        }
    }

    const categories = [
        { label: "Events", callback: showCategory },
        { label: "Shops", callback: showCategory },
        { label: "Restaurants", callback: showCategory },
        { label: "Alerts", callback: showCategory }
    ];

    const secondaryNav = secnav(categories);
    if (secondaryNav) localSection.appendChild(secondaryNav);

    localSection.appendChild(itemsContainer);

    showCategory("Events"); // Default

    contentContainer.appendChild(localSection);
}


// export function secnav(categories) {
//     const ul = document.createElement("ul");
//     ul.classList.add("secnav");
//     categories.forEach(cat => {
//         const li = document.createElement("li");
//         li.textContent = cat;
//         li.dataset.name = cat;
//         ul.appendChild(li);
//     });
//     return ul;
// }

// export function displayAasPaas(contentContainer, isLoggedIn) {
//     if (!contentContainer) {
//         console.error("Content container not found!");
//         return;
//     }

//     // Create main section
//     const localSection = document.createElement("section");
//     localSection.classList.add("local-section");

//     // Create a heading
//     const heading = document.createElement("h1");
//     heading.textContent = "What's Happening Nearby?";
//     localSection.appendChild(heading);

//     // Create navigation categories
//     const nav = document.createElement("nav");
//     nav.classList.add("local-nav");

//     const categories = ["Events", "Shops", "Restaurants", "Alerts"];
//     const navList = document.createElement("ul");

//     categories.forEach(category => {
//         const navItem = document.createElement("li");
//         navItem.textContent = category;
//         navItem.classList.add("nav-item");
//         navItem.addEventListener("click", () => showCategory(category));
//         navList.appendChild(navItem);
//     });

//     nav.appendChild(navList);
//     localSection.appendChild(nav);

//     // Create a container for items
//     const itemsContainer = document.createElement("div");
//     itemsContainer.classList.add("items-container");
//     localSection.appendChild(itemsContainer);

//     // Example local data
//     const localData = {
//         Events: [
//             { title: "Community Meetup", details: "Join us for a fun get-together at the park.", date: "May 10, 2025" }
//         ],
//         Shops: [
//             { title: "New Organic Store Opened", details: "Fresh organic produce available in town.", date: "May 8, 2025" }
//         ],
//         Restaurants: [
//             { title: "Food Fest This Weekend", details: "Enjoy a variety of cuisines!", date: "May 11, 2025" }
//         ],
//         Alerts: [
//             { title: "Traffic Update", details: "Expect congestion near Main Street due to repairs.", date: "May 7, 2025" }
//         ]
//     };

//     function showCategory(category) {
//         itemsContainer.innerHTML = ""; // Clear previous items
//         if (localData[category]) {
//             localData[category].forEach(item => {
//                 const itemCard = document.createElement("article");
//                 itemCard.classList.add("local-item");

//                 const title = document.createElement("h2");
//                 title.textContent = item.title;
//                 itemCard.appendChild(title);

//                 const metaInfo = document.createElement("p");
//                 metaInfo.classList.add("meta-info");
//                 metaInfo.textContent = `Date: ${item.date}`;
//                 itemCard.appendChild(metaInfo);

//                 const details = document.createElement("p");
//                 details.textContent = item.details;
//                 itemCard.appendChild(details);

//                 itemsContainer.appendChild(itemCard);
//             });
//         }
//     }

//     // Show default category
//     showCategory("Events");

//     // Append everything to the content container
//     contentContainer.appendChild(localSection);
// }
