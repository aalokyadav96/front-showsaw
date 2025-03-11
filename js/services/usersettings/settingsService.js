import "../../../css/settingspage.css";
import { apiFetch } from "../../api/api.js";
import ToggleSwitch from "../../components/ui/ToggleSwitch.mjs";
import { navigate } from "../../routes/index.js";

function Dropdown(options, onChange, selectedValue) {
    const select = document.createElement("select");

    options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option.toLowerCase();
        opt.textContent = option;
        
        // Ensure the selected value is correctly reflected
        if (opt.value === selectedValue?.toLowerCase()) {
            opt.selected = true;
        }
        
        select.appendChild(opt);
    });

    select.addEventListener("change", () => {
        onChange(select.value);
    });

    return select;
}


async function loadSettings() {
    try {
        const settings = await apiFetch("/settings/all");

        if (!Array.isArray(settings) || settings.length === 0) {
            return getDefaultSettings();
        }

        return settings;
    } catch (error) {
        console.error("Error fetching settings:", error);
        return getDefaultSettings();
    }
}

// Default settings if API fails or returns empty
function getDefaultSettings() {
    return [
        { type: "theme", value: "light", description: "Choose theme mode" },
        { type: "notifications", value: true, description: "Enable notifications" },
        { type: "privacy_mode", value: false, description: "Enable privacy mode" },
        { type: "auto_logout", value: false, description: "Enable auto logout" },
        { type: "language", value: "english", description: "Select language" },
        { type: "time_zone", value: "UTC", description: "Select time zone" },
        { type: "daily_reminder", value: "09:00", description: "Set daily reminder" },
    ];
}

async function displaySettings(isLoggedIn, settingsSec) {
    if (!isLoggedIn) {
        navigate("/login");
        return
    }
    const settingsContainer = createContainer();
    settingsSec.innerHTML = ""; // Clear previous content
    settingsSec.appendChild(settingsContainer);

    const loadingIndicator = createLoadingIndicator();
    const errorContainer = createErrorContainer();

    settingsContainer.appendChild(loadingIndicator);
    settingsContainer.appendChild(errorContainer);

    try {
        const settings = await loadSettings();
        settingsContainer.innerHTML = ""; // Clear loading message

        settings.forEach((setting) => {
            settingsContainer.appendChild(createSettingForm(setting));
        });
    } catch (error) {
        console.error("Error loading settings:", error);
        errorContainer.textContent = `Failed to load settings: ${error.message}`;
    } finally {
        loadingIndicator.style.display = "none";
    }
}

// UI Creation Functions
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

function createSettingForm(setting) {
    const form = document.createElement("div");
    form.className = "setting-form";
    form.dataset.type = setting.type;

    const heading = document.createElement("h3");
    heading.textContent = setting.description;

    let inputElement;

    switch (setting.type) {
        case "theme":
            inputElement = Dropdown(
                ["Light", "Dark"],
                (selectedOption) => handleSettingUpdate(setting.type, selectedOption.toLowerCase()),
                setting.value // Use stored value
            );
            break;

        case "notifications":
        case "privacy_mode":
        case "auto_logout":
            inputElement = ToggleSwitch((state) => handleSettingUpdate(setting.type, state));
            inputElement.querySelector("input").checked = !!setting.value; // Ensure it's a boolean
            break;

        case "language":
            inputElement = Dropdown(
                ["English", "Spanish", "French"],
                (selectedOption) => handleSettingUpdate(setting.type, selectedOption.toLowerCase()),
                setting.value
            );
            break;

        case "time_zone":
            inputElement = Dropdown(
                ["UTC", "PST", "EST"],
                (selectedOption) => handleSettingUpdate(setting.type, selectedOption.toLowerCase()),
                setting.value
            );
            break;

        case "daily_reminder":
            inputElement = document.createElement("input");
            inputElement.type = "time";
            inputElement.value = setting.value || "";
            inputElement.addEventListener("change", () => {
                handleSettingUpdate(setting.type, inputElement.value);
            });
            break;

        default:
            inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.value = setting.value || "";
            inputElement.addEventListener("blur", () => {
                handleSettingUpdate(setting.type, inputElement.value);
            });
            console.warn(`Unsupported setting type: ${setting.type}`);
            break;
    }

    form.appendChild(heading);
    form.appendChild(inputElement);

    return form;
}

async function handleSettingUpdate(settingType, value) {
    try {
        const response = await apiFetch(`/settings/setting/${settingType}`, "PUT", JSON.stringify({ value }), {
            headers: { "Content-Type": "application/json" },
        });

        if (!response || response.status !== "success") {
            throw new Error("Failed to update setting");
        }

        alert(`Setting "${settingType}" updated successfully!`);
    } catch (error) {
        console.error(`Error updating setting "${settingType}":`, error);
        alert(`Failed to update setting "${settingType}".`);
    }
}


export { displaySettings };
