import { createCommonCropForm } from "./createOrEditCrop.js";
import { apiFetch } from "../../../api/api.js";

export async function editCrop(farmName, crop, container) {
    const form = createCommonCropForm({
        crop,
        currentFarmName: farmName,
        isEdit: true,
        onSubmit: async (formData, submitBtn) => {
            submitBtn.disabled = true;
            try {
                const res = await apiFetch(`/farms/${farmName}/crops/${crop.id}`, "PUT", formData);
                container.textContent = "✅ Crop updated successfully.";
            } catch (err) {
                container.textContent = `❌ ${err.message}`;
            } finally {
                submitBtn.disabled = false;
            }
        }
    });

    container.appendChild(form);
    return container;
}

// import { createCommonCropForm } from "./createOrEditCrop.js";
// import { apiFetch } from "../../../api/api.js";

// // export default function editCropPage({ farmName, crop }) {
// export async function editCrop({ isLoggedIn, farmName, crop, container }) {
//     const form = createCommonCropForm({
//         crop,
//         currentFarmName: farmName,
//         isEdit: true,
//         onSubmit: async (formData, submitBtn) => {
//             submitBtn.disabled = true;
//             try {
//                 const res = await apiFetch(`/farms/${farmName}/crops/${crop.name}`, {
//                     method: "PUT",
//                     body: formData
//                 });
//                 container.textContent = "✅ Crop updated successfully.";
//             } catch (err) {
//                 container.textContent = `❌ ${err.message}`;
//             } finally {
//                 submitBtn.disabled = false;
//             }
//         }
//     });

//     container.appendChild(form);
//     return container;
// }
