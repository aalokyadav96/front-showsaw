// --- Helper: createElement elegantly ---
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

// --- Helper: format Date elegantly ---
function formatDate(dateString) {
  const date = new Date(dateString);
  return isNaN(date) ? 'Unknown Date' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

// // --- Helper: render Tags neatly ---
// function renderTags(tags = []) {
//   if (!tags.length) return '';

//   return `
//     <div class="arena-tags">
//       ${tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
//     </div>
//   `;
// }

// --- Helper: render Upcoming Events ---
function renderUpcomingEvents(events = []) {
  if (!events.length) return '<p class="no-events">No upcoming events at this time.</p>';

  return `
    <div class="arena-events">
      <h3>Upcoming Events</h3>
      <ul>
        ${events.map(event => `<li><strong>${event.name}</strong> - ${formatDate(event.date)}</li>`).join('')}
      </ul>
    </div>
  `;
}

// --- Main: renderArena refined ---
function renderArena(data, container, isCreator = false) {
  const section = createElement('section', { class: 'arena-section' });

  section.innerHTML = `
    <header class="arena-header">
      <h2>🏟️ ${data.name || "Unnamed Arena"}</h2>
      <p class="arena-location"><strong>Location:</strong> ${data.address || "Unknown Location"}</p>
    </header>

    <div class="arena-details">
      <p><strong>Capacity:</strong> ${data.capacity || "Not specified"}</p>
      <p><strong>Description:</strong> ${data.description || "No description available."}</p>
      <p><strong>Category:</strong> ${data.category || "N/A"}</p>
    </div>


    ${data.custom_fields ? `
      <div class="arena-custom">
        <h3>Additional Information</h3>
        ${Object.entries(data.custom_fields).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')}
      </div>
    ` : ""}

    ${renderUpcomingEvents(data.upcoming_events)}
  `;

  container.appendChild(section);
}

export { renderArena };
