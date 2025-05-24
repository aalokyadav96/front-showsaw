import { SRC_URL } from "../../api/api.js";
import { apiFetch } from "../../api/api.js";
import { navigate } from "../../routes/index.js";

let currentPage = 0;
const pageSize = 10;
let allArtists = [];
let filteredArtists = [];

export async function displayArtists(container, isLoggedIn) {
  // Clear container
  container.innerHTML = '';
  currentPage = 0;

  try {
    // Fetch artists from API
    const artists = await apiFetch(`/artists`);
    allArtists = artists;
    filteredArtists = [...allArtists]; // clone

    // Search and Filter UI
    const controls = createSearchAndFilterUI();
    container.appendChild(controls.wrapper);

    // Artist Grid
    const grid = document.createElement("section");
    grid.className = "artists-grid";
    controls.grid = grid;
    container.appendChild(grid);

    // Initial Render
    renderNextPage(grid, filteredArtists, isLoggedIn);

    // Infinite scroll
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        renderNextPage(grid, filteredArtists, isLoggedIn);
      }
    }, {
      rootMargin: '100px'
    });

    // Lazy loader sentinel
    const sentinel = document.createElement('div');
    sentinel.id = 'lazy-loader';
    container.appendChild(sentinel);
    observer.observe(sentinel);

    // Hook up filtering
    controls.searchInput.addEventListener('input', () => {
      filterAndReset(controls, grid, isLoggedIn);
    });

    controls.filterSelect.addEventListener('change', () => {
      filterAndReset(controls, grid, isLoggedIn);
    });

  } catch (error) {
    const errMsg = document.createElement("p");
    errMsg.className = "error-message";
    errMsg.textContent = `Error: ${error.message}`;
    container.appendChild(errMsg);
  }
}

function createSearchAndFilterUI() {
  const wrapper = document.createElement('div');
  wrapper.className = 'artist-controls';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search artists...';
  searchInput.className = 'artist-search';

  const filterSelect = document.createElement('select');
  filterSelect.className = 'artist-filter';
  const defaultOpt = new Option('All Categories', '');
  filterSelect.appendChild(defaultOpt);

  // Populate dynamically later
  const categories = new Set();
  allArtists.forEach(a => categories.add(a.category));
  [...categories].sort().forEach(cat => {
    const opt = new Option(cat, cat);
    filterSelect.appendChild(opt);
  });

  wrapper.appendChild(searchInput);
  wrapper.appendChild(filterSelect);

  return { wrapper, searchInput, filterSelect };
}

function renderNextPage(grid, artists, isLoggedIn) {
  const start = currentPage * pageSize;
  const end = start + pageSize;
  const pageItems = artists.slice(start, end);

  pageItems.forEach(artist => {
    const card = document.createElement("article");
    card.className = "artist-card";

    const img = document.createElement("img");
    img.className = "artist-photo";
    img.src = artist.photo
      ? `${SRC_URL}/artistpic/photo/${artist.photo}`
      : `https://via.placeholder.com/300x300?text=No+Image`;
    img.alt = `${artist.name}'s photo`;
    card.appendChild(img);

    const name = document.createElement("h3");
    name.textContent = artist.name;
    card.appendChild(name);

    const category = document.createElement("p");
    category.className = "artist-category";
    category.textContent = artist.category;
    card.appendChild(category);

    const bio = document.createElement("p");
    bio.className = "artist-bio";
    bio.textContent = artist.bio?.substring(0, 100) + '...' || '';
    card.appendChild(bio);

    const viewBtn = document.createElement("button");
    viewBtn.className = "artist-view-btn";
    viewBtn.textContent = "View Details";
    viewBtn.addEventListener("click", () => {
      navigate(`/artist/${artist.artistid}`);
    });
    card.appendChild(viewBtn);

    if (isLoggedIn) {
      const editBtn = document.createElement("button");
      editBtn.className = "artist-edit-btn";
      editBtn.textContent = "Edit Artist";
      editBtn.addEventListener("click", () => {
        navigate(`/artist/edit/${artist.artistid}`);
      });
      card.appendChild(editBtn);
    }

    grid.appendChild(card);
  });

  currentPage++;
}

function filterAndReset(controls, grid, isLoggedIn) {
  const searchTerm = controls.searchInput.value.toLowerCase();
  const selectedCategory = controls.filterSelect.value;

  filteredArtists = allArtists.filter(artist => {
    const matchName = artist.name.toLowerCase().includes(searchTerm);
    const matchCategory = selectedCategory ? artist.category === selectedCategory : true;
    return matchName && matchCategory;
  });

  // Reset
  currentPage = 0;
  grid.innerHTML = '';
  renderNextPage(grid, filteredArtists, isLoggedIn);
}

// import { SRC_URL } from "../../api/api.js";
// import { apiFetch } from "../../api/api.js";
// import { navigate } from "../../routes/index.js";

// export async function displayArtists(container, isLoggedIn) {
//   // Clear container
//   while (container.firstChild) {
//     container.removeChild(container.firstChild);
//   }

//   try {
//     const artists = await apiFetch(`/artists`);

//     // Page Header
//     const header = document.createElement("header");
//     const title = document.createElement("h2");
//     title.textContent = "All Artists";
//     header.appendChild(title);
//     container.appendChild(header);

