import "../../../css/ui/TicketCard.css";
const TicketCard = ({ isl ,creator, name, price, quantity, attributes = {}, onClick }) => {
  const card = document.createElement('div');
  card.className = 'ticket-card';

  // Add attributes dynamically
  Object.entries(attributes).forEach(([key, value]) => {
    card.setAttribute(key, value);
  });

  const nameElement = document.createElement('h3');
  nameElement.textContent = name;

  const priceElement = document.createElement('p');
  priceElement.textContent = `Price: $${(price / 100).toFixed(2)}`;

  const availableElement = document.createElement('p');
  availableElement.className = 'availability'; // For easier updates
  availableElement.textContent = `Available: ${quantity}`;

  card.appendChild(nameElement);
  card.appendChild(priceElement);
  card.appendChild(availableElement);

  if (!creator && isl) {
    const button = document.createElement('button');
    if (quantity > 0) {
      button.textContent = 'Buy Ticket';
      button.addEventListener('click', () => onClick(name, quantity));
    } else {
      button.textContent = 'Sold Out';
      button.style.backgroundColor = "#ddd";
      button.style.color = "#000";
      button.disabled = true;
    }
    card.appendChild(button);
  }

  return card;
};

export default TicketCard;
