function renderShop(data, container, isCreator) {
  const section = document.createElement("section");
  section.classList.add("shop");

  const products = (data.products || []).map(prod => `
    <div class="product-card">
      <img src="/media/${prod.image || "placeholder.jpg"}" />
      <h4>${prod.name}</h4>
      <p>₹${prod.price}</p>
      <button>Add to Cart</button>
    </div>
  `).join("");

  section.innerHTML = `
    <h2>🛍️ Welcome to ${data.name}</h2>

    ${isCreator ? `
      <!--div class="creator-tools">
        <button>Add Product</button>
        <button>Manage Shop</button>
        <button>View Orders</button>
      </div-->` : ""
    }

    <p><strong>Description:</strong> ${data.description || "No description available."}</p>
    <p><strong>Location:</strong> ${data.address}</p>
    <p><strong>Tags:</strong> ${(data.tags || []).join(", ")}</p>

    ${products ? `
      <div class="product-list">
        <h3>🛒 Available Products</h3>
        ${products}
      </div>` : "<p>No products listed.</p>"
    }

    ${data.social_links?.length ? `
      <div class="shop-social">
        <h3>Follow Us</h3>
        ${data.social_links.map(link => `<a href="${link.url}" target="_blank">${link.platform}</a>`).join("")}
      </div>` : ""
    }
  `;

  container.appendChild(section);
}
export { renderShop };
