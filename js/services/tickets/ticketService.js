import { apiFetch } from "../../api/api.js";
import TicketCard from '../../components/ui/TicketCard.mjs';
import { Button } from "../../components/base/Button.js";
import { createElement } from "../../components/createElement.js";
import { showSeatSelection } from "./seats.js";
import { clearTicketForm, deleteTicket, editTicket } from "./editTicket.js";
import { handlePurchase } from "../payment/paymentService.js";
import { displayEventVenue } from "../event/eventTabs.js";
import SnackBar from "../../components/ui/Snackbar.mjs";
import { createButton } from "../../components/eventHelper.js";

// function showBuyTicketModal(ticketId, eventId, quantity, isLoggedIn, isCreator) {
//     if (!isLoggedIn) {
//         alert("Please log in to purchase tickets.");
//         return;
//     }

//     let maxQuantity = 6;

//     if (maxQuantity <= 0) {
//         // alert("You need to buy at least one ticket to select seats.");
//         alert("You need to buy at least one ticket.");
//         return;
//     }

//     showSeatSelection(ticketId, eventId, maxQuantity);
// }


function showBuyTicketModal(ticketId, eventId, totalQuantity, isLoggedIn, isCreator) {
    let maxQuantity = 6;
    if(isLoggedIn) {
        handlePurchase("ticket", ticketId, eventId, maxQuantity, totalQuantity);
    }
}

// Add ticket to the event
async function addTicket(eventId, ticketList) {
    const tickName = document.getElementById('ticket-name').value.trim();
    const tickPrice = parseFloat(document.getElementById('ticket-price').value);
    const tickQuantity = parseInt(document.getElementById('ticket-quantity').value);
    const tickColor = document.getElementById('ticket-color').value; // Get color
    const tickCurrency = document.getElementById('ticket-currency').value; // Get currency

    if (!tickName || isNaN(tickPrice) || isNaN(tickQuantity) || !tickCurrency) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const formData = new FormData();
    formData.append('name', tickName);
    formData.append('price', tickPrice);
    formData.append('quantity', tickQuantity);
    formData.append('color', tickColor); // Include color
    formData.append('currency', tickCurrency); // Include currency

    try {
        const response = await apiFetch(`/ticket/event/${eventId}`, 'POST', formData);

        if (response && response.ticketid) {
            SnackBar("Ticket added successfully!");
            displayNewTicket(response, ticketList);  // Display the newly added ticket
            clearTicketForm();  // Optionally clear the form after success
        } else {
            alert(`Failed to add ticket: ${response?.message || 'Unknown error'}`);
        }
    } catch (error) {
        alert(`Error adding ticket: ${error.message}`);
    }
}

function addTicketForm(eventId, ticketList) {
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

    // Currency selection dropdown
    const currencySelect = document.createElement('select');
    currencySelect.id = 'ticket-currency';
    currencySelect.required = true;

    const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"]; // Add more if needed
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        currencySelect.appendChild(option);
    });

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.id = 'ticket-quantity';
    quantityInput.placeholder = 'Quantity Available';
    quantityInput.required = true;

    // 🎨 Color picker input
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'ticket-color';
    colorInput.value = '#3498db'; // Default color

    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Choose Ticket Color: ';
    colorLabel.appendChild(colorInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Ticket';

    form.appendChild(nameInput);
    form.appendChild(priceInput);
    form.appendChild(currencySelect); // Add currency dropdown
    form.appendChild(quantityInput);
    form.appendChild(colorLabel);  // Add color picker
    form.appendChild(submitButton);

    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancel-ticket-form';
    cancelButton.textContent = 'Cancel';

    // Use replaceChildren to clear and replace the content
    editEventDiv.replaceChildren(heading, form, cancelButton);

    // Attach event listeners
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        addTicket(eventId, ticketList);
    });
    cancelButton.addEventListener('click', clearTicketForm);
}

function displayNewTicket(ticketData, ticketList) {
    const ticketItem = document.createElement("li");
    ticketItem.className = 'ticket-item';
    ticketItem.style.backgroundColor = ticketData.color || '#f3f3f3'; // Use color or default gray

    ticketItem.innerHTML = `
        <div class="hflex">
            <h3>Name: ${ticketData.name}</h3>
            <p>Price: ${ticketData.currency} ${(ticketData.price / 100).toFixed(2)}</p>
            <p>Available: ${ticketData.quantity}</p>
        </div>
        <div class="ticket-actions">
            <button class="edit-ticket-btn">Edit Ticket</button>
            <button class="delete-ticket-btn delete-btn">Delete Ticket</button>
        </div>
    `;

    ticketItem.querySelector('.edit-ticket-btn').addEventListener('click', () => editTicket(ticketData.ticketid, ticketData.eventid));
    ticketItem.querySelector('.delete-ticket-btn').addEventListener('click', () => deleteTicket(ticketData.ticketid, ticketData.eventid));

    ticketList.appendChild(ticketItem);
}

