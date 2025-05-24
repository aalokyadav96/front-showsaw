export function NewHome(isLoggedIn, container) {
    // Clear existing content
    container.innerHTML = '';
  
    // Root wrapper
    const root = document.createElement('div');
    root.className = 'new-home';
  
    // 1. Weather Alert Banner
    const alertBanner = document.createElement('div');
    alertBanner.className = 'weather-alert';
    alertBanner.setAttribute('data-type', 'sandstorm');
    alertBanner.textContent = '⚠️ Sandstorm approaching within 3 hours.';
    root.appendChild(alertBanner);
  
    // 2. Authority Advisory
    const advisory = document.createElement('div');
    advisory.className = 'advisory';
    const advisoryHeader = document.createElement('h2');
    advisoryHeader.textContent = '🔔 Latest Advisory';
    const advisoryContent = document.createElement('p');
    advisoryContent.textContent = 'Local authorities advise minimizing outdoor activities until further notice.';
    advisory.appendChild(advisoryHeader);
    advisory.appendChild(advisoryContent);
    root.appendChild(advisory);
  
    // 3. Quick Glance Cards
    const cardsSection = document.createElement('div');
    cardsSection.className = 'quick-glance';
  
    const cards = [
      {
        title: 'Air Quality',
        status: 'Unhealthy (PM2.5: 182)',
        icon: '🌫️'
      },
      {
        title: 'UV Index',
        status: 'Extreme (11+)',
        icon: '☀️'
      },
      {
        title: 'Visibility',
        status: 'Low (400m)',
        icon: '👁️'
      }
    ];
  
    cards.forEach(data => {
      const card = document.createElement('div');
      card.className = 'glance-card';
  
      const icon = document.createElement('div');
      icon.className = 'icon';
      icon.textContent = data.icon;
  
      const title = document.createElement('h3');
      title.textContent = data.title;
  
      const status = document.createElement('p');
      status.textContent = data.status;
  
      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(status);
      cardsSection.appendChild(card);
    });
  
    root.appendChild(cardsSection);
  
    // 4. Conditional Content for Logged In Users
    if (isLoggedIn) {
      const userNote = document.createElement('div');
      userNote.className = 'user-note';
      userNote.textContent = '✅ You are subscribed to real-time alerts.';
      root.appendChild(userNote);
    }
  
    // Inject into container
    container.appendChild(root);
  }
  