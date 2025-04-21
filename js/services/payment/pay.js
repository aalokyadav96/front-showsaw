// purchase.js

// Imports
import { apiFetch } from "../../api/api.js";
import { Button } from "../../components/base/Button.js";
import Modal from "../../components/ui/Modal.mjs";
import { logActivity } from "../activity/activity.js";

// --- Configuration for Entity Types ---

const ENTITY_CONFIG = {
  ticket: {
    apiPath: (eventId, itemId) => `/ticket/event/${eventId}/${itemId}/payment-session`,
    payload: (itemId, eventId, quantity) => ({ quantity })
  },
  merch: {
    apiPath: (eventId, itemId) => `/merch/event/${eventId}/${itemId}/payment-session`,
    payload: (itemId, eventId, quantity) => ({ merchId: itemId, eventId, stock: quantity })
  },
  menu: {
    apiPath: (eventId, itemId) => `/places/menu/${eventId}/${itemId}/payment-session`,
    payload: (itemId, eventId, quantity) => ({ menuId: itemId, eventId, stock: quantity })
  }
};

const CONFIRM_PURCHASE_CONFIG = {
  ticket: {
    apiPath: (eventId, itemId) => `/ticket/event/${eventId}/${itemId}/confirm-purchase`,
    payload: (paymentSession) => ({
      ticketId: paymentSession.ticketid,
      eventId: paymentSession.eventid,
      quantity: paymentSession.quantity
    })
  },
  merch: {
    apiPath: (eventId, itemId) => `/merch/event/${eventId}/${itemId}/confirm-purchase`,
    payload: (paymentSession) => ({
      merchId: paymentSession.merchId,
      eventId: paymentSession.eventId,
      stock: paymentSession.stock
    })
  },
  menu: {
    apiPath: (eventId, itemId) => `/places/menu/${eventId}/${itemId}/confirm-purchase`,
    payload: (paymentSession) => ({
      menuId: paymentSession.menuId,
      eventId: paymentSession.placeId,
      stock: paymentSession.stock
    })
  }
};

// --- Helper to Create HTML Elements ---

/**
 * Creates an HTML element with attributes.
 *
 * @param {string} tag - The element tag
 * @param {Object} attributes - Key/value pairs for element attributes
 */
function createElement(tag, attributes = {}) {
  const element = document.createElement(tag);
  Object.assign(element, attributes);
  return element;
}

/**
 * Creates an input field with the provided attributes.
 *
 * @param {string} id - The element id
 * @param {string} type - The input type
 * @param {string} placeholder - The placeholder text
 * @param {Object} extraAttributes - Additional attributes to set
 */
function createInputField(id, type, placeholder, extraAttributes = {}) {
  return createElement("input", { id, type, placeholder, ...extraAttributes });
}

/**
 * Generic form modal builder. It creates a form, inserts provided fields,
 * and executes the onSubmit callback when the form is submitted.
 *
 * @param {Object} config - Modal configuration
 * @param {string} config.title - Modal title
 * @param {HTMLElement[]} config.fields - Array of HTML elements (inputs, labels, etc.)
 * @param {Function} config.onSubmit - Callback to execute on form submit, receives FormData.
 * @param {Function} [config.onClose] - Optional callback for modal close.
 */
function createFormModal({ title, fields, onSubmit, onClose }) {
  const form = createElement("form");

  // Add each field to form
  fields.forEach(field => form.appendChild(field));

  // Create submit button using your Button component
  const submitButton = Button("Submit", "modal-submit-btn", { type: "submit" });
  form.appendChild(submitButton);

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    onSubmit(formData);
  });

  // Wrap our form inside a modal component
  const modalInstance = Modal({
    title,
    content: form,
    onClose: () => {
      if (onClose) onClose();
      modalInstance.remove();
    }
  });
  return modalInstance;
}

// --- Unified Purchase Handler ---

