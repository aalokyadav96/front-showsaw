import ToggleSwitch from "../../components/ui/ToggleSwitch.mjs";

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

export { createContainer, createLoadingIndicator, createErrorContainer, createSettingForm };
