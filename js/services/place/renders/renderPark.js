function renderPark(data, container, isCreator) {
  const section = document.createElement("section");
  section.classList.add("park");

  const media = (data.gallery || []).map(url => `<img class="park-img" src="/media/${url}" />`).join("");
  const tags = (data.tags || []).map(tag => `<span class="tag">${tag}</span>`).join(" ");

  section.innerHTML = `
    <h2>🏞️ Welcome to ${data.name}</h2>

    ${isCreator ? `
      <div class="creator-tools">
        <button>Edit Park Info</button>
        <button>Upload Gallery</button>
        <button>Add Park Event</button>
      </div>` : ""
    }

    <p><strong>Description:</strong> ${data.description || "No description provided."}</p>
    <p><strong>Location:</strong> ${data.address || "Unknown"}</p>
    <p><strong>Tags:</strong> ${tags || "None"}</p>
    <p><strong>Accessibility:</strong> ${data.accessibility_info || "Not specified"}</p>

    ${media ? `
      <div class="park-gallery">
        <h3>📸 Gallery</h3>
        ${media}
      </div>` : ""
    }

    ${(data.tickets && data.tickets.length > 0) ? `
      <div class="park-events">
        <h3>🌳 Park Events</h3>
        ${data.tickets.map(e => `
          <div class="event">
            <h4>${e.title}</h4>
            <p>${new Date(e.date).toLocaleString()}</p>
            <button>Join Event</button>
          </div>
        `).join("")}
      </div>` : "<p>No upcoming events.</p>"
    }
  `;

  container.appendChild(section);
}
export { renderPark };