async function displayTickets(ticketLixt, ticketData, eventId, isCreator, isLoggedIn) {

    if (!Array.isArray(ticketData)) {
        throw new Error("Invalid ticket data received.");
    }

    ticketLixt.innerHTML = ""; // Clear existing content

    if (ticketData && !isCreator) {
        ticketLixt.appendChild(createButton({
            text: "Verify Your Ticket", classes: ["button"], events: {
                click: () => {
                    alert("hi");
                }
            }
        }))
    };

    let ticketList = document.createElement('div');
    ticketList.className = ('hvflex gap20');


    try {
        // if (!Array.isArray(ticketData)) {
        //     throw new Error("Invalid ticket data received.");
        // }

        if (isCreator) {
            const button = Button("Add Tickets", "add-ticket-btn", {
                click: () => addTicketForm(eventId, ticketList),
                mouseenter: () => console.log("Button hovered"),
            });

            ticketLixt.prepend(button);
        }

        if (ticketData.length > 0) {
            ticketData.forEach((ticket) => {
                const card = TicketCard({
                    isl: isLoggedIn,
                    creator: isCreator,
                    name: ticket.name,
                    price: `${ticket.currency} ${ticket.price}`,
                    quantity: ticket.quantity,
                    color: ticket.color,
                    attributes: {
                        "data-ticket-id": ticket.ticketid,
                    },
                    onClick: () => showBuyTicketModal(ticket.ticketid, eventId, ticket.quantity, isLoggedIn, isCreator),
                });

                if (isLoggedIn && isCreator) {
                    const editButton = Button("Edit", "edit-ticket-btn", {
                        click: () => editTicket(ticket.ticketid, eventId),
                        mouseenter: () => console.log("Edit hovered"),
                    });

                    const deleteButton = Button("Delete", "delete-ticket-btn", {
                        click: () => deleteTicket(ticket.ticketid, eventId),
                        mouseenter: () => console.log("Delete hovered"),
                    });
                    deleteButton.className = "delete-btn";

                    card.prepend(editButton);
                    card.prepend(deleteButton);
                }
                ticketList.appendChild(card);
            });
        } else {
            ticketList.appendChild(createElement("p", {}, ["No tickets available for this event."]));

            let seatcon = createElement("p", {}, []);
            displayEventVenue(seatcon, eventId, isLoggedIn);

            ticketList.appendChild(seatcon);
        }
    } catch (error) {
        console.error("Error loading tickets:", error);
        ticketList.appendChild(createElement("p", { textContent: `Error loading tickets: ${error.message}` }));
    }
    ticketLixt.appendChild(ticketList);
}


// // Add ticket to the event
// async function addTicket(eventId, ticketList) {
//     const tickName = document.getElementById('ticket-name').value.trim();
//     const tickPrice = parseFloat(document.getElementById('ticket-price').value);
//     const tickQuantity = parseInt(document.getElementById('ticket-quantity').value);
//     const tickColor = document.getElementById('ticket-color').value; // Get color

//     if (!tickName || isNaN(tickPrice) || isNaN(tickQuantity)) {
//         alert("Please fill in all fields correctly.");
//         return;
//     }

//     const formData = new FormData();
//     formData.append('name', tickName);
//     formData.append('price', tickPrice);
//     formData.append('quantity', tickQuantity);
//     formData.append('color', tickColor); // Include color in the form data

//     try {
//         const response = await apiFetch(`/ticket/event/${eventId}`, 'POST', formData);

//         if (response && response.ticketid) {
//             SnackBar("Ticket added successfully!");
//             displayNewTicket(response, ticketList);  // Display the newly added ticket
//             clearTicketForm();  // Optionally clear the form after success
//         } else {
//             alert(`Failed to add ticket: ${response?.message || 'Unknown error'}`);
//         }
//     } catch (error) {
//         alert(`Error adding ticket: ${error.message}`);
//     }
// }

// function addTicketForm(eventId, ticketList) {
//     const editEventDiv = document.getElementById('editevent');

//     const heading = document.createElement('h3');
//     heading.textContent = 'Add Ticket';

//     const form = document.createElement('form');
//     form.id = 'add-ticket-form';

//     const nameInput = document.createElement('input');
//     nameInput.type = 'text';
//     nameInput.id = 'ticket-name';
//     nameInput.placeholder = 'Ticket Name';
//     nameInput.required = true;

//     const priceInput = document.createElement('input');
//     priceInput.type = 'number';
//     priceInput.id = 'ticket-price';
//     priceInput.placeholder = 'Ticket Price';
//     priceInput.required = true;

//     const currencyInput = document.createElement('input');
//     currencyInput.type = 'datalist';
//     currencyInput.id = 'ticket-currency';
//     currencyInput.placeholder = 'Price Currency';
//     currencyInput.required = true;

//     const quantityInput = document.createElement('input');
//     quantityInput.type = 'number';
//     quantityInput.id = 'ticket-quantity';
//     quantityInput.placeholder = 'Quantity Available';
//     quantityInput.required = true;

