const sidebar = (() => {
    const sidebarElement = document.createElement('div');
    sidebarElement.id = 'mySidenav';
    sidebarElement.className = 'sidenav';

    // Close button
    const closeBtn = document.createElement('a');
    closeBtn.href = 'javascript:void(0)';
    closeBtn.className = 'closebtn';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeNav);
    sidebarElement.appendChild(closeBtn);

    // Helper function to create a list item
    const createSidebarItem = (href, label) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        return a;
    };

    // Sidebar items
    const sidebarItems = [
        { href: '/profile', label: 'Profile' },
        { href: '/feed', label: 'Feed' },
        { href: '/search', label: 'Search' },
        { href: '/settings', label: 'Settings' }
    ];

    // Create and append list items
    sidebarItems.forEach(item => sidebarElement.appendChild(createSidebarItem(item.href, item.label)));

    // Append to the body
    document.body.appendChild(sidebarElement);

    // Create the aside content container
    const aside = document.getElementById('aside') || document.createElement('div');
    aside.id = 'aside';
    if (!aside.parentNode) {
        document.body.appendChild(aside);
    }

    // Open the sidebar
    function openNav() {
        sidebarElement.style.width = '250px';
        aside.style.marginLeft = '250px';
    }

    // Close the sidebar
    function closeNav() {
        sidebarElement.style.width = '0';
        aside.style.marginLeft = '0';
    }

    // Add a button to open the sidebar
    const openButton = document.createElement('span');
    openButton.style.fontSize = '30px';
    openButton.style.cursor = 'pointer';
    openButton.innerHTML = '&#9776; open';
    openButton.addEventListener('click', openNav);
    aside.insertBefore(openButton, aside.firstChild);

    return sidebarElement;
})();

export { sidebar };
