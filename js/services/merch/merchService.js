// import { state } from "../../state/state.js";
import { apiFetch } from "../../api/api.js";
import MerchCard from '../../components/ui/MerchCard.mjs';
import { Button } from "../../components/base/Button.js";
import { createElement } from "../../components/createElement.js";
import { SRC_URL } from "../../state/state.js";
import {handlePurchase} from '../payment/paymentService.js';

// Add merchandise to the event
async function addMerchandise(eventId, merchList) {
    const merchName = document.getElementById('merch-name').value.trim();
    const merchPrice = parseFloat(document.getElementById('merch-price').value);
    const merchStock = parseInt(document.getElementById('merch-stock').value);
    const merchImageFile = document.getElementById('merch-image').files[0];

    if (!merchName || isNaN(merchPrice) || isNaN(merchStock)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // Check if image file is valid (optional)
    if (merchImageFile && !merchImageFile.type.startsWith('image/')) {
        alert("Please upload a valid image file.");
        return;
    }

    if (!merchName || isNaN(merchPrice) || isNaN(merchStock)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const formData = new FormData();
    formData.append('name', merchName);
    formData.append('price', merchPrice);
    formData.append('stock', merchStock);

    if (merchImageFile) {
        formData.append('image', merchImageFile);
    }

    try {
        const response = await apiFetch(`/merch/event/${eventId}`, 'POST', formData);

        if (response && response.data.merchid) {
            alert("Merchandise added successfully!");
            displayNewMerchandise(response.data, merchList);  // Display the newly added merchandise
            clearMerchForm();  // Optionally clear the form after success
        } else {
            alert(`Failed to add merchandise: ${response?.message || 'Unknown error'}`);
        }
    } catch (error) {
        alert(`Error adding merchandise: ${error.message}`);
    }
}

// Clear the merchandise form
function clearMerchForm() {
    document.getElementById('editevent').innerHTML = '';
}

async function deleteMerch(merchId, eventId) {
    if (confirm('Are you sure you want to delete this merchandise?')) {
        try {
            const response = await apiFetch(`/merch/event/${eventId}/${merchId}`, 'DELETE');

            if (response.success) {
                alert('Merchandise deleted successfully!');
                // Remove the deleted item from the DOM
                const merchItem = document.getElementById(`merch-${merchId}`);
                if (merchItem) merchItem.remove();
            } else {
                const errorData = await response.json();
                alert(`Failed to delete merchandise: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting merchandise:', error);
            alert('An error occurred while deleting the merchandise.');
        }
    }
}

async function editMerchForm(merchId, eventId) {
    try {
        const response = await apiFetch(`/merch/event/${eventId}/${merchId}`, 'GET');

        const editDiv = document.getElementById('editevent');
        editDiv.textContent = ""; // Clear existing content

        const heading = document.createElement("h3");
        heading.textContent = "Edit Merchandise";

        const form = document.createElement("form");
        form.id = "edit-merch-form";

        const merchIdInput = document.createElement("input");
        merchIdInput.type = "hidden";
        merchIdInput.name = "merchid";
        merchIdInput.value = merchId;

        const nameLabel = document.createElement("label");
        nameLabel.setAttribute("for", "merchName");
        nameLabel.textContent = "Name:";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.id = "merchName";
        nameInput.name = "merchName";
        nameInput.value = response.name;
        nameInput.required = true;

        const priceLabel = document.createElement("label");
        priceLabel.setAttribute("for", "merchPrice");
        priceLabel.textContent = "Price:";

        const priceInput = document.createElement("input");
        priceInput.type = "number";
        priceInput.id = "merchPrice";
        priceInput.name = "merchPrice";
        priceInput.value = response.price;
        priceInput.required = true;
        priceInput.step = "0.01";

        const stockLabel = document.createElement("label");
        stockLabel.setAttribute("for", "merchStock");
        stockLabel.textContent = "Stock:";

        const stockInput = document.createElement("input");
        stockInput.type = "number";
        stockInput.id = "merchStock";
        stockInput.name = "merchStock";
        stockInput.value = response.stock;
        stockInput.required = true;

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Update Merchandise";

        // Append all elements to the form
        form.append(
            merchIdInput,
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
            const merchData = {
                name: nameInput.value,
                price: parseFloat(priceInput.value),
                stock: parseInt(stockInput.value)
            };

            try {
                // Send a PUT request with JSON data
                const updateResponse = await apiFetch(`/merch/event/${eventId}/${merchId}`, 'PUT', JSON.stringify(merchData), { 'Content-Type': 'application/json' });

                if (updateResponse.success) {
                    alert('Merchandise updated successfully!');
                } else {
                    alert(`Failed to update merchandise: ${updateResponse.message}`);
                }
            } catch (error) {
                console.error('Error updating merchandise:', error);
                alert('An error occurred while updating the merchandise.');
            }
        });
    } catch (error) {
        console.error('Error fetching merchandise details:', error);
        alert('An error occurred while fetching the merchandise details.');
    }
}

function addMerchForm(eventId, merchList) {
    const editEventDiv = document.getElementById('editevent');
    editEventDiv.textContent = ""; // Clear existing content

    const heading = document.createElement("h3");
    heading.textContent = "Add Merchandise";

    const merchNameInput = document.createElement("input");
    merchNameInput.type = "text";
    merchNameInput.id = "merch-name";
    merchNameInput.placeholder = "Merchandise Name";
    merchNameInput.required = true;

    const merchPriceInput = document.createElement("input");
    merchPriceInput.type = "number";
    merchPriceInput.id = "merch-price";
    merchPriceInput.placeholder = "Price";
    merchPriceInput.required = true;

    const merchStockInput = document.createElement("input");
    merchStockInput.type = "number";
    merchStockInput.id = "merch-stock";
    merchStockInput.placeholder = "Stock Available";
    merchStockInput.required = true;

    const merchImageInput = document.createElement("input");
    merchImageInput.type = "file";
    merchImageInput.id = "merch-image";
    merchImageInput.accept = "image/*";

    const addButton = document.createElement("button");
    addButton.id = "add-merch-btn";
    addButton.textContent = "Add Merchandise";
    addButton.addEventListener("click", () => addMerchandise(eventId, merchList));

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel-merch-btn";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", clearMerchForm);

    editEventDiv.append(heading, merchNameInput, merchPriceInput, merchStockInput, merchImageInput, addButton, cancelButton);
}

function displayNewMerchandise(merchData, merchList) {
    // const merchList = document.getElementById("merch-list");

    const merchItem = document.createElement("div");
    merchItem.className = "merch-item";

    const merchName = document.createElement("h3");
    merchName.textContent = merchData.name;

    const merchPrice = document.createElement("p");
    merchPrice.textContent = `Price: $${(merchData.price / 100).toFixed(2)}`;

    const merchStock = document.createElement("p");
    merchStock.textContent = `Available: ${merchData.stock}`;

    merchItem.append(merchName, merchPrice, merchStock);

    if (merchData.merch_pic) {
        const merchImage = document.createElement("img");
        merchImage.src = `${SRC_URL}/merchpic/${merchData.merch_pic}`;
        merchImage.alt = merchData.name;
        merchImage.style.maxWidth = "160px";
        merchItem.appendChild(merchImage);
    }

    merchList.prepend(merchItem);
}

// Update the usage of MerchCard in displayMerchandise
async function displayMerchandise(merchList, merchData, eventId, isCreator, isLoggedIn) {
    merchList.innerHTML = ""; // Clear existing content

    if (isCreator) {
        const button = Button("Add Merchandise", "add-merch-btn", {
            click: () => addMerchForm(eventId, merchList),
            mouseenter: () => console.log("Button hovered"),
        });

        merchList.appendChild(button);
    }

    if (!Array.isArray(merchData)) {
        merchList.appendChild(createElement("p", { textContent: "Invalid merchandise data received." }));
        return;
    }

    if (merchData.length === 0) {
        merchList.appendChild(createElement("p", {}, ["No merchandise available for this event."]));
        return;
    }

    merchData.forEach((merch) => {
        const card = MerchCard({
            name: merch.name,
            price: merch.price,
            image: `${SRC_URL}/merchpic/${merch.merch_pic}`,
            stock: merch.stock,
            isCreator,
            isLoggedIn,
            onBuy: () => buyMerch(merch.merchid, eventId),
            onEdit: () => editMerchForm(merch.merchid, eventId),
            onDelete: () => deleteMerch(merch.merchid, eventId),
        });

        merchList.appendChild(card);
    });
}

// Wrappers for buying merch and tickets
function buyMerch(merchId, eventId, maxStock = 6) {
    handlePurchase("merch", merchId, eventId, maxStock);
}

export { addMerchForm, addMerchandise, displayNewMerchandise, clearMerchForm, displayMerchandise, deleteMerch, editMerchForm };