// --- Helper: createElement ---
function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  children.forEach(child => {
    if (typeof child === "string") {
      element.innerHTML += child;
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });
  return element;
}

// --- Main: renderRestaurant ---
function renderRestaurant(data, container, isCreator = false) {
  const section = createElement('section', { class: 'restaurant-section' });

  section.innerHTML = `
    <header class="restaurant-header">
      <h2>🍽️ ${data.name || "Unnamed Restaurant"}</h2>
      <p class="restaurant-address">${data.address || "Unknown Address"}</p>
    </header>

    <div class="restaurant-overview">
      <p><strong>Cuisine:</strong> ${data.cuisine || "Various"}</p>
      <p><strong>Fine Dining:</strong> ${data.fine_dining ? "Yes" : "Casual"}</p>
      <p><strong>Description:</strong> ${data.description || "An unforgettable dining experience."}</p>
    </div>

    ${data.tags?.length ? `
      <div class="restaurant-tags">
        ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
      </div>
    ` : ""}

    ${data.custom_fields ? `
      <div class="restaurant-custom">
        <h3>Highlights</h3>
        ${Object.entries(data.custom_fields).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')}
      </div>
    ` : ""}
  `;

  container.appendChild(section);
}

export { renderRestaurant };
