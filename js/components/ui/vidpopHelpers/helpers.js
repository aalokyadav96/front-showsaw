export function createElement(tag, className, attributes = {}, events = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v));
    Object.entries(events).forEach(([event, handler]) => el.addEventListener(event, handler));
    return el;
  }
  
  export function appendElements(parent, children) {
    children.forEach(child => child && parent.appendChild(child));
  }
  