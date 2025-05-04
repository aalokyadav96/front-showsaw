import RenderMenu from "../../../components/ui/MenuRender.mjs";

// --- Helper: createElement ---
function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  children.forEach(child => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });
  return element;
}

// --- Modular Section Builders ---
function buildHeader(data) {
  return createElement('header', { class: 'restaurant-header' }, [
    createElement('h2', {}, [`🍽️ ${data.name || "Unnamed Restaurant"}`]),
    createElement('p', { class: 'restaurant-address' }, [data.address || "Unknown Address"]),
    data.rating ? createElement('p', { class: 'restaurant-rating' }, [`⭐ ${data.rating} / 5`]) : null
  ].filter(Boolean));
}

function buildGallery(images = []) {
  if (!images.length) return null;
  return createElement('div', { class: 'restaurant-gallery' },
    images.map(src => createElement('img', { src, alt: 'Restaurant image' }))
  );
}

function buildOverview(data) {
  return createElement('div', { class: 'restaurant-overview' }, [
    createElement('p', {}, [createElement('strong', {}, ["Cuisine:"]), ` ${data.cuisine || "Various"}`]),
    createElement('p', {}, [createElement('strong', {}, ["Fine Dining:"]), ` ${data.fine_dining ? "Yes" : "Casual"}`]),
    createElement('p', {}, [createElement('strong', {}, ["Price Range:"]), ` ${data.price_range || "$$"}`]),
    createElement('p', {}, [createElement('strong', {}, ["Description:"]), ` ${data.description || "An unforgettable dining experience."}`])
  ]);
}

// function buildTags(tags = []) {
//   if (!tags.length) return null;
//   return createElement('div', { class: 'restaurant-tags' },
//     tags.map(tag => createElement('span', { class: 'tag' }, [tag]))
//   );
// }

function buildHours(opening_hours = {}) {
  if (!Object.keys(opening_hours).length) return null;
  return createElement('div', { class: 'restaurant-hours' }, [
    createElement('h3', {}, ["Opening Hours"]),
    ...Object.entries(opening_hours).map(([day, time]) =>
      createElement('p', {}, [createElement('strong', {}, [day + ":"]), ` ${time}`])
    )
  ]);
}

function buildContact(contact = {}) {
  if (!contact || (!contact.phone && !contact.email && !contact.website)) return null;
  return createElement('div', { class: 'restaurant-contact' }, [
    createElement('h3', {}, ["Contact"]),
    contact.phone ? createElement('p', {}, [createElement('strong', {}, ["Phone:"]), ` ${contact.phone}`]) : null,
    contact.email ? createElement('p', {}, [createElement('strong', {}, ["Email:"]), ` ${contact.email}`]) : null,
    contact.website ? createElement('p', {}, [
      createElement('a', { href: contact.website, target: "_blank" }, ["Visit Website"])
    ]) : null
  ].filter(Boolean));
}

// function buildCustomFields(custom_fields = {}) {
//   if (!Object.keys(custom_fields).length) return null;
//   return createElement('div', { class: 'restaurant-custom' }, [
//     createElement('h3', {}, ["Highlights"]),
//     ...Object.entries(custom_fields).map(([key, value]) =>
//       createElement('p', {}, [createElement('strong', {}, [key + ":"]), ` ${value}`])
//     )
//   ]);
// }

function buildActions() {
  return createElement('div', { class: 'restaurant-actions' }, [
    createElement('button', { class: 'btn-reserve' }, ["Reserve a Table"]),
    createElement('button', { class: 'btn-order' }, ["Order Online"])
  ]);
}

function buildMenu(isCreator, placeId, isLoggedIn) {
  // Render Menu
  const menuContainer = createElement('div');
  RenderMenu(menuContainer, isCreator, placeId, isLoggedIn);

  return menuContainer
}

