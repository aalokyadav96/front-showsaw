import { Button } from "../../components/base/Button.js";
import { createElement } from "../../components/createElement.js";
import { apiFetch } from "../../api/api.js"; // Assuming you have these utility functions

async function displayEventFAQs(isCreator, faqContainer, eventId, faques) {
    faqContainer.innerHTML = ''; // Clear existing content

    // If the user is the creator, show the "Add FAQs" button
    if (isCreator) {
        const addFaqButton = Button("Add FAQs", "add-faq-btn", {
            click: () => showFaqForm(faqContainer, eventId),
        });
        faqContainer.appendChild(addFaqButton);
    }
    
    // Fetch FAQs dynamically from the backend
    try {
        // const faqs = await apiFetch(`/events/event/${eventId}/faqs`); // Adjust the endpoint as needed
        const faqs = faques
        if (faqs && faqs.length > 0) {
            faqs.forEach(({ title, content }) => {
                renderFaqItem(title, content, faqContainer);
            });
        } else {
            faqContainer.appendChild(
                createElement('p', {}, ["No FAQs Given"]),
            );
        }
    } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        faqContainer.appendChild(
            createElement("p", {
                textContent: "Failed to load FAQs. Please try again later.",
                classes: ["error-message"],
            })
        );
    }
}

// Function to render a single FAQ item
function renderFaqItem(title, content, container) {
    const faqItem = createElement('div', { classes: ['faq-item'] });
    const faqTitle = createElement('h3', { textContent: title, classes: ['faq-title'] });
    const faqContent = createElement('p', { textContent: content, classes: ['faq-content'] });

    faqItem.appendChild(faqTitle);
    faqItem.appendChild(faqContent);
    container.appendChild(faqItem);
}

// Function to display the FAQ form
function showFaqForm(faqContainer, eventId) {
    // Clear existing form if any
    const existingForm = document.getElementById('faq-form');
    if (existingForm) existingForm.remove();

    // Create the form
    const form = createElement('form', { id: 'faq-form', classes: ['faq-form'] });
    const questionInput = createElement('input', {
        type: 'text',
        placeholder: 'Enter FAQ title',
        required: true,
        classes: ['faq-input'],
    });
    const answerInput = createElement('textarea', {
        placeholder: 'Enter FAQ content',
        required: true,
        classes: ['faq-textarea'],
    });

    const submitButton = createElement('input', {
        type: 'submit',
        value: 'Add FAQ',
        classes: ['submit-faq-btn'],
    });

    form.appendChild(questionInput);
    form.appendChild(answerInput);
    form.appendChild(submitButton);

    faqContainer.appendChild(form);

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = questionInput.value.trim();
        const content = answerInput.value.trim();

        if (title && content) {
            try {
                // Send the new FAQ to the backend
                const response = await apiFetch(`/events/event/${eventId}/faqs`, 'POST', {
                    title,
                    content,
                });

                if (response.success) {
                    renderFaqItem(title, content, faqContainer);
                    form.reset();
                } else {
                    alert('Failed to add FAQ. Please try again.');
                }
            } catch (error) {
                console.error("Failed to add FAQ:", error);
                alert('An error occurred while adding the FAQ.');
            }
        } else {
            alert('Please fill out both fields.');
        }
    });
}

export { displayEventFAQs };
