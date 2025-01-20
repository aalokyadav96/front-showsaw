import { SOCK_URL } from "../../state/state.js";

// const socket = new WebSocket("ws://yourserver.com/ws");
const socket = new WebSocket(SOCK_URL);

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);

    if (data.event === "ticket-updated") {
        console.log(`Ticket ${data.ticketid} updated: ${data.quantity_remaining} remaining`);
        // Update the UI accordingly
    } else if (data.event === "seats-updated") {
        console.log(`Seats booked: ${data.seats.join(", ")}`);
        // Update the UI accordingly
    }
};

socket.onerror = function(error) {
    console.error("WebSocket error:", error);
};
