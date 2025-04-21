
import Owl from "../../../components/ui/Owl.mjs";
import { createElement } from "../../../components/createElement.js";

function renderArena(data, container, isCreator) {
  const section = document.createElement("section");
  section.classList.add("arena");

  const eventList = (data.tickets || []).map(ticket => `
    <div class="event-card">
      <h3>${ticket.title || "Untitled Event"}</h3>
      <p><strong>Date:</strong> ${new Date(ticket.date || data.start_date_time).toLocaleString()}</p>
      <p><strong>Price:</strong> ₹${ticket.price || "Free"}</p>
      <button>🎟️ Book Now</button>
    </div>
  `).join("");

  const merchList = (data.merch || []).map(item => `
    <div class="merch-card">
      <img src="/media/${item.image || "placeholder.jpg"}" alt="${item.name}">
      <p>${item.name}</p>
      <p>₹${item.price}</p>
      <button>Add to Cart</button>
    </div>
  `).join("");

  const mediaGallery = (data.gallery || []).map(media => `
    <img class="arena-media" src="/media/${media}" loading="lazy" />
  `).join("");

  const tags = (data.tags || []).map(tag => `<span class="tag">${tag}</span>`).join(" ");

  const socialLinks = (data.social_links || []).map(link => `
    <a href="${link.url}" target="_blank">${link.platform}</a>
  `).join(" ");

  section.innerHTML = `
    <h2>🏟️ ${data.name || "Unknown"}</h2>

    ${isCreator ? `
      <!--div class="creator-tools">
        <button>Edit Arena Info</button>
        <button>Manage Events</button>
        <button>Upload Media</button>
      </div-->` : ""
    }

    <div class="arena-info">
      <p><strong>Description:</strong> ${data.description || "Unknown"}</p>
      <p><strong>Capacity:</strong> ${data.capacity || "Unknown"}</p>
      <p><strong>Category:</strong> ${data.category || "Unknown"}</p>
      <p><strong>Accessibility:</strong> ${data.accessibility_info || "Not specified"}</p>
      <p><strong>Tags:</strong> ${tags || "None"}</p>
      <p><strong>Website:</strong> ${data.website_url ? `<a href="${data.website_url}" target="_blank">Visit</a>` : "Not provided"}</p>
    </div>

    ${data.organizer_name || data.organizer_contact ? `
      <div class="organizer-info">
        <h3>📞 Organizer Info</h3>
        ${data.organizer_name ? `<p><strong>Name:</strong> ${data.organizer_name}</p>` : ""}
        ${data.organizer_contact ? `<p><strong>Contact:</strong> ${data.organizer_contact}</p>` : ""}
      </div>` : ""
    }

    <!--div class="arena-events">
      <h3>🎫 Upcoming Events</h3>
        ${eventList || "<p>No upcoming events.</p>"}
    </div-->

    ${data.merch?.length ? `
      <div class="arena-merch">
        <h3>🛍️ Arena Merchandise</h3>
        <div class="merch-list">${merchList}</div>
      </div>` : ""
    }

    ${mediaGallery ? `
      <div class="arena-gallery">
        <h3>🎥 Media Gallery</h3>
        <div class="gallery">${mediaGallery}</div>
      </div>` : ""
    }

    ${socialLinks ? `
      <div class="arena-social">
        <h3>🔗 Follow Us</h3>
        ${socialLinks}
      </div>` : ""
    }
  `;
  
  container.appendChild(section);
  eventGal(container, false);
}

function eventGal(contentContainer, placeData) {

  // if (placeData.events) {
  if (placeData) {

    const eventsArray = [
      {
        name: "Music Festival",
        date: "2025-04-10",
        location: "King Park",
        image: "http://localhost:4000/static/placepic/0Sbxk7K1dX47ws.jpg"
      },
      {
        name: "Art Exhibition",
        date: "2025-04-15",
        location: "Community Center",
        image: "http://localhost:4000/static/placepic/0Sbxk7K1dX47ws.jpg"
      }
    ];

    let container = document.createElement('div');
    container.appendChild(createElement('h2', {}, ["Upcoming Events"]));
    container.appendChild(Owl(eventsArray));
    contentContainer.appendChild(container);
  }

}

export { renderArena };
