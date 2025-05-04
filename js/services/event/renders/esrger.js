// --- Helper: createElement ---
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    if (attributes) {
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
    }

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

// --- Helper: create CTA Button ---
function createCTAButton(text, onClick, args = []) {
    const button = createElement('button', { class: 'cta-button' }, [text]);
    button.addEventListener('click', () => onClick(...args));
    return button;
}

// --- Helper: create Tabs ---
function createTabx(tabLabels = ['menu', 'book', 'order'], tabActions = {}) {
    const tabs = createElement('div', { class: 'tabs' });

    tabLabels.forEach(tabName => {
        const label =
            tabName === 'menu' ? 'Menu' :
            tabName === 'book' && tabLabels.includes('menu') ? 'Book a Table' :
            tabName === 'order' ? 'Order Online' :
            tabName === 'events' ? 'Events' :
            tabName === 'book' ? 'Book Seats' :
            tabName === 'map' ? 'Map' :
            tabName;

        const tabButton = createElement('button', {}, [label]);
        tabButton.addEventListener('click', () => {
            if (tabActions[tabName]) tabActions[tabName]();
            showTabContent(tabName);
        });
        tabs.appendChild(tabButton);
    });

    return tabs;
}

// --- Helper: create Tab Content ---
function createTabContent(id, { title, description, ctaText, ctaAction, ctaArgs = [] }) {
    const children = [
        createElement('h3', {}, [title]),
        createElement('p', {}, [description]),
    ];

    if (ctaText && ctaAction) {
        const button = createCTAButton(ctaText, ctaAction, ctaArgs);
        children.push(button);
    }

    return createElement('div', { class: 'tab-contentx', id, style: 'display:none;' }, children);
}

// --- Helper: Show Selected Tab ---
function showTabContent(tabName) {
    const tabContents = document.querySelectorAll('.tab-contentx');
    tabContents.forEach(content => content.style.display = 'none');
    const activeTab = document.getElementById(tabName);
    if (activeTab) activeTab.style.display = 'block';
}

// --- Helper: Common Content Renderer ---
export async function renderCommonContent(data, container, isCreator, type, tabLabels, tabContentsConfig) {
    const section = createElement('section', { class: type }, [
        createTabx(tabLabels),

        // Tab Content Blocks
        ...tabLabels.map(tabName => createTabContent(tabName, tabContentsConfig[tabName])),

    ]);

    container.appendChild(section);
}


// // --- Helper: createElement ---
// function createElement(tag, attributes = {}, children = []) {
//     const element = document.createElement(tag);
  
//     if (attributes) {
//         for (const [key, value] of Object.entries(attributes)) {
//             element.setAttribute(key, value);
//         }
//     }
  
//     children.forEach((child) => {
//         if (typeof child === "string" || typeof child === "number") {
//             element.appendChild(document.createTextNode(child));
//         } else if (child instanceof Node) {
//             element.appendChild(child);
//         } else {
//             console.error("Invalid child passed to createElement:", child);
//         }
//     });
  
//     return element;
//   }
  
//   // --- Helper: create CTA Button ---
//   function createCTAButton(text, onClick) {
//     const button = createElement('button', { class: 'cta-button' }, [text]);
//     button.addEventListener('click', onClick);
//     return button;
//   }
  
//   // --- Helper: create Tabs ---
//   function createTabx(tabLabels = ['menu', 'book', 'order']) {
//     const tabs = createElement('div', { class: 'tabs' });
  
//     tabLabels.forEach(tabName => {
//         const label =
//             tabName === 'menu' ? 'Menu' :
//             tabName === 'book' && tabLabels.includes('menu') ? 'Book a Table' :
//             tabName === 'order' ? 'Order Online' :
//             tabName === 'events' ? 'Events' :
//             tabName === 'book' ? 'Book Seats' :
//             tabName === 'map' ? 'Map' :
//             tabName;
  
//         const tabButton = createElement('button', {}, [label]);
//         tabButton.addEventListener('click', () => showTabContent(tabName));
//         tabs.appendChild(tabButton);
//     });
  
//     return tabs;
//   }
  
//   // --- Helper: create Tab Content ---
//   function createTabContent(id, { title, description, ctaText, ctaAction }) {
//     const children = [
//         createElement('h3', {}, [title]),
//         createElement('p', {}, [description]),
//     ];
  
//     if (ctaText && ctaAction) {
//         const button = createCTAButton(ctaText, ctaAction);
//         children.push(button);
//     }
  
//     return createElement('div', { class: 'tab-contentx', id, style: 'display:none;' }, children);
//   }
  
    
//   // --- Helper: Show Selected Tab ---
//   function showTabContent(tabName) {
//     const tabContents = document.querySelectorAll('.tab-contentx');
//     tabContents.forEach(content => content.style.display = 'none');
//     const activeTab = document.getElementById(tabName);
//     if (activeTab) activeTab.style.display = 'block';
//   }
  
//   // --- Helper: Common Content Renderer ---
//   export async function renderCommonContent(data, container, isCreator, type, tabLabels, tabContentsConfig) {
//     const section = createElement('section', { class: type }, [
//         createTabx(tabLabels),
  
//         // Tab Content Blocks
//         ...tabLabels.map(tabName => createTabContent(tabName, tabContentsConfig[tabName])),
  
//     ]);
  
//     container.appendChild(section);
//   }
  