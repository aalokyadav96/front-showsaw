import { secnav } from "../../components/secNav.js";

export async function displayBlog(contentContainer, isLoggedIn) {
    if (!contentContainer) {
        console.error("Content container not found!");
        return;
    }

    const blogSection = document.createElement("section");
    blogSection.classList.add("blog-section");

    const blogContainer = document.createElement("div");
    blogContainer.classList.add("blog-container");

    const blogData = {
        Tech: [
            {
                title: "The Rise of Edge Computing",
                author: "Samantha Tech",
                date: "May 6, 2025",
                excerpt: "With devices becoming smarter, edge computing brings low-latency solutions closer to users."
            },
            {
                title: "Why Rust is Gaining Popularity",
                author: "Code Ninja",
                date: "May 3, 2025",
                excerpt: "Rust offers memory safety and performance without a garbage collector. Here's why devs love it."
            }
        ],
        Lifestyle: [
            {
                title: "Minimalism in Daily Life",
                author: "Life Curator",
                date: "May 4, 2025",
                excerpt: "Declutter your mind and space by embracing minimalism in your routines and environment."
            }
        ],
        Travel: [
            {
                title: "Hidden Beaches in South India",
                author: "Wanderer",
                date: "May 2, 2025",
                excerpt: "Away from the crowds, these lesser-known beaches offer serenity and stunning views."
            }
        ],
        Opinion: [
            {
                title: "Why Social Media Needs a Reset",
                author: "Critical Mind",
                date: "May 1, 2025",
                excerpt: "Platforms have changed how we interact, but is it time to reconsider how we use them?"
            }
        ]
    };

    function showCategory(category) {
        blogContainer.innerHTML = "";

        if (!blogData[category]) return;

        blogData[category].forEach(post => {
            const article = document.createElement("article");
            article.classList.add("blog-post");

            const title = document.createElement("h2");
            title.textContent = post.title;
            article.appendChild(title);

            const meta = document.createElement("p");
            meta.className = "blog-meta";
            meta.textContent = `By ${post.author} | ${post.date}`;
            article.appendChild(meta);

            const excerpt = document.createElement("p");
            excerpt.textContent = post.excerpt;
            article.appendChild(excerpt);

            blogContainer.appendChild(article);
        });
    }

    const categories = [
        { label: "Tech", callback: showCategory },
        { label: "Lifestyle", callback: showCategory },
        { label: "Travel", callback: showCategory },
        { label: "Opinion", callback: showCategory }
    ];

    const secondaryNav = secnav(categories);
    if (secondaryNav) blogSection.appendChild(secondaryNav);

    showCategory("Tech"); // default

    blogSection.appendChild(blogContainer);
    contentContainer.appendChild(blogSection);
}
