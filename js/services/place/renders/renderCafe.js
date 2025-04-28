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

// --- Main: renderCafe ---
function renderCafe(data, container, isCreator = false) {
  const section = createElement('section', { class: 'cafe-section' });

  section.innerHTML = `
    <header class="cafe-header">
      <h2>☕ ${data.name || "Unnamed Café"}</h2>
      <p class="cafe-address">${data.address || "Unknown Location"}</p>
    </header>

    <div class="cafe-overview">
      <p><em>${data.description || "A cozy place to enjoy a good cup."}</em></p>
      <p><strong>Specialties:</strong> ${data.specialties?.join(', ') || "Coffee and Conversations"}</p>
      <p><strong>Seating:</strong> ${data.seating || "Indoor & Outdoor"}</p>
    </div>

    ${data.tags?.length ? `
      <div class="cafe-tags">
        ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
      </div>
    ` : ""}

    ${data.custom_fields ? `
      <div class="cafe-custom">
        <h3>More About Us</h3>
        ${Object.entries(data.custom_fields).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')}
      </div>
    ` : ""}
  `;

  container.appendChild(section);
}

export { renderCafe };
