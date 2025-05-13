import { secnav } from "../../components/secNav.js";

export async function displayJobs(contentContainer, isLoggedIn) {
    if (!contentContainer) {
        console.error("Content container not found!");
        return;
    }

    const jobsSection = document.createElement("section");
    jobsSection.classList.add("jobs-section");

    const jobsContainer = document.createElement("div");
    jobsContainer.classList.add("jobs-container");

    const jobsData = {
        "Corporate Jobs": [
            {
                title: "Frontend Developer",
                company: "TechCorp",
                location: "Remote",
                date: "May 9, 2025",
                description: "Looking for a JavaScript developer experienced in modern frameworks."
            },
            {
                title: "Marketing Analyst",
                company: "MarketBase",
                location: "Mumbai",
                date: "May 7, 2025",
                description: "Analyze trends and help shape marketing strategies."
            }
        ],
        "Freelance Gigs": [
            {
                title: "Logo Design Needed",
                client: "Startup X",
                location: "Remote",
                date: "May 6, 2025",
                description: "Simple but modern logo for a new tech startup."
            },
            {
                title: "Blog Writer",
                client: "TravelLite",
                location: "Remote",
                date: "May 5, 2025",
                description: "Write 3 articles/week about travel destinations."
            }
        ],
        "Skilled Trades": [
            {
                title: "Plumber for Kitchen Renovation",
                contact: "HomeFix Co.",
                location: "Delhi",
                date: "May 4, 2025",
                description: "Experienced plumber needed for a week-long project."
            },
            {
                title: "Electrician - Urgent",
                contact: "QuickFix Services",
                location: "Bangalore",
                date: "May 3, 2025",
                description: "Urgent wiring fix needed in office building."
            }
        ],
        "Mobile Vendors": [
            {
                title: "Food Truck for Event",
                contact: "BigBites",
                location: "Chennai",
                date: "May 2, 2025",
                description: "Seeking a food truck vendor for a college fest."
            },
            {
                title: "Ice Cream Cart for Birthday Party",
                contact: "CoolTreats",
                location: "Kolkata",
                date: "May 1, 2025",
                description: "Cart needed for a 2-hour birthday event."
            }
        ]
    };

    function showCategory(category) {
        jobsContainer.innerHTML = "";

        if (!jobsData[category]) return;

        jobsData[category].forEach(job => {
            const card = document.createElement("div");
            card.classList.add("job-card");

            const title = document.createElement("h3");
            title.textContent = job.title;
            card.appendChild(title);

            const meta = document.createElement("p");
            meta.className = "job-meta";
            const source = job.company || job.client || job.contact || "Unknown";
            meta.textContent = `${source} | ${job.location} | ${job.date}`;
            card.appendChild(meta);

            const desc = document.createElement("p");
            desc.textContent = job.description;
            card.appendChild(desc);

            jobsContainer.appendChild(card);
        });
    }

    const categories = [
        { label: "Corporate Jobs", callback: showCategory },
        { label: "Freelance Gigs", callback: showCategory },
        { label: "Skilled Trades", callback: showCategory },
        { label: "Mobile Vendors", callback: showCategory }
    ];

    const secondaryNav = secnav(categories);
    if (secondaryNav) jobsSection.appendChild(secondaryNav);

    showCategory("Corporate Jobs"); // default

    jobsSection.appendChild(jobsContainer);
    contentContainer.appendChild(jobsSection);
}