//     // Grid container
//     const artistsGrid = document.createElement("section");
//     artistsGrid.className = "artists-grid";

//     artists.forEach((artist) => {
//       const card = document.createElement("article");
//       card.className = "artist-card";

//       // Artist Image
//       if (artist.photo) {
//         const img = document.createElement("img");
//         img.src = `${SRC_URL}/artistpic/photo/${artist.photo}`;
//         img.alt = `${artist.name}'s photo`;
//         img.className = "artist-photo";
//         card.appendChild(img);
//       }

//       // Artist Name
//       const name = document.createElement("h3");
//       name.textContent = artist.name;
//       card.appendChild(name);

//       // Category (e.g., Singer, Group)
//       const category = document.createElement("p");
//       category.className = "artist-category";
//       category.textContent = artist.category;
//       card.appendChild(category);

//       // Bio (short)
//       if (artist.bio) {
//         const bio = document.createElement("p");
//         bio.className = "artist-bio";
//         bio.textContent = artist.bio.length > 100
//           ? artist.bio.substring(0, 100) + "..."
//           : artist.bio;
//         card.appendChild(bio);
//       }

//       // View Details Button
//       const viewBtn = document.createElement("button");
//       viewBtn.className = "artist-view-btn";
//       viewBtn.textContent = "View Details";
//       viewBtn.addEventListener("click", () => {
//         navigate(`/artist/${artist.artistid}`);
//       });
//       card.appendChild(viewBtn);

//       // Optional: Edit button
//       if (isLoggedIn) {
//         const editBtn = document.createElement("button");
//         editBtn.className = "artist-edit-btn";
//         editBtn.textContent = "Edit Artist";
//         editBtn.addEventListener("click", () => {
//           navigate(`/artist/edit/${artist.artistid}`);
//         });
//         card.appendChild(editBtn);
//       }

//       artistsGrid.appendChild(card);
//     });

//     container.appendChild(artistsGrid);
//   } catch (error) {
//     const errMsg = document.createElement("p");
//     errMsg.className = "error-message";
//     errMsg.textContent = `Error: ${error.message}`;
//     container.appendChild(errMsg);
//   }
// }

// // import { SRC_URL } from "../../api/api.js";
// // import { apiFetch } from "../../api/api.js";
// // import {navigate} from "../../routes/index.js";

// // export async function displayArtists(container, isLoggedIn) {
// //     // Clear existing content
// //     while (container.firstChild) {
// //         container.removeChild(container.firstChild);
// //     }

// //     try {
// //         // Fetch all artists from the server
// //         const response = await apiFetch(`/artists`);
// //         // if (!response.ok) {
// //         //     throw new Error("Failed to fetch artists");
// //         // }

// //         // const artists = await response.json();
// //         const artists = await response;

// //         // Create a header for the artists list
// //         const header = document.createElement("h2");
// //         header.textContent = "All Artists";
// //         container.appendChild(header);

// //         // Create a grid or list container for artists
// //         const artistsGrid = document.createElement("div");
// //         artistsGrid.className = "artists-grid";

// //         artists.forEach(artist => {
// //             // Create a card for each artist
// //             const artistCard = document.createElement("div");
// //             artistCard.className = "artist-card";

// //             const name = document.createElement("h3");
// //             name.textContent = artist.name;
// //             artistCard.appendChild(name);

// //             const category = document.createElement("p");
// //             category.textContent = `${artist.category}`;
// //             artistCard.appendChild(category);

// //             if (artist.photo) {
// //                 const photo = document.createElement("img");
// //                 photo.src = `${SRC_URL}/artistpic/photo/${artist.photo}`;
// //                 photo.alt = `${artist.name}'s photo`;
// //                 photo.className = "artist-photo";
// //                 artistCard.appendChild(photo);
// //             }

// //             const bio = document.createElement("p");
// //             bio.textContent = `${artist.bio.substring(0, 100)}...`; // Shortened bio
// //             artistCard.appendChild(bio);

// //             // Add a "View Details" button
// //             const viewDetailsBtn = document.createElement("button");
// //             viewDetailsBtn.textContent = "View Details";
// //             viewDetailsBtn.addEventListener("click", () => {
// //                 navigate(`/artist/${artist.artistid}`); // Navigate to artist details page
// //             });
// //             artistCard.appendChild(viewDetailsBtn);

// //             // // Add an edit button if the user is logged in
// //             // if (isLoggedIn) {
// //             //     const editBtn = document.createElement("button");
// //             //     editBtn.textContent = "Edit Artist";
// //             //     editBtn.addEventListener("click", () => {
// //             //         navigate(`/artist/edit/${artist.id}`); // Navigate to edit page
// //             //     });
// //             //     artistCard.appendChild(editBtn);
// //             // }

// //             artistsGrid.appendChild(artistCard);
// //         });

// //         container.appendChild(artistsGrid);

// //     } catch (error) {
// //         // Display an error message if artists can't be fetched
// //         const errorMessage = document.createElement("p");
// //         errorMessage.textContent = `Error: ${error.message}`;
// //         container.appendChild(errorMessage);
// //     }
// // }
