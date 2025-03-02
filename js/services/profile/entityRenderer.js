/** Render fetched data inside the tab container. */
function renderEntityData(container, data, entityType) {
    container.innerHTML = ""; // Clear previous content
    if (!data || data.length === 0) {
        container.textContent = `No ${entityType} data found.`;
        return;
    }

console.log(entityType);

    const list = document.createElement("ul");
    data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.appendChild(createEntityLink(item, entityType));
        list.appendChild(listItem);
    });

    container.appendChild(list);
}

/** Create links for entities inside tabs. */
function createEntityLink(item, entityType) {
    const entityLink = document.createElement("a");

    switch (entityType) {
        case "place":
            entityLink.href = `/place/${item.entity_id}`;
            break;
        case "event":
            entityLink.href = `/event/${item.entity_id}`;
            break;
        case "feedpost":
            entityLink.href = `/post/${item.entity_id}`;
            break;
        default:
            entityLink.href = "#";
    }

    entityLink.textContent = `Post ID: ${item.entity_id} - Created At: ${new Date(
        item.created_at
    ).toLocaleString()}`;

    return entityLink;
}

export { renderEntityData };
