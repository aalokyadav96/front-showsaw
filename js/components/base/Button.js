import "../../../css/ui/Button.css";

// Button with custom event handler
const Button = (title, id, events = {}, classes) =>  {
    const button = document.createElement('button');
    button.textContent = title;
    button.id = id;
  
    // Add multiple events if needed
    for (const event in events) {
      button.addEventListener(event, events[event]);
    }
    
    button.classList.add('button');
    button.classList.add(classes);
    return button;
  }

  
export default Button;
export {Button};