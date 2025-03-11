import "../../../css/ui/Countdown.css";

const Countdown = (targetDate, onEnd = () => {}) => {
  // `targetDate` should already be a Date object in local time.
  const container = document.createElement('div');
  container.className = 'countdown';

  let interval; // Declare interval before use

  function updateCountdown() {
    const now = new Date();
    const timeDiff = targetDate.getTime() - now.getTime();

    if (timeDiff <= 0) {
      container.textContent = "Event Started!";
      clearInterval(interval);
      onEnd();
      return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    container.textContent =
      (days > 0 ? `${days}d ` : "") +
      `${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  interval = setInterval(updateCountdown, 1000);

  return container;
};

export default Countdown;
