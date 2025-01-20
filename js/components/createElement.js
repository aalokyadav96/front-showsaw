
// // Function to dynamically create HTML content
// function createElement(tag, attributes = {}, children = []) {
//     const element = document.createElement(tag);
//     Object.entries(attributes).forEach(([key, value]) => {
//         if (key.startsWith('on') && typeof value === 'function') {
//             element.addEventListener(key.slice(2).toLowerCase(), value);
//         } else {
//             element.setAttribute(key, value);
//         }
//     });
//     children.forEach(child => {
//         if (typeof child === 'string') {
//             element.appendChild(document.createTextNode(child));
//         } else {
//             element.appendChild(child);
//         }
//     });
//     return element;
// }

function createElement(tag, attributes, children = []) {
    const element = document.createElement(tag);

    // Set attributes
    if (attributes) {
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
    }

    // Append children
    children.forEach((child) => {
        if (typeof child === "string" || typeof child === "number") {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        } else {
            console.error("Invalid child passed to createElement:", child);
        }
    });

    return element;
}

export { createElement };