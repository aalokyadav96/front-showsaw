import "../../css/home.css";
async function Home(isLoggedIn, content) {
  // Hero Section with Search Bar
  const heroSection = createHeroSection();
  content.appendChild(heroSection);

  
  // Personalized Recommendations
  const recommendations = createRecommendationsSection();
  content.appendChild(recommendations);
}

// Create the Hero Section
function createHeroSection() {
  
  const hero = document.createElement('div');
  hero.className = 'hero-section  tab-container';
  hero.innerHTML = `
    <div class="hero-content">
      <h1>Discover Amazing Events and Places Nearby</h1>
      <p>Find food, fun, and more, all in one place.</p>
      <div class="search-bar">
        <input type="text" placeholder="Search events or places..." />
        <button>Search</button>
      </div>
    </div>
  `;
  return hero;
}

// Create Personalized Recommendations Section
function createRecommendationsSection() {
  const recommendations = document.createElement('div');
  recommendations.className = 'recsec tab-container';
  recommendations.innerHTML = `
    <h2>Recommended for You</h2>
    <div class="grid">
      <div class="card"><h3>Popular Event</h3><p>Join the biggest events in town.</p></div>
      <div class="card"><h3>New Cafe</h3><p>Try out the latest coffee spots.</p></div>
      <div class="card"><h3>Top Park</h3><p>Relax and unwind in nature.</p></div>
    </div>
  `;
  return recommendations;
}

export { Home };