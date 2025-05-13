export function displayAI(contentContainer, isLoggedIn) {
    // Clear the container
    while (contentContainer.firstChild) {
        contentContainer.removeChild(contentContainer.firstChild);
    }

    const title = document.createElement('h2');
    title.textContent = 'AI Utilities';
    contentContainer.appendChild(title);

    if (!isLoggedIn) {
        const loginMsg = document.createElement('p');
        loginMsg.textContent = 'Please log in to access AI features.';
        contentContainer.appendChild(loginMsg);
        return;
    }

    const featureList = [
        { label: 'Image Translation', handler: handleImageTranslation },
        { label: 'Image-to-Image Conversion', handler: handleImageToImage },
        { label: 'Text-to-Image Generation', handler: handleTextToImage },
        { label: 'AI Chat / Q&A', handler: handleAIChat }
    ];

    featureList.forEach(feature => {
        const section = document.createElement('div');
        section.style.marginBottom = '20px';

        const header = document.createElement('h3');
        header.textContent = feature.label;
        section.appendChild(header);

        feature.handler(section); // Attach specific UI/logic
        contentContainer.appendChild(section);
    });
}

// === Feature Handlers ===

function handleImageTranslation(container) {
    const input = createImageInput();
    const button = createButton('Translate Image', () => {
        const file = input.files[0];
        if (file) {
            // Placeholder for AI logic
            console.log('Translating image:', file.name);
        }
    });
    container.appendChild(input);
    container.appendChild(button);
}

function handleImageToImage(container) {
    const input = createImageInput();
    const button = createButton('Convert Image', () => {
        const file = input.files[0];
        if (file) {
            // Placeholder for AI logic
            console.log('Converting image:', file.name);
        }
    });
    container.appendChild(input);
    container.appendChild(button);
}

function handleTextToImage(container) {
    const textarea = document.createElement('textarea');
    textarea.rows = 3;
    textarea.placeholder = 'Describe the image you want...';

    const button = createButton('Generate Image', () => {
        const prompt = textarea.value.trim();
        if (prompt) {
            // Placeholder for AI logic
            console.log('Generating image for prompt:', prompt);
        }
    });

    container.appendChild(textarea);
    container.appendChild(button);
}

function handleAIChat(container) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Ask something...';

    const button = createButton('Send', () => {
        const question = input.value.trim();
        if (question) {
            // Placeholder for AI chat logic
            console.log('AI chat question:', question);
        }
    });

    container.appendChild(input);
    container.appendChild(button);
}

// === Helper Functions ===

function createImageInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    return input;
}

function createButton(label, onClick) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
}
