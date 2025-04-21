import "../../../css/ui/Modal.css";

const Modal = ({ title, content, onClose }) => {
  const modal = document.createElement('div');
  modal.className = 'modal';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.addEventListener('click', onClose);

  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog';
  dialog.setAttribute('tabindex', '-1');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', title);

  const header = document.createElement('div');
  header.className = 'modal-header';

  const heading = document.createElement('h3');
  heading.textContent = title;
  header.appendChild(heading);

  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close';
  closeButton.textContent = '×';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.addEventListener('click', onClose);
  header.appendChild(closeButton);

  const body = document.createElement('div');
  body.className = 'modal-body';
  body.appendChild(content);

  dialog.appendChild(header);
  dialog.appendChild(body);

  modal.appendChild(overlay);
  modal.appendChild(dialog);

  // Prevent background scroll
  document.body.style.overflow = 'hidden';

  // Focus trap support
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const trapFocus = (e) => {
    const focusableEls = dialog.querySelectorAll(focusableSelectors);
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    } else if (e.key === 'Escape') {
      onClose(); // Optional: close on ESC
    }
  };

  dialog.addEventListener('keydown', trapFocus);

  document.getElementById('app').appendChild(modal);

  // Autofocus the dialog
  dialog.focus();

  // Cleanup helper
  const cleanup = () => {
    document.body.style.overflow = '';
    dialog.removeEventListener('keydown', trapFocus);
  };

  // Attach cleanup on close
  const wrappedOnClose = () => {
    cleanup();
    onClose();
  };

  // Replace original listeners with wrapped version
  overlay.removeEventListener('click', onClose);
  overlay.addEventListener('click', wrappedOnClose);

  closeButton.removeEventListener('click', onClose);
  closeButton.addEventListener('click', wrappedOnClose);

  return modal;
};

export default Modal;
