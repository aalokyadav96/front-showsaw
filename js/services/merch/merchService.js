// import { state } from "../../state/state.js";
import { apiFetch } from "../../api/api.js";
import MerchCard from '../../components/ui/MerchCard.mjs';
import { Button } from "../../components/base/Button.js";
import { createElement } from "../../components/createElement.js";
import { SRC_URL } from "../../state/state.js";
import Modal from '../../components/ui/Modal.mjs';


// Add merchandise to the event
async function addMerchandise(eventId) {
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
            displayNewMerchandise(response.data);  // Display the newly added merchandise
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

function addMerchForm(eventId) {
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
    addButton.addEventListener("click", () => addMerchandise(eventId));

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel-merch-btn";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", clearMerchForm);

    editEventDiv.append(heading, merchNameInput, merchPriceInput, merchStockInput, merchImageInput, addButton, cancelButton);
}

function displayNewMerchandise(merchData) {
    const merchList = document.getElementById("merch-list");

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
async function displayMerchandise(merchData, eventId, isCreator, isLoggedIn, merchList) {
    merchList.innerHTML = ""; // Clear existing content

    if (isCreator) {
        const button = Button("Add Merchandise", "add-merch-btn", {
            click: () => addMerchForm(eventId),
            mouseenter: () => console.log("Button hovered"),
        });

        merchList.appendChild(button);
    }

    if (!Array.isArray(merchData)) {
        merchList.appendChild(createElement("p", { textContent: "Invalid merchandise data received." }));
        return;
    }

    if (merchData.length === 0) {
        merchList.appendChild(createElement("p", { textContent: "No merchandise available for this event." }));
        return;
    }

    merchData.forEach((merch) => {
        const card = MerchCard({
            name: merch.name,
            price: merch.price,
            image: `/merchpic/${merch.merch_pic}`,
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

// Unified function to handle buying merchandise
async function buyMerch(merchId, eventId, maxStock = 6) {
    // Create modal content
    const content = document.createElement('div');

    const stockLabel = document.createElement('label');
    stockLabel.textContent = 'Enter Quantity:';
    stockLabel.htmlFor = 'stock-input';

    const stockInput = document.createElement('input');
    stockInput.id = 'stock-input';
    stockInput.type = 'number';
    stockInput.min = '1';
    stockInput.max = maxStock.toString();
    stockInput.value = '1';
    stockInput.setAttribute('aria-label', 'Merch Quantity');

    const confirmButton = Button('Proceed to Payment', 'confirm-purchase-btn', {
        click: async () => {
            const stock = parseInt(stockInput.value);
            if (isNaN(stock) || stock < 1 || stock > maxStock) {
                alert(`Please enter a valid quantity between 1 and ${maxStock}.`);
                return;
            }

            confirmButton.disabled = true; // Prevent duplicate clicks
            try {
                const paymentSession = await createPaymentSession(merchId, eventId, stock);
                if (paymentSession) {
                    showPaymentModal(paymentSession, eventId, merchId);
                }
            } catch (error) {
                console.error('Error creating payment session:', error);
                alert('Failed to initiate payment. Please try again.');
            } finally {
                confirmButton.disabled = false;
                modal.remove(); // Close modal after handling payment session
            }
        },
    });

    content.appendChild(stockLabel);
    content.appendChild(stockInput);
    content.appendChild(confirmButton);

    // Create and show modal
    const modal = Modal({
        title: 'Buy Merchandise',
        content,
        onClose: () => modal.remove(),
    });
}


// Function to show the payment modal
function showPaymentModal(paymentSession, eventId, merchId) {
    const content = document.createElement('div');

    const cardNumberInput = document.createElement('input');
    cardNumberInput.id = 'card-number';
    cardNumberInput.type = 'text';
    cardNumberInput.placeholder = 'Card Number';
    content.appendChild(cardNumberInput);

    const expiryDateInput = document.createElement('input');
    expiryDateInput.id = 'expiry-date';
    expiryDateInput.type = 'text';
    expiryDateInput.placeholder = 'MM/YY Expiry Date';
    content.appendChild(expiryDateInput);

    const cvvInput = document.createElement('input');
    cvvInput.id = 'cvv';
    cvvInput.type = 'text';
    cvvInput.placeholder = 'CVV';
    content.appendChild(cvvInput);

    const paymentMessage = document.createElement('p');
    paymentMessage.id = 'payment-message';
    paymentMessage.textContent = 'Enter your card details to proceed.';
    content.appendChild(paymentMessage);

    const confirmButton = Button('Pay Now', 'confirm-payment-btn', {
        click: () => submitPayment(paymentSession, paymentMessage, eventId, merchId),
    });
    content.appendChild(confirmButton);

    const modal = Modal({
        title: 'Payment Information',
        content,
        onClose: () => modal.remove(),
    });
}

// Function to create a payment session for the merch purchase
async function createPaymentSession(merchId, eventId, stock) {
    try {
        const body = JSON.stringify({ merchId, eventId, stock });
        const response = await apiFetch(`/merch/event/${eventId}/${merchId}/payment-session`, 'POST', body);
        if (response?.success && response?.data) {
            return response.data; // Return the payment session data
        } else {
            throw new Error(response?.message || 'Failed to create payment session.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
        return null;
    }
}

// Function to submit the payment
function submitPayment(paymentSession, paymentMessage, eventId, merchId) {
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    if (cardNumber && expiryDate && cvv) {
        paymentMessage.textContent = 'Processing payment...';

        setTimeout(async () => {
            try {
                const response = await apiFetch(
                    `/merch/event/${eventId}/${merchId}/confirm-purchase`,
                    'POST',
                    JSON.stringify({
                        merchId: eventId,
                        eventId: merchId,
                        stock: paymentSession.stock,
                    })
                );

                if (response?.message === 'Payment successfully processed. Merch purchased.') {
                    alert('Merch purchased successfully!');
                    window.location.href = `/event/${eventId}`; // Redirect to event page
                } else {
                    throw new Error('Unexpected response from backend.');
                }
            } catch (error) {
                console.error('Error during payment:', error);
                alert('Payment failed! Please try again.');
                paymentMessage.textContent = 'Payment failed. Please try again.';
            }
        }, 2000);
    } else {
        paymentMessage.textContent = 'Please fill in all fields.';
    }
}



export { addMerchForm, addMerchandise, displayNewMerchandise, clearMerchForm, displayMerchandise, buyMerch, deleteMerch, editMerchForm };