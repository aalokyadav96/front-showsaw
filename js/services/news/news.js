import { secnav } from "../../components/secNav.js"; // adjust path as needed

export function displayNews(contentContainer, isLoggedIn) {
    if (!contentContainer) {
        console.error("Content container not found!");
        return;
    }

    const newsSection = document.createElement("section");
    newsSection.classList.add("news-section");

    const articlesContainer = document.createElement("div");
    articlesContainer.classList.add("articles-container");

    const newsData = {
        Technology: [
            {
                title: "AI Advances in Web Development",
                content: "AI is making coding easier and more efficient.",
                author: "John Doe",
                date: "May 8, 2025",
            },
        ],
        Politics: [
            {
                title: "Government Announces New Policies",
                content: "New laws aim to improve economic growth.",
                author: "Jane Smith",
                date: "May 7, 2025",
            },
        ],
        Sports: [
            {
                title: "Championship Finals Today!",
                content: "Teams are ready for the thrilling season finale.",
                author: "Alex Johnson",
                date: "May 6, 2025",
            },
        ],
        Entertainment: [
            {
                title: "Blockbuster Movie Releases",
                content: "Upcoming films are set to break records.",
                author: "Emily Davis",
                date: "May 5, 2025",
            },
        ],
    };

    function showCategory(category) {
        articlesContainer.innerHTML = "";
        if (newsData[category]) {
            newsData[category].forEach((newsItem) => {
                const article = document.createElement("article");
                article.classList.add("news-article");

                const title = document.createElement("h2");
                title.textContent = newsItem.title;
                article.appendChild(title);

                const metaInfo = document.createElement("p");
                metaInfo.classList.add("meta-info");
                metaInfo.textContent = `By ${newsItem.author} | ${newsItem.date}`;
                article.appendChild(metaInfo);

                const content = document.createElement("p");
                content.textContent = newsItem.content;
                article.appendChild(content);

                articlesContainer.appendChild(article);
            });
        }
    }

    // Define categories with optional routing or callbacks
    const categories = [
        { label: "Technology", callback: showCategory },
        { label: "Politics", callback: showCategory },
        { label: "Sports", callback: showCategory },
        { label: "Entertainment", callback: showCategory },
        // { label: "External Link", href: "/some/route" } // if needed
    ];

    const secondaryNav = secnav(categories);
    if (secondaryNav) newsSection.appendChild(secondaryNav);

    newsSection.appendChild(articlesContainer);

    showCategory("Technology"); // Default

    contentContainer.appendChild(newsSection);
}
