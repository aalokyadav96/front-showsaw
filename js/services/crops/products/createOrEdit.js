import { apiFetch } from "../../../api/api.js";
import { createElement } from "../../../components/createElement.js";
import { createFormGroup } from "../../../components/createFormGroup.js";
import { createFileInputGroup } from "../../../components/createFileInputGroup.js";
import Button from "../../../components/base/Button.js";

/**
 * Renders a create/edit form for products or tools.
 */
export function renderItemForm(container, mode, itemData, type, onDone) {
  container.replaceChildren();

  const form = createElement("form", { class: "create-section" });

  const nameGroup = createFormGroup({
    label: "Name",
    inputType: "text",
    inputId: "name",
    inputValue: itemData?.name || "",
    placeholder: "Enter item name",
    isRequired: true
  });

  let categoryGroup;

  if (type === "product") {
    categoryGroup = createFormGroup({
      label: "Category",
      inputType: "select",
      inputId: "category",
      inputValue: itemData?.category || "",
      isRequired: true,
      options: [
        { value: "", label: "Select category" },
        { value: "Spices", label: "Spices" },
        { value: "Pickles", label: "Pickles" },
        { value: "Flour", label: "Flour" },
        { value: "Oils", label: "Oils" },
        { value: "Honey", label: "Honey" },
        { value: "Tea & Coffee", label: "Tea & Coffee" },
        { value: "Dry Fruits", label: "Dry Fruits" },
        { value: "Natural Sweeteners", label: "Natural Sweeteners" }
      ]
    });
  } else if (type === "tool") {
    categoryGroup = createFormGroup({
      label: "Category",
      inputType: "select",
      inputId: "category",
      inputValue: itemData?.category || "",
      isRequired: true,
      options: [
        { value: "", label: "Select category" },
        { value: "Cutting", label: "Cutting" },
        { value: "Irrigation", label: "Irrigation" },
        { value: "Harvesting", label: "Harvesting" },
        { value: "Hand Tools", label: "Hand Tools" },
        { value: "Protective Gear", label: "Protective Gear" },
        { value: "Fertilizer Applicators", label: "Fertilizer Applicators" }
      ]
    });
  } else {
    categoryGroup = createFormGroup({
      label: "Category",
      inputType: "text",
      inputId: "category",
      inputValue: itemData?.category || "",
      placeholder: "e.g., Fruit, Tool",
      isRequired: true
    });
  }

  // const categoryGroup = createFormGroup({
  //   label: "Category",
  //   inputType: "select",
  //   inputId: "category",
  //   inputValue: itemData?.category || "",
  //   isRequired: true,
  //   options: [
  //     { value: "", label: "Select category" },
  //     { value: "Spices", label: "Spices" },
  //     { value: "Pickles", label: "Pickles" },
  //     { value: "Flour", label: "Flour" },
  //     { value: "Oils", label: "Oils" },
  //     { value: "Honey", label: "Honey" },
  //     { value: "Tea & Coffee", label: "Tea & Coffee" },
  //     { value: "Dry Fruits", label: "Dry Fruits" },
  //     { value: "Natural Sweeteners", label: "Natural Sweeteners" }
  //   ]
  // });


  const priceGroup = createFormGroup({
    label: "Price (₹)",
    inputType: "number",
    inputId: "price",
    inputValue: itemData?.price ?? "",
    placeholder: "e.g., 49.99",
    isRequired: true,
    additionalProps: { step: "0.01", min: "0" }
  });

  const quantityGroup = createFormGroup({
    label: "Quantity",
    inputType: "number",
    inputId: "quantity",
    inputValue: itemData?.quantity ?? "",
    placeholder: "e.g., 100",
    isRequired: true,
    additionalProps: { min: "0" }
  });

  const unitGroup = createFormGroup({
    label: "Unit",
    inputType: "select",
    inputId: "unit",
    inputValue: itemData?.unit || "",
    isRequired: true,
    options: [
      { value: "", label: "Select unit" },
      { value: "kg", label: "kg" },
      { value: "litre", label: "litre" },
      { value: "units", label: "units" }
    ]
  });

  const skuGroup = createFormGroup({
    label: "SKU / Code",
    inputType: "text",
    inputId: "sku",
    inputValue: itemData?.sku || "",
    placeholder: "Optional code"
  });

  const availableFromGroup = createFormGroup({
    label: "Available From",
    inputType: "date",
    inputId: "availableFrom",
    inputValue: itemData?.availableFrom?.slice(0, 10) || ""
  });

  const availableToGroup = createFormGroup({
    label: "Available To",
    inputType: "date",
    inputId: "availableTo",
    inputValue: itemData?.availableTo?.slice(0, 10) || ""
  });

  const descriptionGroup = createFormGroup({
    label: "Description",
    inputType: "textarea",
    inputId: "description",
    inputValue: itemData?.description || "",
    placeholder: "Detailed info",
    isRequired: true
  });

  const imageGroup = createFileInputGroup({
    label: "Upload Images",
    inputId: "images",
    isRequired: mode === "create",
    multiple: true
  });

  const featuredGroup = createFormGroup({
    label: "Featured?",
    inputType: "checkbox",
    inputId: "featured",
    inputValue: "",
    additionalProps: {
      checked: itemData?.featured || false
    }
  });

  form.append(
    nameGroup,
    categoryGroup,
    priceGroup,
    quantityGroup,
    unitGroup,
    skuGroup,
    availableFromGroup,
    availableToGroup,
    descriptionGroup,
    imageGroup,
    featuredGroup
  );

  const submitBtn = Button(
    mode === "create" ? `Create ${type}` : `Update ${type}`,
    `submit-${type}-btn`,
    {},
    "primary-button"
  );

  const cancelBtn = Button(
    "Cancel",
    `cancel-${type}-btn`,
    { click: () => onDone() },
    "secondary-button"
  );

  const actions = createElement("div", { class: "form-actions" }, [
    submitBtn,
    cancelBtn
  ]);
  form.appendChild(actions);

  if (mode === "edit" && itemData?.id) {
    const deleteBtn = Button(
      `Delete ${type}`,
      `delete-${type}-btn`,
      {
        click: async () => {
          if (!confirm(`Delete this ${type}?`)) return;
          try {
            await apiFetch(`/farm/${type}/${itemData.id}`, "DELETE");
            onDone();
          } catch (err) {
            alert("Delete failed");
            console.error(err);
          }
        }
      },
      "danger-button"
    );
    form.appendChild(deleteBtn);
  }

  // Submit logic using FormData
  form.onsubmit = async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;

    const formData = new FormData();
    formData.append("name", form.name.value.trim());
    formData.append("category", form.category.value.trim());
    formData.append("price", form.price.value);
    formData.append("quantity", form.quantity.value);
    formData.append("unit", form.unit.value);
    formData.append("sku", form.sku.value.trim());
    formData.append("availableFrom", form.availableFrom.value);
    formData.append("availableTo", form.availableTo.value);
    formData.append("description", form.description.value.trim());
    formData.append("featured", form.featured.checked);

    const fileInput = form.querySelector("#images");
    for (const file of fileInput.files) {
      formData.append("images", file);
    }

    const url =
      mode === "create"
        ? `/farm/${type}`
        : `/farm/${type}/${itemData.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await apiFetch(url, method, formData);

      if (!res.id) throw new Error("Request failed");
      onDone();
    } catch (err) {
      alert(`${mode === "create" ? "Create" : "Update"} failed`);
      console.error(err);
    } finally {
      submitBtn.disabled = false;
    }
  };

  container.appendChild(form);
}
