import { apiFetch } from "../../api/api.js";
import TicketCard from '../../components/ui/TicketCard.mjs';
import { Button } from "../../components/base/Button.js";
import { createElement } from "../../components/createElement.js";
import { handlePurchase } from "../payment/paymentService.js";
import {clearTicketForm, deleteTicket, editTicket} from "./editTicket.js";

function showBuyTicketModal(ticketId, eventId, maxQuantity) {
    handlePurchase("ticket", ticketId, eventId, maxQuantity);
}

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

async function displayTickets(ticketList, ticketData, eventId, isCreator, isLoggedIn) {
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
            ticketList.appendChild(createElement("p", {}, ["No tickets available for this event."] ));
        }
    } catch (error) {
        console.error("Error loading tickets:", error);
        ticketList.appendChild(createElement("p", { textContent: `Error loading tickets: ${error.message}` }));
    }
}

export { clearTicketForm, addTicketForm, addTicket, displayNewTicket, deleteTicket, displayTickets, editTicket };