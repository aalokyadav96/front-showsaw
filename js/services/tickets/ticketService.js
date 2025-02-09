import { apiFetch } from "../../api/api.js";
import TicketCard from '../../components/ui/TicketCard.mjs';
import { Button } from "../../components/base/Button.js";
import { createElement } from "../../components/createElement.js";
import Modal from '../../components/ui/Modal.mjs';

// Add ticket to the event
async function addTicket(eventId) {
    const tickName = document.getElementById('ticket-name').value.trim();
    const tickPrice = parseFloat(document.getElementById('ticket-price').value);
    const tickQuantity = parseInt(document.getElementById('ticket-quantity').value);

    if (!tickName || isNaN(tickPrice) || isNaN(tickQuantity)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const formData = new FormData();
    formData.append('name', tickName);
    formData.append('price', tickPrice);
    formData.append('quantity', tickQuantity);

    try {
        const response = await apiFetch(`/ticket/event/${eventId}`, 'POST', formData);

        if (response && response.ticketid) {
            alert("Ticket added successfully!");
            displayNewTicket(response);  // Display the newly added ticket
            clearTicketForm();  // Optionally clear the form after success
        } else {
            alert(`Failed to add ticket: ${response?.message || 'Unknown error'}`);
        }
    } catch (error) {
        alert(`Error adding ticket: ${error.message}`);
    }
}


function addTicketForm(eventId) {
    const editEventDiv = document.getElementById('editevent');

    const heading = document.createElement('h3');
    heading.textContent = 'Add Ticket';

    const form = document.createElement('form');
    form.id = 'add-ticket-form';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'ticket-name';
    nameInput.placeholder = 'Ticket Name';
    nameInput.required = true;

    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.id = 'ticket-price';
    priceInput.placeholder = 'Ticket Price';
    priceInput.required = true;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.id = 'ticket-quantity';
    quantityInput.placeholder = 'Quantity Available';
    quantityInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Ticket';

    form.appendChild(nameInput);
    form.appendChild(priceInput);
    form.appendChild(quantityInput);
    form.appendChild(submitButton);

    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancel-ticket-form';
    cancelButton.textContent = 'Cancel';

    // Use replaceChildren to clear and replace the content
    editEventDiv.replaceChildren(heading, form, cancelButton);

    // Attach event listeners
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        addTicket(eventId);
    });
    cancelButton.addEventListener('click', clearTicketForm);
}

async function editTicket(ticketId, eventId) {
    try {
        // Fetch current ticket details from the backend
        const ticketData = await apiFetch(`/ticket/event/${eventId}/${ticketId}`, 'GET');

        if (!ticketData || !ticketData.ticketid) {
            alert("Failed to load ticket data.");
            return;
        }

        // Show the edit form with the ticket data populated
        const editEventDiv = document.getElementById('editevent');
        editEventDiv.innerHTML = `
            <h3>Edit Ticket</h3>
            <form id="edit-ticket-form">
                <input type="hidden" id="ticket-id" value="${ticketData.ticketid}" />
                <label for="ticket-name">Name:</label>
                <input type="text" id="ticket-name" value="${ticketData.name}" required />
                <label for="ticket-price">Price:</label>
                <input type="number" id="ticket-price" value="${ticketData.price}" required />
                <label for="ticket-quantity">Quantity Available:</label>
                <input type="number" id="ticket-quantity" value="${ticketData.quantity}" required />
                <button type="submit">Update Ticket</button>
            </form>
            <button id="cancel-edit-form">Cancel</button>
        `;

        // Attach event listeners
        document.getElementById('edit-ticket-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            updateTicket(ticketId, eventId);
        });
        document.getElementById('cancel-edit-form').addEventListener('click', clearTicketForm);
    } catch (error) {
        console.error("Error loading ticket data:", error);
        alert("An error occurred while loading the ticket data.");
    }
}

