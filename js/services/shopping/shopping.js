import { secnav } from "../../components/secnav.js";

export async function displayShopping(contentContainer, isLoggedIn) {
    if (!contentContainer) {
        console.error("Content container not found!");
        return;
    }

    const shoppingSection = document.createElement("section");
    shoppingSection.classList.add("shopping-section");

    const productsContainer = document.createElement("div");
    productsContainer.classList.add("products-container");

    const mockProducts = {
        Electronics: [
            { name: "Laptop", price: 999, description: "A high-performance laptop", imageUrl: "https://via.placeholder.com/150" },
            { name: "Smartphone", price: 699, description: "Latest model with powerful features", imageUrl: "https://via.placeholder.com/150" }
        ],
        Clothing: [
            { name: "T-shirt", price: 19.99, description: "Comfortable cotton T-shirt", imageUrl: "https://via.placeholder.com/150" },
            { name: "Jeans", price: 49.99, description: "Stylish denim jeans", imageUrl: "https://via.placeholder.com/150" }
        ],
        Groceries: [
            { name: "Milk", price: 1.99, description: "Fresh whole milk", imageUrl: "https://via.placeholder.com/150" },
            { name: "Apple", price: 0.5, description: "Juicy red apple", imageUrl: "https://via.placeholder.com/150" }
        ],
        Furniture: [
            { name: "Sofa", price: 299, description: "Comfortable 3-seater sofa", imageUrl: "https://via.placeholder.com/150" },
            { name: "Coffee Table", price: 89.99, description: "Stylish wooden coffee table", imageUrl: "https://via.placeholder.com/150" }
        ]
    };

    // Display products in selected category
    function showCategory(category) {
        productsContainer.innerHTML = "";
        
        if (mockProducts[category]) {
            mockProducts[category].forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");

                const img = document.createElement("img");
                img.src = product.imageUrl;
                productCard.appendChild(img);

                const name = document.createElement("h3");
                name.textContent = product.name;
                productCard.appendChild(name);

                const price = document.createElement("p");
                price.classList.add("price");
                price.textContent = `$${product.price.toFixed(2)}`;
                productCard.appendChild(price);

                const description = document.createElement("p");
                description.textContent = product.description;
                productCard.appendChild(description);

                const addToCartButton = document.createElement("button");
                addToCartButton.textContent = "Add to Cart";
                addToCartButton.classList.add("add-to-cart");
                addToCartButton.addEventListener("click", () => {
                    alert(`${product.name} added to cart!`);
                });
                productCard.appendChild(addToCartButton);

                productsContainer.appendChild(productCard);
            });
        }
    }

    // Define categories for navigation
    const categories = [
        { label: "Electronics", callback: showCategory },
        { label: "Clothing", callback: showCategory },
        { label: "Groceries", callback: showCategory },
        { label: "Furniture", callback: showCategory },
    ];

    const secondaryNav = secnav(categories);
    if (secondaryNav) shoppingSection.appendChild(secondaryNav);

    // Add filter and sorting options
    const filterSection = document.createElement("div");
    filterSection.classList.add("filter-section");

    const filterLabel = document.createElement("label");
    filterLabel.textContent = "Sort by price:";
    filterSection.appendChild(filterLabel);

    const sortSelect = document.createElement("select");
    const sortLowToHigh = document.createElement("option");
    sortLowToHigh.value = "low-to-high";
    sortLowToHigh.textContent = "Low to High";
    const sortHighToLow = document.createElement("option");
    sortHighToLow.value = "high-to-low";
    sortHighToLow.textContent = "High to Low";
    
    sortSelect.appendChild(sortLowToHigh);
    sortSelect.appendChild(sortHighToLow);
    sortSelect.addEventListener("change", (e) => {
        const selectedOption = e.target.value;
        const sortedProducts = [...mockProducts];
        sortedProducts.forEach((categoryProducts) => {
            if (selectedOption === "low-to-high") {
                categoryProducts.sort((a, b) => a.price - b.price);
            } else {
                categoryProducts.sort((a, b) => b.price - a.price);
            }
        });
        showCategory("Electronics"); // You could also refresh based on the current category
    });

    filterSection.appendChild(sortSelect);
    shoppingSection.appendChild(filterSection);

    // Initial load: Show Electronics category
    showCategory("Electronics");

    shoppingSection.appendChild(productsContainer);
    contentContainer.appendChild(shoppingSection);
}

// export async function displayShopping(contentContainer, isLoggedIn) {
//     // Clear previous content
//     contentContainer.innerHTML = '';

//     // Create shopping page container
//     const shoppingPage = document.createElement('div');
//     shoppingPage.className = 'shopping-page';

//     // Check if the user is logged in
//     if (!isLoggedIn) {
//         shoppingPage.innerHTML = '<h2>Please log in to view the shopping page.</h2>';
//         contentContainer.appendChild(shoppingPage);
//         return;
//     }

//     // Sample product list
//     const products = [
//         { id: 1, name: 'Laptop', price: '$1200' },
//         { id: 2, name: 'Smartphone', price: '$800' },
//         { id: 3, name: 'Headphones', price: '$150' }
//     ];

//     // Create product list container
//     const productList = document.createElement('div');
//     productList.className = 'product-list';

//     // Populate product list
//     products.forEach(product => {
//         const productItem = document.createElement('div');
//         productItem.className = 'product-item';
//         productItem.innerHTML = `<h3>${product.name}</h3><p>Price: ${product.price}</p>`;
//         productList.appendChild(productItem);
//     });

//     // Append elements to shopping page
//     shoppingPage.innerHTML = '<h2>Welcome to the Shopping Page</h2>';
//     shoppingPage.appendChild(productList);
    
//     // Add the shopping page to the content container
//     contentContainer.appendChild(shoppingPage);
// }
