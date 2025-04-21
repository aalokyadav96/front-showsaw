import Modal from '../../components/ui/Modal.mjs';

// Simulated function to check ticket validity
const checkTicketValidity = (ticketId) => {
  // For now, randomly approve or reject
  return new Promise((resolve) => {
    setTimeout(() => {
      const isValid = Math.random() > 0.5;
      resolve(isValid);
    }, 1000); // simulate network delay
  });
};

const verifyTicketAndShowModal = async (ticketId) => {
  const loadingText = document.createElement('p');
  loadingText.textContent = 'Verifying your ticket...';

  const loadingModal = Modal({
    title: 'Ticket Verification',
    content: loadingText,
    onClose: () => loadingModal.remove()
  });

  const isValid = await checkTicketValidity(ticketId);

  loadingModal.remove(); // remove the loader

  const resultContent = document.createElement('div');
  const resultText = document.createElement('p');
  resultText.textContent = isValid
    ? '✅ Your ticket is valid!'
    : '❌ Invalid ticket. Please contact support.';

  resultContent.appendChild(resultText);

  Modal({
    title: 'Ticket Result',
    content: resultContent,
    onClose: () => document.querySelector('.modal')?.remove()
  });
};

// Example usage
// verifyTicketAndShowModal("ABC123");

export {verifyTicketAndShowModal};