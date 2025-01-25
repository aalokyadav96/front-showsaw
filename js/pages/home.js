import ZoomBox from "../components/ui/ZoomBox.mjs";

function Home(isLoggedIn, content) {
  // Hero Section with Search Bar
  const heroSection = createHeroSection();
  content.appendChild(heroSection);

  // const images = [
  //   { src: 'https://pbs.twimg.com/media/GiCklS9XsAELt8E?format=jpg&name=large', alt: 'Image 1' },
  //   { src: 'https://pbs.twimg.com/media/Gh5tD6XaEAAwNYl?format=jpg&name=large', alt: 'Image 2' },
  //   { src: 'https://pbs.twimg.com/media/Gh_LKxEbcAABan_?format=jpg&name=large', alt: 'Image 2' },
  // ];

  const images = [
    'https://pbs.twimg.com/media/GiCklS9XsAELt8E?format=jpg&name=large',
    'https://pbs.twimg.com/media/Gh5tD6XaEAAwNYl?format=jpg&name=large',
    'https://pbs.twimg.com/media/Gh_LKxEbcAABan_?format=jpg&name=large',
  ];

  document.getElementById('open-zoombox').addEventListener('click', () => {
    // ZoomBox(images, 0); // Open zoombox with the first image
    ZoomBox(images, 0, { theme: 'dark', metadata: ['Image 1 Description', 'Image 2 Description', 'Image 3 Description'] });
 // Open zoombox with the first image
  });
  
  // Personalized Recommendations
  const recommendations = createRecommendationsSection();
  content.appendChild(recommendations);

  // Category Tabs
  const tabs = [
    { label: 'Food', contentLoader: loadFoodContent },
    { label: 'Shopping', contentLoader: loadShoppingContent },
    { label: 'Services', contentLoader: loadServicesContent },
    { label: 'Entertainment', contentLoader: loadEntertainmentContent },
    { label: 'Healthcare', contentLoader: loadHealthcareContent },
  ];
  content.appendChild(createTabbedInterface(tabs));
}

// Create the Hero Section
function createHeroSection() {
  
  const hero = document.createElement('div');
  hero.className = 'hero-section  tab-container';
  hero.innerHTML = `
  <button id="open-zoombox">Open ZoomBox</button>
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

// Create Tabbed Interface for Categories
function createTabbedInterface(tabs) {
  const container = document.createElement('div');
  container.className = 'tab-container';

  const tabList = document.createElement('ul');
  tabList.className = 'tab-buttons';

  const contentContainer = document.createElement('div');
  contentContainer.className = 'tabcontent';

  tabs.forEach(({ label, contentLoader }, index) => {
    const tab = document.createElement('li');
    tab.className = 'tab-button';
    tab.textContent = label;
    tab.dataset.index = index;

    tab.addEventListener('click', async () => {
      Array.from(tabList.children).forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      contentContainer.innerHTML = '';
      const content = await contentLoader();
      contentContainer.appendChild(content);
    });

    if (index === 0) {
      tab.classList.add('active');
      contentLoader().then((content) => {
        contentContainer.appendChild(content);
      });
    }

    tabList.appendChild(tab);
  });

  container.appendChild(tabList);
  container.appendChild(contentContainer);

  return container;
}

// Category-specific content loaders remain the same
async function loadFoodContent() {
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="grid">
      <div class="card"><h3>Restaurants</h3><p>Explore nearby dining options</p></div>
      <div class="card"><h3>Cafes</h3><p>Relax with a coffee</p></div>
      <div class="card"><h3>Bars</h3><p>Enjoy nightlife</p></div>
    </div>`;
  return div;
}

async function loadShoppingContent() {
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="grid">
      <div class="card"><h3>Grocery Stores</h3><p>Shop for daily essentials</p></div>
      <div class="card"><h3>Malls</h3><p>Find everything in one place</p></div>
    </div>`;
  return div;
}

async function loadServicesContent() {
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="grid">
      <div class="card"><h3>Salons</h3><p>Look your best</p></div>
      <div class="card"><h3>Repair Services</h3><p>Fix what’s broken</p></div>
    </div>`;
  return div;
}

async function loadEntertainmentContent() {
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="grid">
      <div class="card"><h3>Movie Theaters</h3><p>Catch the latest movies</p></div>
      <div class="card"><h3>Parks</h3><p>Enjoy the outdoors</p></div>
    </div>`;
  return div;
}

async function loadHealthcareContent() {
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="grid">
      <div class="card"><h3>Hospitals</h3><p>Healthcare nearby</p></div>
      <div class="card"><h3>Pharmacies</h3><p>Medicine and more</p></div>
    </div>`;
  return div;
}

export { Home };


// <div class="d3 " style="width:100%; ">
//              <input name="text" class="search-field" placeholder="Finds anything">
//              <label class="search-btn">
//                <input type="submit" style="display:none">
//                <svg class="srchicon" viewBox="0 0 24 24" width="100%" height="100%" role="img" stroke="#000000">
//                    <circle cx="11" cy="11" r="8"></circle>
//                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                </svg>
//              </label>
//              </div>

// .search-btn {
//   height: 4rem;
//   width: 4rem;
//   padding: 0.3rem 0.6rem;
//   background-color: #ffffff00;
//   border: none;
//   outline: none;
//   border-radius: 0 6px 6px 0;
//   display: flex;
//   border-left: 1px solid #f3f3f3;
//   align-items: center;
// }
// .search-field {
//   border: 0px;
//   outline: none;
//   padding: 0rem 0.8rem;
//   background: transparent;
//   height: 4rem;
//   color: #000;
//   font-size: 1.5rem;
//   width: 100%;
// }
// .d3 {
//   display: flex;
//   background: #ffffff;
//    border: 2px solid #797979; 
//   align-items: center;
//   border-radius: 6px;
//   box-shadow: rgb(0 0 0 / 20%) 0 2px 12px 0;
// }
// .homeform {
//   max-width: 600px;
//   width: 100%;
//   margin: 0;/*
//   padding: 10px;
//   background: #fff;
//   border-radius: 5px;*/
// }
 
// .srchicon {
//   stroke-width: 1.4;
//   border-radius: 5px;
//   width: 3rem;
//   height: 2.5rem;
//   fill: none;
//   stroke: #4f4f4f;
//   box-shadow: none;
//   display: block;
//   stroke-linecap: round;
//   stroke-linejoin: round;
// }