// function buildMap(address = "") {
//   if (!address) return null;
//   return createElement('div', { class: 'restaurant-map' }, [
//     createElement('iframe', {
//       src: `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`,
//       frameborder: "0",
//       allowfullscreen: ""
//     })
//   ]);
// }

// --- Main: renderRestaurant ---
function renderRestaurant(data, container, isCreator = false, isLoggedIn = false, placeId) {
  const section = createElement('section', { class: 'restaurant-section' });

  const contentBlocks = [
    buildHeader(data),
    buildGallery(data.images),
    buildOverview(data),
    // buildTags(data.tags),
    buildHours(data.opening_hours),
    buildContact(data.contact),
    // buildCustomFields(data.custom_fields),
    buildActions(),
    // buildMenu(isCreator, placeId, isLoggedIn),
    // buildMap(data.address)
  ];

  contentBlocks.forEach(block => {
    if (block) section.appendChild(block);
  });

  // Final Append
  container.appendChild(section);
}

export { renderRestaurant };

// import RenderMenu from "../../../components/ui/MenuRender.mjs";

// // --- Helper: createElement ---
// function createElement(tag, attributes = {}, children = []) {
//   const element = document.createElement(tag);
//   for (const [key, value] of Object.entries(attributes)) {
//     element.setAttribute(key, value);
//   }
//   children.forEach(child => {
//     if (typeof child === "string") {
//       element.appendChild(document.createTextNode(child));
//     } else if (child instanceof Node) {
//       element.appendChild(child);
//     }
//   });
//   return element;
// }

// // --- Main: renderRestaurant ---
// function renderRestaurant(data, container, isCreator = false, isLoggedIn = false, placeId) {
//   const section = createElement('section', { class: 'restaurant-section' });

//   // Header
//   const header = createElement('header', { class: 'restaurant-header' }, [
//     createElement('h2', {}, [`🍽️ ${data.name || "Unnamed Restaurant"}`]),
//     createElement('p', { class: 'restaurant-address' }, [data.address || "Unknown Address"]),
//     data.rating ? createElement('p', { class: 'restaurant-rating' }, [`⭐ ${data.rating} / 5`]) : null
//   ].filter(Boolean));

//   section.appendChild(header);

//   // Image gallery
//   if (Array.isArray(data.images) && data.images.length) {
//     const gallery = createElement('div', { class: 'restaurant-gallery' },
//       data.images.map(src =>
//         createElement('img', { src, alt: 'Restaurant image' })
//       )
//     );
//     section.appendChild(gallery);
//   }

//   // Overview
//   const overview = createElement('div', { class: 'restaurant-overview' }, [
//     createElement('p', {}, [createElement('strong', {}, ["Cuisine:"]), ` ${data.cuisine || "Various"}`]),
//     createElement('p', {}, [createElement('strong', {}, ["Fine Dining:"]), ` ${data.fine_dining ? "Yes" : "Casual"}`]),
//     createElement('p', {}, [createElement('strong', {}, ["Price Range:"]), ` ${data.price_range || "$$"}`]),
//     createElement('p', {}, [createElement('strong', {}, ["Description:"]), ` ${data.description || "An unforgettable dining experience."}`])
//   ]);
//   section.appendChild(overview);

//   // Tags
//   if (data.tags?.length) {
//     const tagContainer = createElement('div', { class: 'restaurant-tags' },
//       data.tags.map(tag => createElement('span', { class: 'tag' }, [tag]))
//     );
//     section.appendChild(tagContainer);
//   }

//   // Opening hours
//   if (data.opening_hours) {
//     const hours = createElement('div', { class: 'restaurant-hours' }, [
//       createElement('h3', {}, ["Opening Hours"]),
//       ...Object.entries(data.opening_hours).map(([day, time]) =>
//         createElement('p', {}, [createElement('strong', {}, [day + ":"]), ` ${time}`])
//       )
//     ]);
//     section.appendChild(hours);
//   }

