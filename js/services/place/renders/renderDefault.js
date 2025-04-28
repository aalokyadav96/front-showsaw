function renderDefault(data, container, isCreator) {
  const section = document.createElement("section");
  section.classList.add("default-place");

  section.innerHTML = `
    <div class="default-header">
      <h2>${data.name || "Unnamed Place"}</h2>
    </div>

    <div class="default-overview">
      <p><strong>Description:</strong> ${data.description || "No description available."}</p>
      <p><strong>Category:</strong> ${data.category || "N/A"}</p>
      <p><strong>Address:</strong> ${data.address || "Unknown"}</p>
    </div>

    ${data.tags?.length ? `
      <div class="default-tags">
        ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join(" ")}
      </div>` : ""
    }

    ${data.custom_fields ? `
      <div class="custom-fields">
        <h3>Custom Information</h3>
        ${Object.entries(data.custom_fields).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join("")}
      </div>` : "<p>No additional details provided.</p>"
    }
  `;

  container.appendChild(section);
}

export { renderDefault };

// function renderDefault(data, container, isCreator) {
//   const section = document.createElement("section");
//   section.classList.add("default-place");

//   const customFields = data.custom_fields
//     ? Object.entries(data.custom_fields).map(([key, value]) => `<p><strong>${key}:</strong>${value}</p>`).join("")
//     : "<p>No custom fields.</p>";

//   // const tags = (data.tags || []).map(tag => `<span class="tag">${tag}</span>`).join(" ");

//   section.innerHTML = `
//     <h2>${data.name || "Unnamed Place"}</h2>

//     ${isCreator ? `
//       <!--div class="creator-tools">
//         <button>Edit Info</button>
//         <button>Customize Page</button>
//       </div-->` : ""
//     }

//     <p><strong>Description:</strong><span> ${data.description || "No description available."}</span></p>
//     <p><strong>Category:</strong><span> ${data.category || "N/A"}</span></p>
//     <p><strong>Address:</strong><span> ${data.address || "Unknown"}</span></p>
//     <p><strong>Tags:</strong><span> ${tags || "None"}</span></p>

//     <div class="custom-fields">
//       <h3>Custom Information</h3>
//       ${customFields}
//     </div>
//   `;

//   container.appendChild(section);
// }
// export { renderDefault };
