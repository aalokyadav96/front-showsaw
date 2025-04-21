function renderRestaurant(data, container, isCreator) {
    const section = document.createElement("section");
    section.classList.add("restaurant");
  
    section.innerHTML = `
      <h2>🍽️ Restaurant Features</h2>
      <div class="tabs">
        <button>Menu</button>
        <button>Book a Table</button>
        <button>Order</button>
      </div>
      <div class="tab-content">
        <p>Menu goes here... (maybe load from API)</p>
        <p>Table booking form here...</p>
        <p>Order system here...</p>
      </div>
    `;
  
    container.appendChild(section);
  }
  export { renderRestaurant };
  