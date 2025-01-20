import { apiFetch } from "../../api/api.js";
import ToggleSwitch from '../../components/ui/ToggleSwitch.mjs';
import Dropdown from '../../components/ui/Dropdown.mjs';

async function displaySettings(isLoggedIn, settingsSec) {
    const settingsContainer = createContainer();
    settingsSec.appendChild(settingsContainer);

    const loadingIndicator = createLoadingIndicator();
    const errorContainer = createErrorContainer();

    settingsContainer.appendChild(loadingIndicator);
    settingsContainer.appendChild(errorContainer);

    try {
        const settings = await loadSettings();

        if (settings && settings.length > 0) {
            settings.forEach(setting => {
                const settingForm = createSettingForm(setting);
                settingsContainer.appendChild(settingForm);
            });
        } else {
            errorContainer.textContent = "No settings found.";
        }
    } catch (error) {
        console.error("Error loading settings:", error);
        errorContainer.textContent = `Failed to load settings: ${error.message}`;
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function createContainer() {
    const container = document.createElement("div");
    container.id = "settings-container";
    return container;
}

function createLoadingIndicator() {
    const loadingIndicator = document.createElement("div");
    loadingIndicator.id = "loading";
    loadingIndicator.textContent = "Loading...";
    return loadingIndicator;
}

function createErrorContainer() {
    const errorContainer = document.createElement("div");
    errorContainer.id = "error";
    return errorContainer;
}

async function loadSettings() {
    const settings = await apiFetch('/settings/all');
    return settings && Array.isArray(settings) ? settings : [];
}

function createSettingForm(setting) {
    const form = document.createElement('form');
    form.dataset.type = setting.type;

    const heading = document.createElement('h3');
    heading.textContent = setting.type;

    const inputId = `input-${setting.type}`;
    const label = document.createElement('label');
    label.textContent = setting.description;
    label.setAttribute('for', inputId);

    let inputElement;

    switch (setting.type) {
        case 'theme':
            inputElement = createDropdown(['Light', 'Dark'], setting.value, (selectedOption) => {
                handleSettingUpdate(setting.type, selectedOption);
            });
            break;

        case 'notifications':
        case 'privacy_mode':
        case 'auto_logout':
            inputElement = createToggleSwitch(setting.value, (state) => {
                handleSettingUpdate(setting.type, state);
            });
            break;

        case 'language':
            inputElement = createDropdown(['English', 'Spanish', 'French'], setting.value, (selectedOption) => {
                handleSettingUpdate(setting.type, selectedOption);
            });
            break;

        case 'time_zone':
            inputElement = createDropdown(['UTC', 'PST', 'EST'], setting.value, (selectedOption) => {
                handleSettingUpdate(setting.type, selectedOption);
            });
            break;

        case 'daily_reminder':
            inputElement = document.createElement('input');
            inputElement.type = 'time';
            inputElement.id = inputId;
            inputElement.value = setting.value || '';
            inputElement.addEventListener('change', () => {
                handleSettingUpdate(setting.type, inputElement.value);
            });
            break;

        default:
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.id = inputId;
            inputElement.value = setting.value || '';
            inputElement.addEventListener('blur', () => {
                handleSettingUpdate(setting.type, inputElement.value);
            });
            console.warn(`Unsupported setting type: ${setting.type}`);
            break;
    }

    form.appendChild(heading);
    form.appendChild(label);
    form.appendChild(inputElement);

    return form;
}

function createDropdown(options, selectedValue, onChange) {
    const dropdown = document.createElement('select');
    dropdown.classList.add('dropdown');
    
    // Add a default "Select" option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select';
    defaultOption.disabled = true;
    dropdown.appendChild(defaultOption);

    // Populate options
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.toLowerCase();
        opt.textContent = option;
        if (option.toLowerCase() === selectedValue.toLowerCase()) {
            opt.selected = true;
        }
        dropdown.appendChild(opt);
    });

    dropdown.addEventListener('change', (event) => {
        onChange(event.target.value);
    });

    return dropdown;
}

function createToggleSwitch(initialValue, onChange) {
    const toggleSwitch = document.createElement('input');
    toggleSwitch.type = 'checkbox';
    toggleSwitch.classList.add('toggle-switch');
    toggleSwitch.checked = initialValue;
    toggleSwitch.addEventListener('change', (event) => {
        onChange(event.target.checked);
    });
    return toggleSwitch;
}


async function handleSettingUpdate(settingType, value) {
    try {
        await apiFetch(`/settings/setting/${settingType}`, 'PUT', JSON.stringify({ value }), {
            headers: { 'Content-Type': 'application/json' },
        });
        alert(`Setting "${settingType}" updated successfully!`);
    } catch (error) {
        console.error(`Error updating setting "${settingType}":`, error);
        alert(`Failed to update setting "${settingType}".`);
    }
}

export { displaySettings };
