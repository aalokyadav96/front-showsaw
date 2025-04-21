function renderBusiness(data, container, isCreator) {
  const section = document.createElement("section");
  section.classList.add("business");

  const tags = (data.tags || []).map(tag => `<span class="tag">${tag}</span>`).join(" ");
  const socialLinks = (data.social_links || []).map(link => `
    <a href="${link.url}" target="_blank">${link.platform}</a>
  `).join(" ");

  section.innerHTML = `
    <h2>🏢 ${data.name}</h2>

    ${isCreator ? `
      <!--div class="creator-tools">
        <button>Manage Promotions</button>
        <button>Edit Business Info</button>
        <button>Upload Offers</button>
      </div-->` : ""
    }

    <p><strong>Description:</strong> ${data.description || "No description available."}</p>
    <p><strong>Address:</strong> ${data.address || "N/A"}</p>
    <p><strong>Tags:</strong> ${tags || "None"}</p>
    <p><strong>Website:</strong> ${data.website_url ? `<a href="${data.website_url}" target="_blank">Visit</a>` : "N/A"}</p>

    ${data.custom_fields ? `
      <div class="business-custom">
        ${Object.entries(data.custom_fields).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join("")}
      </div>` : ""
    }

    ${data.promotions?.length ? `
      <div class="business-promos">
        <h3>🎉 Current Promotions</h3>
        ${data.promotions.map(promo => `
          <div class="promo-card">
            <h4>${promo.title}</h4>
            <p>${promo.description}</p>
            <p><strong>Valid till:</strong> ${new Date(promo.expires_at).toLocaleDateString()}</p>
          </div>
        `).join("")}
      </div>` : "<p>No active promotions.</p>"
    }

    ${socialLinks ? `<div class="social-links"><h3>🔗 Follow Us</h3>${socialLinks}</div>` : ""}
  `;

  container.appendChild(section);
}
export { renderBusiness };
