import { detectLanguage, applyTranslations } from "../i18n.js";


async function renderPageContent(isLoggedIn, path, contentContainer) {
    if (!path || typeof path !== "string") {
        console.error("Invalid path:", path);
        contentContainer.innerHTML = `<h1>404 Not Found</h1>`;
        return;
    }

    // Route Handlers (Static Routes)
    const routeHandlers = {
        "/": async () => {
            const { Entry } = await import("../pages/entry/entry.js");
            contentContainer.innerHTML = ""; // Clear previous page content
            Entry(isLoggedIn, contentContainer);
        },
        "/home": async () => {
            const { Home } = await import("../pages/home.js");
            contentContainer.innerHTML = ""; // Clear previous page content
            Home(isLoggedIn, contentContainer);
        },
        "/login": async () => {
            const { Auth } = await import("../pages/auth/auth.js");
            contentContainer.innerHTML = "";
            Auth(isLoggedIn, contentContainer);
        },
        "/chats": async () => {
            const { Chats } = await import("../pages/userchat/chats.js");
            contentContainer.innerHTML = "";
            Chats(isLoggedIn, contentContainer);
        },
        "/livechat": async () => {
            const { LiveChats } = await import("../pages/livechat/chats.js");
            contentContainer.innerHTML = "";
            LiveChats(isLoggedIn, contentContainer);
        },
        "/forums": async () => {
            const { Chat } = await import("../pages/forum/chat.js");
            contentContainer.innerHTML = "";
            Chat(isLoggedIn, contentContainer);
        },
        "/create-event": async () => {
            const { Create } = await import("../pages/events/createEvent.js");
            contentContainer.innerHTML = "";
            Create(isLoggedIn, contentContainer);
        },
        "/create-place": async () => {
            const { CreatePlace } = await import("../pages/places/createPlace.js");
            contentContainer.innerHTML = "";
            CreatePlace(isLoggedIn, contentContainer);
        },
        "/profile": async () => {
            const { MyProfile } = await import("../pages/profile/userProfile.js");
            contentContainer.innerHTML = "";
            MyProfile(isLoggedIn, contentContainer);
        },
        "/events": async () => {
            const { Events } = await import("../pages/events/events.js");
            contentContainer.innerHTML = "";
            Events(isLoggedIn, contentContainer);
        },
        "/artists": async () => {
            const { Artists } = await import("../pages/artist/artists.js");
            contentContainer.innerHTML = "";
            Artists(isLoggedIn, contentContainer);
        },
        "/places": async () => {
            const { Places } = await import("../pages/places/places.js");
            contentContainer.innerHTML = "";
            Places(isLoggedIn, contentContainer);
        },
        "/search": async () => {
            const { Search } = await import("../pages/search/search.js");
            contentContainer.innerHTML = "";
            Search(isLoggedIn, contentContainer);
        },
        "/settings": async () => {
            const { Settings } = await import("../pages/profile/settings.js");
            contentContainer.innerHTML = "";
            Settings(isLoggedIn, contentContainer);
        },
        "/feed": async () => {
            const { Feed } = await import("../pages/feed/feed.js");
            contentContainer.innerHTML = "";
            Feed(isLoggedIn, contentContainer);
        },
        "/create-artist": async () => {
            const { Create } = await import("../pages/artist/createArtist.js");
            contentContainer.innerHTML = "";
            Create(isLoggedIn, contentContainer);
        },
        "/create-itinerary": async () => {
            const { CreateItinerary } = await import("../pages/itinerary/createItinerary.js");
            contentContainer.innerHTML = "";
            CreateItinerary(isLoggedIn, contentContainer);
        },
        "/edit-itinerary": async () => {
            const { EditItinerary } = await import("../pages/itinerary/editItinerary.js");
            contentContainer.innerHTML = "";
            EditItinerary(isLoggedIn, contentContainer);
        },
        "/itinerary": async () => {
            const { Itinerary } = await import("../pages/itinerary/itinerary.js");
            contentContainer.innerHTML = "";
            Itinerary(isLoggedIn, contentContainer);
        },
    };

    // Dynamic Routes (Pattern Matching)
    const dynamicRoutes = [
        {
            pattern: /^\/user\/([\w-]+)$/,
            handler: async (matches) => {
                const { UserProfile } = await import("../pages/profile/userProfile.js");
                await UserProfile(isLoggedIn, contentContainer, matches[1]);
            },
        },
        {
            pattern: /^\/event\/([\w-]+)$/,
            handler: async (matches) => {
                const { Event } = await import("../pages/events/eventPage.js");
                try {
                    contentContainer.innerHTML = "";
                    Event(isLoggedIn, matches[1], contentContainer);
                } catch {
                    content.innerHTML = `<h1>Event Not Found</h1>`;
                }
            },
        },
        {
            pattern: /^\/event\/([\w-]+)\/tickets$/,
            handler: async (matches) => {
                const { EventTickets } = await import("../pages/events/eventTicketsPage.js");
                try {
                    contentContainer.innerHTML = "";
                    EventTickets(isLoggedIn, matches[1], contentContainer);
                } catch {
                    contentContainer.innerHTML = `<h1>Tickets Not Found</h1>`;
                }
            },
        },
        {
            pattern: /^\/artist\/([\w-]+)$/,
            handler: async (matches) => {
                const { Artist } = await import("../pages/artist/artistPage.js");
                try {
                    contentContainer.innerHTML = "";
                    Artist(isLoggedIn, matches[1], contentContainer);
                } catch {
                    content.innerHTML = `<h1>Artist Not Found</h1>`;
                }
            },
        },
        {
            pattern: /^\/merch\/([\w-]+)$/,
            handler: async (matches) => {
                const { Merch } = await import("../pages/merch/merch.js");
                try {
                    contentContainer.innerHTML = "";
                    Merch(isLoggedIn, matches[1], contentContainer);
                } catch {
                    content.innerHTML = `<h1>Merch Not Found</h1>`;
                }
            },
        },
        {
            pattern: /^\/chat\/([\w-]+)$/,
            handler: async (matches) => {
                const { Chat } = await import("../pages/userchat/chat.js");
                try {
                    contentContainer.innerHTML = "";
                    Chat(isLoggedIn, matches[1], contentContainer);
                } catch {
                    content.innerHTML = `<h1>Chat Not Found</h1>`;
                }
            },
        },
        {
            pattern: /^\/livechat\/([\w-]+)$/,
            handler: async (matches) => {
                const { LiveChat } = await import("../pages/livechat/chat.js");
                try {
                    contentContainer.innerHTML = "";
                    LiveChat(isLoggedIn, matches[1], contentContainer);
                } catch {
                    content.innerHTML = `<h1>Chat Not Found</h1>`;
                }
            },
        },
        {
            pattern: /^\/place\/([\w-]+)$/,
            handler: async (matches) => {
                const { Place } = await import("../pages/places/placePage.js");
                try {
                    Place(isLoggedIn, matches[1], content);
                } catch {
                    content.innerHTML = `<h1>Place Not Found</h1>`;
                }
            },
        },
        {
            pattern: /^\/post\/([\w-]+)$/,
            handler: async (matches) => {
                const { Post } = await import("../pages/feed/postDisplay.js");
                try {
                    Post(isLoggedIn, matches[1], content);
                } catch {
                    content.innerHTML = `<h1>Post Not Found</h1>`;
                }
            },
        },
        {
            pattern: /^\/itinerary\/([\w-]+)$/,
            handler: async (matches) => {
                const { Itinerary } = await import("../pages/itinerary/itineraryDisplay.js");
                try {
                    Itinerary(isLoggedIn, matches[1], content);
                } catch {
                    content.innerHTML = `<h1>Post Not Found</h1>`;
                }
            },
        },
        {
            pattern: /^\/hashtag\/([\w-]+)$/,
            handler: async (matches) => {
                const { Hashtag } = await import("../pages/hashtag/hashtagPage.js");
                try {
                    Hashtag(isLoggedIn, matches[1], content);
                } catch {
                    content.innerHTML = `<h1>Post Not Found</h1>`;
                }
            },
        },
    ];

    // Match static routes
    const handler = routeHandlers[path];
    if (handler) {
        await handler();
    } else {
        // Match dynamic routes
        for (const route of dynamicRoutes) {
            const matches = path.match(route.pattern);
            if (matches) {
                await route.handler(matches);
                return;
            }
        }
        // If no route matches, show 404
        content.innerHTML = `<h1>404 Not Found</h1>`;
    }

    // **🔹 Automatically apply translations**
    const lang = detectLanguage();
    await applyTranslations(lang);
}

export { renderPageContent };