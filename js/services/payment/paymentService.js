// import { state } from "../../state/state.js";
import { apiFetch } from "../../api/api.js";
import { Button } from "../../components/base/Button.js";
import Modal from "../../components/ui/Modal.mjs";

// Unified function for merchandise or ticket purchase
async function handlePurchase(type, itemId, eventId, maxQuantity) {
    const modal = createQuantityModal(type, maxQuantity, async (quantity) => {
        try {
            const paymentSession = await createPaymentSession(type, itemId, eventId, quantity);
            if (paymentSession) {
                showPaymentModal(paymentSession, eventId, type === "merch" ? itemId : null);
            }
        } catch (error) {
            console.error("Error creating payment session:", error);
            alert("Failed to initiate payment. Please try again.");
        }
        modal.remove(); // Close modal after action
    });

    document.body.appendChild(modal);
}

// Create a reusable modal for quantity input
function createQuantityModal(type, maxQuantity, onConfirm) {
    const content = document.createElement("div");

    const quantityLabel = createElement("label", { for: "quantity-input", textContent: "Enter Quantity:" });
    const quantityInput = createElement("input", {
        id: "quantity-input",
        type: "number",
        min: "1",
        max: maxQuantity.toString(),
        value: "1",
        "aria-label": `${type} Quantity`,
    });

    const confirmButton = Button("Proceed to Payment", "confirm-purchase-btn", {
        click: () => {
            const quantity = parseInt(quantityInput.value);
            if (isNaN(quantity) || quantity < 1 || quantity > maxQuantity) {
                alert(`Please enter a valid quantity between 1 and ${maxQuantity}.`);
                return;
            }
            confirmButton.disabled = true;
            onConfirm(quantity);
        },
    });

    content.append(quantityLabel, quantityInput, confirmButton);

    return Modal({
        title: `Purchase ${type === "merch" ? "Merchandise" : "Ticket"}`,
        content,
    });
}

// Create and show the payment modal
function showPaymentModal(paymentSession, eventId, merchId = null) {
    const content = document.createElement("div");

    const cardNumberInput = createInputField("card-number", "text", "Card Number");
    const expiryDateInput = createInputField("expiry-date", "text", "MM/YY Expiry Date");
    const cvvInput = createInputField("cvv", "text", "CVV");
    const paymentMessage = createElement("p", { id: "payment-message", textContent: "Enter your card details to proceed." });

    const confirmButton = Button("Pay Now", "confirm-payment-btn", {
        click: () => submitPayment(paymentSession, paymentMessage, eventId, merchId),
    });

    content.append(cardNumberInput, expiryDateInput, cvvInput, paymentMessage, confirmButton);

    document.body.appendChild(
        Modal({
            title: "Payment Information",
            content,
        })
    );
}

// Helper function to create input fields
function createInputField(id, type, placeholder) {
    return createElement("input", { id, type, placeholder });
}

// Helper function to create HTML elements
function createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    Object.assign(element, attributes);
    return element;
}

// Create a payment session for merch or ticket
async function createPaymentSession(type, itemId, eventId, quantity) {
    try {
        const apiUrl =
            type === "ticket"
                ? `/ticket/event/${eventId}/${itemId}/payment-session`
                : `/merch/event/${eventId}/${itemId}/payment-session`;

        const body = JSON.stringify(
            type === "ticket"
                ? { quantity }
                : { merchId: itemId, eventId, stock: quantity }
        );

        const response = await apiFetch(apiUrl, "POST", body);
        if (response?.success && response?.data) return response.data;

        throw new Error(response?.message || "Failed to create payment session.");
    } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
        return null;
    }
}

// Submit the payment
async function submitPayment(paymentSession, paymentMessage, eventId, merchId = null) {
    const cardNumber = document.getElementById("card-number").value.trim();
    const expiryDate = document.getElementById("expiry-date").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!cardNumber || !expiryDate || !cvv) {
        paymentMessage.textContent = "Please fill in all fields.";
        return;
    }

    paymentMessage.textContent = "Processing payment...";

    setTimeout(async () => {
        try {
            // const apiUrl = merchId
            //     ? `/merch/event/${eventId}/${merchId}/confirm-purchase`
            //     : "/ticket/confirm-purchase";

            const apiUrl = merchId
                ? `/merch/event/${eventId}/${merchId}/confirm-purchase`
                : `/ticket/event/${eventId}/${merchId}/confirm-purchase`;

            const payload = JSON.stringify(
                merchId
                    ? { merchId, eventId, stock: paymentSession.stock }
                    : { ticketId: paymentSession.ticketid, eventId: paymentSession.eventid, quantity: paymentSession.quantity }
            );

            const response = await apiFetch(apiUrl, "POST", payload);
            if (response?.message.includes("Payment successfully processed")) {
                alert(`${merchId ? "Merch" : "Ticket"} purchased successfully!`);
                window.location.href = `/event/${eventId}`;
            } else {
                throw new Error("Unexpected response from backend.");
            }
        } catch (error) {
            console.error("Error during payment:", error);
            alert("Payment failed! Please try again.");
            paymentMessage.textContent = "Payment failed. Please try again.";
        }
    }, 2000);
}

export { handlePurchase };
