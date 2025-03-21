import { navigate } from "../routes/index.js";

// Global per-section counters and flags.
let sectionPageCounters = {
  recommended_events: 1,
  recommended_places: 1,
  followed_posts: 1,
  ads: 1,
};
const pageLimit = 5;
let sectionLoading = {
  recommended_events: false,
  recommended_places: false,
  followed_posts: false,
  ads: false,
};
let sectionHasMoreData = {
  recommended_events: true,
  recommended_places: true,
  followed_posts: true,
  ads: true,
};

/**
 * Loads data for a given section.
 * @param {string} sectionKey - The key of the section (e.g. "recommended_events").
 * @param {HTMLElement} container - The parent container that holds the section.
 * @param {boolean} append - Whether to append data or replace existing data.
 */
async function loadSection(sectionKey, container, append = false) {
  if (sectionLoading[sectionKey] || !sectionHasMoreData[sectionKey] || sectionPageCounters[sectionKey] > pageLimit) return;
  sectionLoading[sectionKey] = true;
  
  const cacheKey = "cachedFeed_" + sectionKey;
  if (!append) {
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      renderSection(container, sectionKey, JSON.parse(cachedData), false);
      console.log(`Loaded ${sectionKey} from cache`);
      sectionLoading[sectionKey] = false;
      updateLoadMoreButtonForSection(container, sectionKey);
      return;
    }
  }
  
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }
    
    const response = await fetch("http://localhost:5000/api/home_feed_section", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user, section: sectionKey, page: sectionPageCounters[sectionKey] })
    });
    
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    
    // Cache the initial page (only when not appending)
    if (!append) {
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    }
    
    // If no items returned, mark as no more data.
    if (!data || data.length === 0) {
      sectionHasMoreData[sectionKey] = false;
    }
    
    renderSection(container, sectionKey, data, append);
    sectionPageCounters[sectionKey]++;
  } catch (error) {
    console.error(`Error fetching ${sectionKey}:`, error);
    displaySectionDummyData(container, sectionKey);
  } finally {
    sectionLoading[sectionKey] = false;
    updateLoadMoreButtonForSection(container, sectionKey);
  }
}

/**
 * Renders items for a specific section.
 * @param {HTMLElement} container - The parent container that holds all sections.
 * @param {string} sectionKey - The key of the section.
 * @param {Array} data - Array of items for the section.
 * @param {boolean} append - Whether to append to the existing items.
 */
function renderSection(container, sectionKey, data, append) {
  // Each section gets its own sub-container with an id like "section-container-recommended_events".
  let sectionContainer = container.querySelector("#section-container-" + sectionKey);
  if (!append) {
    if (sectionContainer) {
      while (sectionContainer.firstChild) {
        sectionContainer.removeChild(sectionContainer.firstChild);
      }
    }
  }
  if (!sectionContainer) {
    sectionContainer = document.createElement("div");
    sectionContainer.id = "section-container-" + sectionKey;
    container.appendChild(sectionContainer);
  }
  
  // Append each item as a card.
  data.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("feed-card");
    
    const titleEl = document.createElement("h4");
    const descEl = document.createElement("p");
    
    if (item.title) {
      titleEl.textContent = item.title;
      descEl.textContent = item.location || item.description;
    } else if (item.name) {
      titleEl.textContent = item.name;
      descEl.textContent = item.location;
    } else if (item.user && item.content) {
      titleEl.textContent = `${item.user}:`;
      descEl.textContent = item.content;
    }
    
    card.appendChild(titleEl);
    card.appendChild(descEl);
    sectionContainer.appendChild(card);
  });
}

/**
 * Updates the "Load More" button for a specific section.
 * @param {HTMLElement} container - The parent container.
 * @param {string} sectionKey - The key of the section.
 */
function updateLoadMoreButtonForSection(container, sectionKey) {
  // Button id: "load-more-btn-" + sectionKey.
  let btn = container.querySelector("#load-more-btn-" + sectionKey);
  if (sectionHasMoreData[sectionKey] && sectionPageCounters[sectionKey] <= pageLimit) {
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "load-more-btn-" + sectionKey;
      btn.textContent = "Load More " + formatSectionTitle(sectionKey);
      btn.setAttribute("aria-label", "Load More " + formatSectionTitle(sectionKey));
      btn.addEventListener("click", () => loadSection(sectionKey, container, true));
      container.appendChild(btn);
    } else {
      btn.style.display = "block";
    }
  } else if (btn) {
    btn.style.display = "none";
    const endMessage = document.createElement("p");
    endMessage.textContent = "No more " + formatSectionTitle(sectionKey).toLowerCase() + " available.";
    container.appendChild(endMessage);
  }
}

