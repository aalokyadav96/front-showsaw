
export function displaySports(contentContainer, isLoggedIn) {
    const app = contentContainer;
    app.style.display = "flex";
    // Sidebar
    const sidebar = document.createElement("div");
    sidebar.className = "sidebar";
    ["⚽", "🏀", "🏈", "⚾", "🏐", "🎾", "🏉", "🎱", "🏓", "🥅", "🏸", "🏒", "🥊", "🏏", "🛹", "⛳", "🧗", "📄", "⚙️", "🔍"].forEach((icon, idx) => {
        const btn = document.createElement("button");
        btn.innerHTML = icon;
        if (idx === 0) btn.classList.add("active");
        btn.onclick = () => {
            document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        };
        sidebar.appendChild(btn);
    });

    app.appendChild(sidebar);

    // Main container
    const main = document.createElement("div");
    main.className = "main";
    app.appendChild(main);

    // Header
    const header = document.createElement("div");
    header.className = "header";

    const title = document.createElement("h1");
    title.textContent = "SPORTS";

    const filters = document.createElement("div");
    filters.className = "filters";

    const dropdown = document.createElement("select");
    ["All Sports", "Football", "Basketball", "Tennis"].forEach(sport => {
        const option = document.createElement("option");
        option.textContent = sport;
        dropdown.appendChild(option);
    });

    const darkToggle = document.createElement("button");
    darkToggle.className = "dark-toggle";
    darkToggle.textContent = "🌙";
    darkToggle.onclick = () => {
        document.body.classList.toggle("dark");
    };

    filters.appendChild(dropdown);
    filters.appendChild(darkToggle);

    header.appendChild(title);
    header.appendChild(filters);
    main.appendChild(header);

    // Sections generator
    function createSection(title) {
        const section = document.createElement("div");
        section.className = "section";
        const heading = document.createElement("h2");
        heading.textContent = title;
        section.appendChild(heading);
        return section;
    }

    function createCard(content, isLive = false) {
        const card = document.createElement("div");
        card.className = "card";
        if (isLive) card.classList.add("live");
        card.innerHTML = content;
        return card;
    }

    // Currently Happening
    const currentSection = createSection("Currently Happening");
    const currentCards = document.createElement("div");
    currentCards.className = "cards";

    currentCards.appendChild(createCard(`
  <strong>⚽ LIV</strong> <br>
  Liverpool 1—3 <br>
  Manchester City 3
`, true));

    currentCards.appendChild(createCard(`
  <strong>🏀 MFK</strong> <br>
  Milwaukee Bucks <br>
  Chicago Bulls
`, true));

    currentCards.appendChild(createCard(`
  <strong>🎾 IGA 1—0</strong> <br>
  Iga Swiatek 0 <br>
  Aryna Sabalenka 1
`));

    currentCards.appendChild(createCard(`
  <strong>🏒 BOT</strong> <br>
  Boston Bruins 0—2 <br>
  Toronto Leafs 0—2
`, true));

    currentSection.appendChild(currentCards);
    main.appendChild(currentSection);

    // Ongoing Tournaments
    const tournamentsSection = createSection("Ongoing Tournaments");
    const tournamentCards = document.createElement("div");
    tournamentCards.className = "cards";

    [
        { name: "NBA", date: "Oct 24, 2023 – Apr 14, 2024" },
        { name: "Indian Wells", date: "Mar 6 – Mar 17, 2024" },
        { name: "Augico Series", date: "Aug 11, 2023 – May 19, 2024" },
        { name: "La Liga", date: "Aug 11 – May 26, 2024" },
        { name: "IIHF World Championship", date: "May 10 – May 26, 2024" },
        { name: "Premier League", date: "Aug 11, 2023 – May 19, 2024" },
        { name: "ATP Finals", date: "Nov 10 – Nov 17, 2024" }
    ].forEach(t => {
        tournamentCards.appendChild(createCard(`
    <strong>${t.name}</strong><br>
    <div class="tournament-info">${t.date}</div>
  `));
    });

    tournamentsSection.appendChild(tournamentCards);
    main.appendChild(tournamentsSection);

    // Upcoming Matches
    const upcomingSection = createSection("Upcoming Matches");
    const upcomingList = document.createElement("div");
    upcomingList.className = "upcoming-matches";

    [
        { team: "Apriet Mmaqua", date: "April 28, 2024 19:30" },
        { team: "Golden State Warriors", date: "April 28, 2024 15:00" },
        { team: "Atalanta", date: "April 28, 2024 19:00" },
        { team: "Carios Alcaraz", date: "April 28, 2024 19:00" },
        { team: "Real Madrid", date: "April 28, 2024" },
        { team: "Stefanos Tsitsipas", date: "April 28, 2024 20:00" }
    ].forEach(m => {
        const match = document.createElement("div");
        match.className = "match";
        match.innerHTML = `<span>${m.team}</span><span>${m.date}</span>`;
        upcomingList.appendChild(match);
    });

    upcomingSection.appendChild(upcomingList);
    main.appendChild(upcomingSection);

}