/**
 * Handles purchase actions (tickets, merch, menu) in a unified way.
 *
 * @param {string} type - "merch", "ticket", or "menu"
 * @param {string} itemId - The item (merch, ticket, menu) identifier
 * @param {string} eventId - The event or place identifier
 * @param {number} maxQuantity - Maximum selectable quantity or pre-determined value for "menu"
 */
async function handlePurchase(type = "merch", itemId, eventId, maxQuantity) {
  // Define the high-level entity type used for routing (ticket/merch are part of 'event', menu is under 'place')
  const entityType = type === "menu" ? "place" : "event";

  // Generic function to create a payment session and show the payment modal.
  const proceedWithPayment = async (quantity) => {
    try {
      const paymentSession = await createPaymentSession(entityType, type, itemId, eventId, quantity);
      if (paymentSession) {
        showPaymentModal(entityType, type, paymentSession, eventId, itemId);
      }
    } catch (error) {
      console.error("Error creating payment session:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  // For menu type, quantity is predetermined (maxQuantity) so we can skip the quantity input modal.
  if (type === "menu") {
    await proceedWithPayment(maxQuantity);
  } else {
    // Create quantity input modal
    const quantityLabel = createElement("label", {
      htmlFor: "quantity-input",
      textContent: "Enter Quantity:"
    });
    // Note: input type number with range restrictions.
    const quantityInput = createInputField("quantity-input", "number", "Quantity", {
      min: "1",
      max: maxQuantity.toString(),
      value: "1",
      "aria-label": `${type} Quantity`
    });

    const quantityModal = createFormModal({
      title: `Purchase ${type === "merch" ? "Merchandise" : "Ticket"}`,
      fields: [quantityLabel, quantityInput],
      onSubmit: (formData) => {
        const quantity = parseInt(document.getElementById("quantity-input").value);
        // const quantity = parseInt(formData.get("quantity-input"));
        if (isNaN(quantity) || quantity < 1 || quantity > maxQuantity) {
            alert(quantity);
          alert(`Please enter a valid quantity between 1 and ${maxQuantity}.`);
          return;
        }
        proceedWithPayment(quantity);
        quantityModal.remove();
      },
      onClose: () => {
        // You can perform additional cleanup if needed
      }
    });
    document.body.appendChild(quantityModal);
  }
}

// --- API Session and Payment Modal Functions ---

/**
 * Creates a payment session for the selected purchase type.
 *
 * @param {string} entityType - "event" or "place"
 * @param {string} itemType - "merch", "ticket", or "menu"
 * @param {string} itemId
 * @param {string} eventId
 * @param {number} quantity
 * @returns {Promise<Object|null>} Payment session data or null on error.
 */
async function createPaymentSession(entityType, itemType, itemId, eventId, quantity) {
  try {
    if (!ENTITY_CONFIG[itemType]) {
      throw new Error(`Unsupported entity type: ${itemType}`);
    }

    const apiUrl = ENTITY_CONFIG[itemType].apiPath(eventId, itemId);
    const body = JSON.stringify(ENTITY_CONFIG[itemType].payload(itemId, eventId, quantity));

    const response = await apiFetch(apiUrl, "POST", body);
    if (response?.success && response?.data) return response.data;

    throw new Error(response?.message || "Failed to create payment session.");
  } catch (error) {
    console.error("Error:", error);
    alert(`Error: ${error.message}`);
    return null;
  }
}

/**
 * Displays the payment modal to collect card details.
 *
 * @param {string} entityType - "event" or "place"
 * @param {string} type - "merch", "ticket", or "menu"
 * @param {Object} paymentSession - The session object returned from createPaymentSession
 * @param {string} eventId
 * @param {string} itemId
 */
function showPaymentModal(entityType, type, paymentSession, eventId, itemId) {
  // Create payment fields with basic placeholder text.
  const cardNumberInput = createInputField("card-number", "text", "Card Number (16 digits)", {
    maxLength: 16,
    pattern: "\\d{16}"
  });
  const expiryDateInput = createInputField("expiry-date", "text", "MM/YY", {
    placeholder: "MM/YY",
    pattern: "^(0[1-9]|1[0-2])\\/?([0-9]{2})$"
  });
  const cvvInput = createInputField("cvv", "text", "CVV (3 digits)", {
    maxLength: 3,
    pattern: "\\d{3}"
  });
  const paymentMessage = createElement("p", { id: "payment-message", textContent: "Enter your card details to proceed." });

  // Create the payment form modal.
  const paymentModal = createFormModal({
    title: "Payment Information",
    fields: [cardNumberInput, expiryDateInput, cvvInput, paymentMessage],
    onSubmit: (formData) => {
      submitPayment(entityType, type, paymentSession, paymentMessage, eventId, itemId, formData);
      // Keep modal open until success/failure feedback and eventual redirect.
    },
    onClose: () => {
      // Clean up if required
    }
  });
  document.body.appendChild(paymentModal);
}

/**
 * Submits the payment after validating card fields. Uses a simple payment adapter
 * pattern so that you can plug in different payment processing logic later.
 *
 * @param {string} entityType - "event" or "place"
 * @param {string} itemType - "merch", "ticket", or "menu"
 * @param {Object} paymentSession - The session object from createPaymentSession
 * @param {HTMLElement} paymentMessage - The DOM element where messages are shown
 * @param {string} eventId
 * @param {string} itemId
 * @param {FormData} formData - Form data from the payment modal
 */
async function submitPayment(entityType, itemType, paymentSession, paymentMessage, eventId, itemId, formData) {
  // Disable the payment button (the button has id "modal-submit-btn")
  const submitBtn = document.getElementById("modal-submit-btn");
  if (submitBtn) submitBtn.disabled = true;

  // Retrieve form field values
//   const cardNumber = formData.get("card-number")?.trim();
  const cardNumber = document.getElementById("card-number").value;
//   const expiryDate = formData.get("expiry-date")?.trim();
  const expiryDate = document.getElementById("expiry-date").value;
//   const cvv = formData.get("cvv")?.trim();
  const cvv = document.getElementById("cvv").value;

  // Basic client-side validations using regex
  const cardNumberRegex = /^\d{16}$/;
  const expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
  const cvvRegex = /^\d{3}$/;
    console.log(cardNumber);
    console.log(expiryDate);
    console.log(cvv);
  if (!cardNumber || !expiryDate || !cvv ||
      !cardNumberRegex.test(cardNumber) ||
      !expiryDateRegex.test(expiryDate) ||
      !cvvRegex.test(cvv)) {
    paymentMessage.textContent = "Please fill in all fields correctly.";
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  paymentMessage.textContent = "Processing payment...";
  
  // Simulate a delay or use a spinner here
  // In development mode, you might simulate payment success without an API call.
  const isDevelopment = (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "development");

  if (isDevelopment) {
    setTimeout(() => {
      alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} purchased successfully! [Development Mode]`);
      logActivity(`${itemType}_purchased`, { itemId, eventId });
      window.location.href = `/${entityType}/${eventId}`;
    }, 1000);
    return;
  }

  // Real payment simulation using API
  setTimeout(async () => {
    try {
      if (!CONFIRM_PURCHASE_CONFIG[itemType]) {
        throw new Error(`Unsupported entity type: ${itemType}`);
      }
      const apiUrl = CONFIRM_PURCHASE_CONFIG[itemType].apiPath(eventId, itemId);
      const payload = JSON.stringify(CONFIRM_PURCHASE_CONFIG[itemType].payload(paymentSession));
      const response = await apiFetch(apiUrl, "POST", payload);

      // Check for a structured success flag
      if (response?.success) {
        alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} purchased successfully!`);
        logActivity(`${itemType}_purchased`, { itemId, eventId });
        window.location.href = `/${entityType}/${eventId}`;
      } else {
        throw new Error(response?.message || "Unexpected response from backend.");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Payment failed! Please try again.");
      paymentMessage.textContent = "Payment failed. Please try again.";
      if (submitBtn) submitBtn.disabled = false;
    }
  }, 2000);
}

// Export the handlePurchase function for use elsewhere.
export { handlePurchase };
