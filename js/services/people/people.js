import { secnav } from "../../components/secnav.js";

export async function displayPeople(contentContainer, isLoggedIn) {
    if (!contentContainer) {
        console.error("Content container not found!");
        return;
    }

    const peopleSection = document.createElement("section");
    peopleSection.classList.add("people-section");

    const profileContainer = document.createElement("div");
    profileContainer.classList.add("profile-container");

    const mockData = {
        Celebrity: {
            name: "John Doe",
            bio: "John Doe is an actor, producer, and philanthropist. He is best known for his roles in blockbuster films and his humanitarian efforts around the world.",
            birthDate: "January 1, 1985",
            nationality: "American",
            knownFor: "Acting, Producing",
            imageUrl: "https://via.placeholder.com/150", // Example image
            career: [
                "2005: Debut film 'First Movie'",
                "2009: Breakthrough role in 'Big Hit'",
                "2015: Founded Production Company",
                "2020: Winner of Best Actor Award"
            ],
            socialLinks: {
                twitter: "https://twitter.com/johndoe",
                instagram: "https://instagram.com/johndoe",
                facebook: "https://facebook.com/johndoe"
            },
            mediaGallery: [
                "https://via.placeholder.com/150",
                "https://via.placeholder.com/150",
                "https://via.placeholder.com/150"
            ]
        }
    };

    // Add tabs for different sections
    function showTab(tabName) {
        profileContainer.innerHTML = "";
        
        const profile = mockData.Celebrity;

        if (tabName === "Biography") {
            const bio = document.createElement("p");
            bio.classList.add("bio");
            bio.textContent = profile.bio;
            profileContainer.appendChild(bio);
        }

        if (tabName === "Career") {
            const careerList = document.createElement("ul");
            careerList.classList.add("career-list");
            profile.career.forEach(careerEvent => {
                const li = document.createElement("li");
                li.textContent = careerEvent;
                careerList.appendChild(li);
            });
            profileContainer.appendChild(careerList);
        }

        if (tabName === "Social Media") {
            const socialLinks = document.createElement("div");
            socialLinks.classList.add("social-links");
            
            Object.entries(profile.socialLinks).forEach(([platform, url]) => {
                const link = document.createElement("a");
                link.href = url;
                link.textContent = `Follow on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
                link.target = "_blank";
                socialLinks.appendChild(link);
            });

            profileContainer.appendChild(socialLinks);
        }

        if (tabName === "Gallery") {
            const gallery = document.createElement("div");
            gallery.classList.add("gallery");
            
            profile.mediaGallery.forEach(image => {
                const img = document.createElement("img");
                img.src = image;
                img.classList.add("gallery-item");
                gallery.appendChild(img);
            });

            profileContainer.appendChild(gallery);
        }
    }

    // Define categories for navigation
    const categories = [
        { label: "Biography", callback: showTab },
        { label: "Career", callback: showTab },
        { label: "Social Media", callback: showTab },
        { label: "Gallery", callback: showTab }
    ];

    const secondaryNav = secnav(categories);
    if (secondaryNav) peopleSection.appendChild(secondaryNav);

    // Initial tab load
    showTab("Biography"); // Default tab

    peopleSection.appendChild(profileContainer);
    contentContainer.appendChild(peopleSection);
}