//     // 🎨 Color picker input
//     const colorInput = document.createElement('input');
//     colorInput.type = 'color';
//     colorInput.id = 'ticket-color';
//     colorInput.value = '#3498db'; // Default color

//     const colorLabel = document.createElement('label');
//     colorLabel.textContent = 'Choose Ticket Color: ';
//     colorLabel.appendChild(colorInput);

//     const submitButton = document.createElement('button');
//     submitButton.type = 'submit';
//     submitButton.textContent = 'Add Ticket';

//     form.appendChild(nameInput);
//     form.appendChild(priceInput);
//     form.appendChild(currencyInput);
//     form.appendChild(quantityInput);
//     form.appendChild(colorLabel);  // Add color picker to form
//     form.appendChild(submitButton);

//     const cancelButton = document.createElement('button');
//     cancelButton.id = 'cancel-ticket-form';
//     cancelButton.textContent = 'Cancel';

//     // Use replaceChildren to clear and replace the content
//     editEventDiv.replaceChildren(heading, form, cancelButton);

//     // Attach event listeners
//     form.addEventListener('submit', (event) => {
//         event.preventDefault();
//         addTicket(eventId, ticketList);
//     });
//     cancelButton.addEventListener('click', clearTicketForm);
// }

// function displayNewTicket(ticketData, ticketList) {
//     const ticketItem = document.createElement("li");
//     ticketItem.className = 'ticket-item';
//     ticketItem.style.backgroundColor = ticketData.color || '#f3f3f3'; // Use color or default gray

//     ticketItem.innerHTML = `
//         <div class="hflex">
//             <h3>Name: ${ticketData.name}</h3>
//             <p>Price: $${(ticketData.price / 100).toFixed(2)}</p>
//             <p>Available: ${ticketData.quantity}</p>
//         </div>
//         <div class="ticket-actions">
//             <button class="edit-ticket-btn">Edit Ticket</button>
//             <button class="delete-ticket-btn delete-btn">Delete Ticket</button>
//         </div>
//     `;

//     ticketItem.querySelector('.edit-ticket-btn').addEventListener('click', () => editTicket(ticketData.ticketid, ticketData.eventid));
//     ticketItem.querySelector('.delete-ticket-btn').addEventListener('click', () => deleteTicket(ticketData.ticketid, ticketData.eventid));

//     ticketList.appendChild(ticketItem);
// }




// async function displayTickets(ticketLixt, ticketData, eventId, isCreator, isLoggedIn) {
//     ticketLixt.innerHTML = ""; // Clear existing content
//     let ticketList = document.createElement('div');
//     ticketList.className = ('hvflex gap20');

//     try {
//         if (!Array.isArray(ticketData)) {
//             throw new Error("Invalid ticket data received.");
//         }

//         if (isCreator) {
//             const button = Button("Add Tickets", "add-ticket-btn", {
//                 click: () => addTicketForm(eventId, ticketList),
//                 mouseenter: () => console.log("Button hovered"),
//             });

//             ticketLixt.prepend(button);
//         }

//         if (ticketData.length > 0) {
//             ticketData.forEach((ticket) => {
//                 const card = TicketCard({
//                     isl: isLoggedIn,
//                     creator: isCreator,
//                     name: ticket.name,
//                     price: ticket.price,
//                     quantity: ticket.quantity,
//                     color: ticket.color,
//                     attributes: {
//                         "data-ticket-id": ticket.ticketid,
//                     },
//                     onClick: () => showBuyTicketModal(ticket.ticketid, eventId, ticket.quantity, isLoggedIn, isCreator),
//                 });

//                 if (isLoggedIn && isCreator) {
//                     const editButton = Button("Edit", "edit-ticket-btn", {
//                         click: () => editTicket(ticket.ticketid, eventId),
//                         mouseenter: () => console.log("Edit hovered"),
//                     });

//                     const deleteButton = Button("Delete", "delete-ticket-btn", {
//                         click: () => deleteTicket(ticket.ticketid, eventId),
//                         mouseenter: () => console.log("Delete hovered"),
//                     });
//                     deleteButton.className = "delete-btn";

//                     card.prepend(editButton);
//                     card.prepend(deleteButton);
//                 }
//                 ticketList.appendChild(card);
//             });
//         } else {
//             ticketList.appendChild(createElement("p", {}, ["No tickets available for this event."]));

//             let seatcon = createElement("p", {}, []);
//             displayEventVenue(seatcon, eventId, isLoggedIn);

//             ticketList.appendChild(seatcon);
//         }
//     } catch (error) {
//         console.error("Error loading tickets:", error);
//         ticketList.appendChild(createElement("p", { textContent: `Error loading tickets: ${error.message}` }));
//     }
//     ticketLixt.appendChild(ticketList);
// }


export { clearTicketForm, addTicketForm, addTicket, displayNewTicket, deleteTicket, displayTickets, editTicket };