//   // Contact
//   if (data.contact) {
//     const contact = createElement('div', { class: 'restaurant-contact' }, [
//       createElement('h3', {}, ["Contact"]),
//       data.contact.phone ? createElement('p', {}, [createElement('strong', {}, ["Phone:"]), ` ${data.contact.phone}`]) : null,
//       data.contact.email ? createElement('p', {}, [createElement('strong', {}, ["Email:"]), ` ${data.contact.email}`]) : null,
//       data.contact.website ? createElement('p', {}, [
//         createElement('a', { href: data.contact.website, target: "_blank" }, ["Visit Website"])
//       ]) : null
//     ].filter(Boolean));
//     section.appendChild(contact);
//   }

//   // Custom Fields
//   if (data.custom_fields) {
//     const custom = createElement('div', { class: 'restaurant-custom' }, [
//       createElement('h3', {}, ["Highlights"]),
//       ...Object.entries(data.custom_fields).map(([key, value]) =>
//         createElement('p', {}, [createElement('strong', {}, [key + ":"]), ` ${value}`])
//       )
//     ]);
//     section.appendChild(custom);
//   }

//   // Call-to-action Buttons
//   const actions = createElement('div', { class: 'restaurant-actions' }, [
//     createElement('button', { class: 'btn-reserve' }, ["Reserve a Table"]),
//     createElement('button', { class: 'btn-order' }, ["Order Online"])
//   ]);
//   section.appendChild(actions);

//   // Map
//   const map = createElement('div', { class: 'restaurant-map' }, [
//     createElement('iframe', {
//       src: `https://maps.google.com/maps?q=${encodeURIComponent(data.address || '')}&output=embed`,
//       frameborder: "0",
//       allowfullscreen: "",
//     })
//   ]);
//   section.appendChild(map);

//   // Render Menu
//   const menuContainer = createElement('div');
//   RenderMenu(menuContainer, isCreator, placeId, isLoggedIn);
//   container.appendChild(menuContainer);

//   // Final Append
//   container.appendChild(section);
// }

// export { renderRestaurant };

// // import RenderMenu from "../../../components/ui/MenuRender.mjs";

// // // --- Helper: createElement ---
// // function createElement(tag, attributes = {}, children = []) {
// //   const element = document.createElement(tag);
// //   for (const [key, value] of Object.entries(attributes)) {
// //     element.setAttribute(key, value);
// //   }
// //   children.forEach(child => {
// //     if (typeof child === "string") {
// //       element.innerHTML += child;
// //     } else if (child instanceof Node) {
// //       element.appendChild(child);
// //     }
// //   });
// //   return element;
// // }

// // // --- Main: renderRestaurant ---
// // function renderRestaurant(data, container, isCreator = false, isLoggedIn = false, placeId) {
// //   const section = createElement('section', { class: 'restaurant-section' });

// //   let c = createElement('div');
// //   RenderMenu(c, isCreator, placeId, isLoggedIn)
// //   container.appendChild(c);

// //   section.innerHTML = `
// //     <header class="restaurant-header">
// //       <h2>🍽️ ${data.name || "Unnamed Restaurant"}</h2>
// //       <p class="restaurant-address">${data.address || "Unknown Address"}</p>
// //     </header>

// //     <div class="restaurant-overview">
// //       <p><strong>Cuisine:</strong> ${data.cuisine || "Various"}</p>
// //       <p><strong>Fine Dining:</strong> ${data.fine_dining ? "Yes" : "Casual"}</p>
// //       <p><strong>Description:</strong> ${data.description || "An unforgettable dining experience."}</p>
// //     </div>

// //     ${data.tags?.length ? `
// //       <div class="restaurant-tags">
// //         ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
// //       </div>
// //     ` : ""}

// //     ${data.custom_fields ? `
// //       <div class="restaurant-custom">
// //         <h3>Highlights</h3>
// //         ${Object.entries(data.custom_fields).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')}
// //       </div>
// //     ` : ""}
// //   `;

// //   container.appendChild(section);
// // }

// // export { renderRestaurant };
