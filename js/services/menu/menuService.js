// import { state } from "../../state/state.js";
import { apiFetch } from "../../api/api.js";
import MenuCard from '../../components/ui/MenuCard.mjs';
import { Button } from "../../components/base/Button.js";
import { createElement } from "../../components/createElement.js";
import { SRC_URL } from "../../state/state.js";
import {handlePurchase} from '../payment/paymentService.js';
import SnackBar from "../../components/ui/Snackbar.mjs";

// Add Menu to the event
async function addMenu(placeId, menuList) {
    const menuName = document.getElementById('menu-name').value.trim();
    const menuPrice = parseFloat(document.getElementById('menu-price').value);
    const menuStock = parseInt(document.getElementById('menu-stock').value);
    const menuImageFile = document.getElementById('menu-image').files[0];

    if (!menuName || isNaN(menuPrice) || isNaN(menuStock)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // Check if image file is valid (optional)
    if (menuImageFile && !menuImageFile.type.startsWith('image/')) {
        alert("Please upload a valid image file.");
        return;
    }

    if (!menuName || isNaN(menuPrice) || isNaN(menuStock)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const formData = new FormData();
    formData.append('name', menuName);
    formData.append('price', menuPrice);
    formData.append('stock', menuStock);

    if (menuImageFile) {
        formData.append('image', menuImageFile);
    }

    try {
        const response = await apiFetch(`/places/menu/${placeId}`, 'POST', formData);

        if (response && response.data.menuid) {
            SnackBar("Menu added successfully!");
            clearMenuForm(menuList);  // Optionally clear the form after success
            displayNewMenu(response.data, menuList);  // Display the newly added Menu
        } else {
            alert(`Failed to add Menu: ${response?.message || 'Unknown error'}`);
        }
    } catch (error) {
        alert(`Error adding Menu: ${error.message}`);
    }
}

// Clear the Menu form
function clearMenuForm(menuList) {
    menuList.innerHTML = '';
}

async function deleteMenu(menuId, placeId) {
    if (confirm('Are you sure you want to delete this Menu?')) {
        try {
            const response = await apiFetch(`/places/menu/${placeId}/${menuId}`, 'DELETE');

            if (response.success) {
                alert('Menu deleted successfully!');
                // Remove the deleted item from the DOM
                const menuItem = document.getElementById(`menu-${menuId}`);
                if (menuItem) menuItem.remove();
            } else {
                const errorData = await response.json();
                alert(`Failed to delete Menu: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting Menu:', error);
            alert('An error occurred while deleting the Menu.');
        }
    }
}

async function editMenuForm(menuId, placeId) {
    try {
        const response = await apiFetch(`/places/menu/${placeId}/${menuId}`, 'GET');

        const editDiv = document.getElementById('editplace');
        editDiv.textContent = ""; // Clear existing content

        const heading = document.createElement("h3");
        heading.textContent = "Edit Menu";

        const form = document.createElement("form");
        form.id = "edit-menu-form";

        const menuIdInput = document.createElement("input");
        menuIdInput.type = "hidden";
        menuIdInput.name = "menuid";
        menuIdInput.value = menuId;

        const nameLabel = document.createElement("label");
        nameLabel.setAttribute("for", "menuName");
        nameLabel.textContent = "Name:";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.id = "menuName";
        nameInput.name = "menuName";
        nameInput.value = response.name;
        nameInput.required = true;

        const priceLabel = document.createElement("label");
        priceLabel.setAttribute("for", "menuPrice");
        priceLabel.textContent = "Price:";

        const priceInput = document.createElement("input");
        priceInput.type = "number";
        priceInput.id = "menuPrice";
        priceInput.name = "menuPrice";
        priceInput.value = response.price;
        priceInput.required = true;
        priceInput.step = "0.01";

        const stockLabel = document.createElement("label");
        stockLabel.setAttribute("for", "menuStock");
        stockLabel.textContent = "Stock:";

        const stockInput = document.createElement("input");
        stockInput.type = "number";
        stockInput.id = "menuStock";
        stockInput.name = "menuStock";
        stockInput.value = response.stock;
        stockInput.required = true;

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Update Menu";

        // Append all elements to the form
        form.append(
            menuIdInput,
            nameLabel, nameInput,
            priceLabel, priceInput,
            stockLabel, stockInput,
            submitButton
        );

        // Append form and heading to the editDiv
        editDiv.append(heading, form);

        // Attach the submit event listener
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Prepare data to send to the backend
            const menuData = {
                name: nameInput.value,
                price: parseFloat(priceInput.value),
                stock: parseInt(stockInput.value)
            };

            try {
                // Send a PUT request with JSON data
                const updateResponse = await apiFetch(`/places/menu/${placeId}/${menuId}`, 'PUT', JSON.stringify(menuData), { 'Content-Type': 'application/json' });

                if (updateResponse.success) {
                    alert('Menu updated successfully!');
                } else {
                    alert(`Failed to update Menu: ${updateResponse.message}`);
                }
            } catch (error) {
                console.error('Error updating Menu:', error);
                alert('An error occurred while updating the Menu.');
            }
        });
    } catch (error) {
        console.error('Error fetching Menu details:', error);
        alert('An error occurred while fetching the Menu details.');
    }
}

function addMenuForm(placeId, menuList) {
    // const editEventDiv = document.getElementById('editevent');
    const editEventDiv = menuList;
    editEventDiv.textContent = ""; // Clear existing content

    const heading = document.createElement("h3");
    heading.textContent = "Add Menu";

    const menuNameInput = document.createElement("input");
    menuNameInput.type = "text";
    menuNameInput.id = "menu-name";
    menuNameInput.placeholder = "Menu Name";
    menuNameInput.required = true;

    const menuPriceInput = document.createElement("input");
    menuPriceInput.type = "number";
    menuPriceInput.id = "menu-price";
    menuPriceInput.placeholder = "Price";
    menuPriceInput.required = true;

    const menuStockInput = document.createElement("input");
    menuStockInput.type = "number";
    menuStockInput.id = "menu-stock";
    menuStockInput.placeholder = "Stock Available";
    menuStockInput.required = true;

    const menuImageInput = document.createElement("input");
    menuImageInput.type = "file";
    menuImageInput.id = "menu-image";
    menuImageInput.accept = "image/*";

    const addButton = document.createElement("button");
    addButton.id = "add-menu-btn";
    addButton.textContent = "Add Menu";
    addButton.addEventListener("click", () => addMenu(placeId, menuList));

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel-menu-btn";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", clearMenuForm);

    editEventDiv.append(heading, menuNameInput, menuPriceInput, menuStockInput, menuImageInput, addButton, cancelButton);
}

function displayNewMenu(menuData, menuList) {
    // const menuList = document.getElementById("menu-list");

    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";

    const menuName = document.createElement("h3");
    menuName.textContent = menuData.name;

    const menuPrice = document.createElement("p");
    menuPrice.textContent = `Price: $${(menuData.price / 100).toFixed(2)}`;

    const menuStock = document.createElement("p");
    menuStock.textContent = `Available: ${menuData.stock}`;

    menuItem.append(menuName, menuPrice, menuStock);

    if (menuData.menu_pic) {
        const menuImage = document.createElement("img");
        menuImage.src = `${SRC_URL}/menupic/${menuData.menu_pic}`;
        menuImage.alt = menuData.name;
        menuImage.loading = "lazy";
        menuImage.style.maxWidth = "160px";
        menuItem.appendChild(menuImage);
    }

    menuList.prepend(menuItem);
}

// Update the usage of MenuCard in displayMenu
async function displayMenu(menuList, placeId, isCreator, isLoggedIn) {
    menuList.innerHTML = ""; // Clear existing content

    const menuData = await apiFetch(`/places/menu/${placeId}`);

    if (isCreator) {
        const button = Button("Add Menu", "add-menu-btn", {
            click: () => addMenuForm(placeId, menuList),
            mouseenter: () => console.log("Button hovered"),
        });

        menuList.appendChild(button);
    }

    if (!Array.isArray(menuData)) {
        menuList.appendChild(createElement("p", { textContent: "Invalid Menu data received." }));
        return;
    }

    if (menuData.length === 0) {
        menuList.appendChild(createElement("p", {}, ["No Menu available for this event."]));
        return;
    }

    menuData.forEach((menu) => {
        const card = MenuCard({
            name: menu.name,
            price: menu.price,
            image: `${SRC_URL}/menupic/${menu.menu_pic}`,
            stock: menu.stock,
            isCreator,
            isLoggedIn,
            onBuy: () => buyMenu(menu.menuid, placeId),
            onEdit: () => editMenuForm(menu.menuid, placeId),
            onDelete: () => deleteMenu(menu.menuid, placeId),
        });

        menuList.appendChild(card);
    });
}

// Wrappers for buying menu and tickets
function buyMenu(menuId, placeId, maxStock = 2) {
    alert(menuId, placeId);
    handlePurchase("menu", menuId, placeId, maxStock);
}


export { addMenuForm, addMenu, displayNewMenu, clearMenuForm, displayMenu, deleteMenu, editMenuForm };