/**
 * Displays a fallback message for a section if data cannot be loaded.
 * @param {HTMLElement} container - The parent container.
 * @param {string} sectionKey - The key of the section.
 */
function displaySectionDummyData(container, sectionKey) {
  let sectionContainer = container.querySelector("#section-container-" + sectionKey);
  if (!sectionContainer) {
    sectionContainer = document.createElement("div");
    sectionContainer.id = "section-container-" + sectionKey;
    container.appendChild(sectionContainer);
  }
  while (sectionContainer.firstChild) {
    sectionContainer.removeChild(sectionContainer.firstChild);
  }
  const message = document.createElement("p");
  message.textContent = `Something went wrong. ${formatSectionTitle(sectionKey)} is not available.`;
  sectionContainer.appendChild(message);
}

/**
 * Formats a section key into a human-friendly title.
 * @param {string} sectionKey
 * @returns {string}
 */
function formatSectionTitle(sectionKey) {
  if (sectionKey === "recommended_events") return "Recommended Events";
  if (sectionKey === "recommended_places") return "Recommended Places";
  if (sectionKey === "followed_posts") return "Followed Posts";
  if (sectionKey === "ads") return "Advertisements";
  return sectionKey;
}

/**
 * Smoothly scrolls to a section given its title.
 * @param {string} title - The title to scroll to.
 */
function scrollToSection(title) {
  const headings = document.querySelectorAll("h2");
  const target = Array.from(headings).find(h2 => h2.textContent === title);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  }
}

/**
 * Refreshes all sections by clearing caches and resetting counters.
 * @param {HTMLElement} container - The container that holds all sections.
 */
function refreshSections(container) {
  // Remove caches for all sections.
  ["recommended_events", "recommended_places", "followed_posts", "ads"].forEach(key => {
    sessionStorage.removeItem("cachedFeed_" + key);
  });
  Home(true, container);
}

/**
 * Initializes the home page with a sticky header and separate sections.
 * @param {boolean} isLoggedIn - User's login status.
 * @param {HTMLElement} container - The container element for the feed.
 */
function Home(isLoggedIn, container) {
  // Reset global variables.
  sectionPageCounters = {
    recommended_events: 1,
    recommended_places: 1,
    followed_posts: 1,
    ads: 1,
  };
  sectionLoading = {
    recommended_events: false,
    recommended_places: false,
    followed_posts: false,
    ads: false,
  };
  sectionHasMoreData = {
    recommended_events: true,
    recommended_places: true,
    followed_posts: true,
    ads: true,
  };

  // Create the sticky header.
  const header = document.createElement("div");
  header.classList.add("sticky-header");

  const buttons = [
    { text: "Followed Posts", section: "followed_posts" },
    { text: "Events", section: "recommended_events" },
    { text: "Places", section: "recommended_places" },
    { text: "Ads", section: "ads" },
    // { text: "🔄 Refresh", action: () => refreshSections(feedContainer) }
  ];

  buttons.forEach(({ text, section, action }) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.setAttribute("aria-label", text);
    if (action) {
      btn.addEventListener("click", action);
    } else {
      btn.addEventListener("click", () => scrollToSection(formatSectionTitle(section)));
    }
    header.appendChild(btn);
  });

  container.appendChild(header);

  // Create a container to hold all sections.
  const feedContainer = document.createElement("div");
  container.appendChild(feedContainer);

  // Define sections configuration.
  const sectionsConfig = [
    { key: "followed_posts", title: "Followed Posts" },
    { key: "recommended_events", title: "Recommended Events" },
    { key: "recommended_places", title: "Recommended Places" },
    { key: "ads", title: "Advertisements" }
  ];

  // For each section, add a header (h2) and load initial data.
  sectionsConfig.forEach(section => {
    const sectionHeader = document.createElement("h2");
    sectionHeader.textContent = section.title;
    feedContainer.appendChild(sectionHeader);
    loadSection(section.key, feedContainer);
  });
}

export { Home };