// Update the ticket
async function updateTicket(ticketId, eventId) {
    const name = document.getElementById('ticket-name').value.trim();
    const price = parseFloat(document.getElementById('ticket-price').value);
    const quantity = parseInt(document.getElementById('ticket-quantity').value);

    const updatedTicket = { name, price, quantity };

    try {
        const response = await apiFetch(`/ticket/event/${eventId}/${ticketId}`, 'PUT', JSON.stringify(updatedTicket), {
            'Content-Type': 'application/json'
        });

        if (response.success) {
            alert('Ticket updated successfully!');
            clearTicketForm();
            // Refresh tickets
        } else {
            alert(`Failed to update ticket: ${response.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error("Error updating ticket:", error);
        alert("An error occurred while updating the ticket.");
    }
}

// Clear ticket form
function clearTicketForm() {
    const editEventDiv = document.getElementById('editevent');
    editEventDiv.innerHTML = ""; // Clear the form content
}


async function deleteTicket(ticketId, eventId) {
    if (confirm('Are you sure you want to delete this ticket?')) {
        try {
            const response = await apiFetch(`/ticket/event/${eventId}/${ticketId}`, 'DELETE');

            // Check if the response was successful (status 200-299 range)
            if (response.success) {
                // Check if the response contains a message
                // const responseData = await response.json();
                // if (responseData.success) {
                alert('Ticket deleted successfully!');
                // Optionally, refresh the ticket list or update the UI
                // displayEvent(eventId); // Uncomment if you have access to eventId
                // }
            } else {
                // Handle cases where response is not OK (i.e., status 400 or 500 range)
                const errorData = await response.json();
                alert(`Failed to delete ticket: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting ticket:', error);
            alert('An error occurred while deleting the ticket.');
        }
    }
}


function displayNewTicket(ticketData) {
    const ticketList = document.getElementById("ticket-list");

    const ticketItem = document.createElement("li");
    ticketItem.className = 'ticket-item';

    ticketItem.innerHTML = `
        <div class="hflex">
            <h3>Name: ${ticketData.name}</h3>
            <p>Price: $${(ticketData.price / 100).toFixed(2)}</p>
            <p>Available: ${ticketData.quantity}</p>
        </div>
        <div class="ticket-actions">
            <button class="edit-ticket-btn">Edit Ticket</button>
            <button class="delete-ticket-btn">Delete Ticket</button>
        </div>
    `;

    ticketItem.querySelector('.edit-ticket-btn').addEventListener('click', () => editTicket(ticketData.ticketid, ticketData.eventid));
    ticketItem.querySelector('.delete-ticket-btn').addEventListener('click', () => deleteTicket(ticketData.ticketid, ticketData.eventid));

    ticketList.appendChild(ticketItem);
}

async function displayTickets(ticketData, eventId, isCreator, isLoggedIn, ticketList) {
    ticketList.innerHTML = ""; // Clear existing content
    try {
        if (!Array.isArray(ticketData)) {
            throw new Error("Invalid ticket data received.");
        }

        if (isCreator) {
            const button = Button("Add Tickets", "add-ticket-btn", {
                click: () => addTicketForm(eventId),
                mouseenter: () => console.log("Button hovered"),
            });

            ticketList.appendChild(button);
        }

        if (ticketData.length > 0) {
            ticketData.forEach((ticket) => {
                const card = TicketCard({
                    isl: isLoggedIn,
                    creator: isCreator,
                    name: ticket.name,
                    price: ticket.price,
                    quantity: ticket.quantity,
                    attributes: {
                        "data-ticket-id": ticket.ticketid,
                    },
                    onClick: () => showBuyTicketModal(ticket.ticketid, eventId, ticket.quantity, isLoggedIn, isCreator),
                });

                console.log(eventId);
                if (isLoggedIn && isCreator) {
                    const editButton = Button("Edit", "edit-ticket-btn", {
                        click: () => editTicket(ticket.ticketid, eventId),
                        mouseenter: () => console.log("Edit hovered"),
                    });

                    const deleteButton = Button("Delete", "delete-ticket-btn", {
                        click: () => deleteTicket(ticket.ticketid, eventId),
                        mouseenter: () => console.log("Delete hovered"),
                    });

                    card.prepend(editButton);
                    card.prepend(deleteButton);
                }
                ticketList.appendChild(card);
            });
        } else {
            ticketList.appendChild(createElement("p", { textContent: "No tickets available for this event." }));
        }
    } catch (error) {
        console.error("Error loading tickets:", error);
        ticketList.appendChild(createElement("p", { textContent: `Error loading tickets: ${error.message}` }));
    }
}

// Function to show the modal to buy a ticket
function showBuyTicketModal(ticketId, eventId, maxQuantity) {
    const content = document.createElement("div");

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.min = "1";
    quantityInput.max = Math.min(maxQuantity, 5).toString();
    quantityInput.value = "1";
    quantityInput.setAttribute("aria-label", "Ticket Quantity");
    content.appendChild(quantityInput);

    const confirmButton = Button("Proceed to Payment", "confirm-purchase-btn", {
        click: async () => {
            const quantity = parseInt(quantityInput.value);
            if (isNaN(quantity) || quantity < 1 || quantity > maxQuantity) {
                alert(`Please enter a quantity between 1 and ${Math.min(maxQuantity, 5)}.`);
                return;
            }

            confirmButton.disabled = true; // Prevent duplicate clicks
            try {
                const paymentSession = await createPaymentSession(ticketId, eventId, quantity);
                if (paymentSession) {
                    showPaymentModal(paymentSession,eventId);
                }
            } catch (error) {
                console.error("Error creating payment session:", error);
            } finally {
                confirmButton.disabled = false;
            }
        },
    });

    content.appendChild(confirmButton);

    const modal = Modal({
        title: "Purchase Ticket",
        content,
        onClose: () => modal.remove(),
    });
}

// Function to show the payment modal
function showPaymentModal(paymentSession,eventId) {
    console.log(paymentSession);
    const content = document.createElement("div");

    const cardNumberInput = document.createElement("input");
    cardNumberInput.id = "card-number";
    cardNumberInput.type = "text";
    cardNumberInput.placeholder = "Card Number";
    content.appendChild(cardNumberInput);

    const expiryDateInput = document.createElement("input");
    expiryDateInput.id = "expiry-date";
    expiryDateInput.type = "text";
    expiryDateInput.placeholder = "MM/YY Expiry Date";
    content.appendChild(expiryDateInput);

    const cvvInput = document.createElement("input");
    cvvInput.id = "cvv";
    cvvInput.type = "text";
    cvvInput.placeholder = "CVV";
    content.appendChild(cvvInput);

    const paymentMessage = document.createElement("p");
    paymentMessage.id = "payment-message";
    paymentMessage.textContent = "Enter your card details to proceed.";
    content.appendChild(paymentMessage);

    const confirmButton = Button("Pay Now", "confirm-payment-btn", {
        click: () => submitPayment(paymentSession, paymentMessage, eventId),
    });
    content.appendChild(confirmButton);

    const modal = Modal({
        title: "Payment Information",
        content,
        onClose: () => modal.remove(),
    });
}

// Function to create a payment session for the ticket purchase
async function createPaymentSession(ticketId, eventId, quantity) {
    try {
        const body = JSON.stringify({ quantity });
        const response = await apiFetch(`/ticket/event/${eventId}/${ticketId}/payment-session`, "POST", body);
        if (response && response.success && response.data) {
            return response.data; // Return the payment session data
        } else {
            throw new Error(response?.message || "Failed to create payment session.");
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
        return null;
    }
}


// Function to submit the payment
function submitPayment(paymentSession, paymentMessage, eventId) {
    const cardNumber = document.getElementById("card-number").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const cvv = document.getElementById("cvv").value;

    if (cardNumber && expiryDate && cvv) {
        paymentMessage.textContent = "Payment processing...";

        setTimeout(() => {
            // Simulate payment success
            paymentMessage.textContent = "Payment Successful! Redirecting...";

            // Make API call to notify the backend about the purchase
            apiFetch('/ticket/confirm-purchase', 'POST', JSON.stringify({
                ticketId: paymentSession.ticketid,  // Use actual ticket ID
                eventId: paymentSession.eventid,    // Use actual event ID
                quantity: paymentSession.quantity
            }))
            // .then(response => response.json())
            .then(data => {
                if (data.message === "Payment successfully processed. Ticket purchased.") {
                    // Notify frontend about the successful purchase
                    alert('Ticket purchased successfully!');
                    
                    // Redirect user to event details page or purchase confirmation page
                    // window.location.href = `/event/${paymentSession.eventId}`;  // Update this to where you want the user to be redirected
                    window.location.href = `/event/${eventId}`;  // Update this to where you want the user to be redirected
                } else {
                    // If the message is unexpected or there is an issue with the response, we handle the fallback here
                    console.error('Unexpected response from backend:', data);
                    alert('Payment failed! Please try again.');
                    paymentMessage.textContent = "Payment failed. Please try again.";
                }
            })
            .catch(error => {
                console.error("Error during payment:", error);
                alert("Payment failed. Please try again.");
                paymentMessage.textContent = "Payment failed. Please try again.";
            });
        }, 2000);
    } else {
        paymentMessage.textContent = "Please fill in all fields.";
    }
}


// Updated function to handle ticket buying with quantity input
async function buyTicket(ticketId, eventId, quantity) {
    try {
        const body = JSON.stringify({
            quantity: quantity
        });

        const result = await apiFetch(`/ticket/event/${eventId}/${ticketId}/buy`, "POST", body);

        if (result && result.success) {
            alert(`Successfully purchased ${quantity} ticket(s)!`);
        } else {
            throw new Error(result?.message || "Unexpected error during purchase.");
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}


export { clearTicketForm, addTicketForm, addTicket, displayNewTicket, deleteTicket, displayTickets, editTicket };