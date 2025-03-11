const TRANSLATIONS_CACHE = {}; // In-memory cache
const FALLBACK_LANG = "en"; // Default language
const SUPPORTED_LANGUAGES = ["en", "fr", "es", "hi"]; // Example supported languages
const TRANSLATION_EXPIRY_DAYS = 30; // One month cache expiration

/** =================== INDEXEDDB HELPERS =================== **/
const DB_NAME = "translationsDB";
const STORE_NAME = "translations";
const DB_VERSION = 1;

// Open IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "lang" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Get translation from IndexedDB
async function getStoredTranslations(lang) {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(lang);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
    });
}

// Store translations in IndexedDB
async function storeTranslations(lang, translations) {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put({ lang, translations, timestamp: Date.now() });
        tx.oncomplete = () => resolve();
    });
}

/** =================== LOAD TRANSLATIONS =================== **/
async function loadTranslations(lang) {
    if (TRANSLATIONS_CACHE[lang]) return TRANSLATIONS_CACHE[lang]; // Use in-memory cache

    const storedData = await getStoredTranslations(lang);
    if (storedData) {
        const lastUpdated = storedData.timestamp;
        const now = Date.now();
        const daysPassed = (now - lastUpdated) / (1000 * 60 * 60 * 24);
        
        if (daysPassed < TRANSLATION_EXPIRY_DAYS) {
            TRANSLATIONS_CACHE[lang] = storedData.translations; // Cache it in memory
            return storedData.translations;
        }
    }

    // Fetch new translations from server
    try {
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) throw new Error("Translation file not found");

        const translations = await response.json();
        TRANSLATIONS_CACHE[lang] = translations;
        await storeTranslations(lang, translations); // Save in IndexedDB
        return translations;
    } catch (error) {
        console.warn(`⚠️ Failed to load ${lang} translations, falling back to ${FALLBACK_LANG}`);
        return loadTranslations(FALLBACK_LANG);
    }
}

/** =================== LANGUAGE DETECTION & SWITCHING =================== **/
function detectLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    let lang = localStorage.getItem("lang") || urlParams.get("lang") || navigator.language.split("-")[0]; // LocalStorage > URL > Browser
    return SUPPORTED_LANGUAGES.includes(lang) ? lang : FALLBACK_LANG;
}

async function setLanguage(lang) {
    localStorage.setItem("lang", lang); // Store in LocalStorage
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState(null, "", url.toString()); // Update URL without reload
    await applyTranslations(lang);
}

/** =================== APPLY TRANSLATIONS =================== **/
async function applyTranslations(lang) {
    const translations = await loadTranslations(lang);

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.innerText = translations[key] || key;
    });

    document.querySelectorAll("[data-i18n-date]").forEach(el => {
        const date = new Date(el.getAttribute("data-i18n-date"));
        el.innerText = new Intl.DateTimeFormat(lang).format(date);
    });

    document.querySelectorAll("[data-i18n-number]").forEach(el => {
        const number = parseFloat(el.getAttribute("data-i18n-number"));
        el.innerText = new Intl.NumberFormat(lang).format(number);
    });

    document.querySelectorAll("[data-i18n-currency]").forEach(el => {
        const amount = parseFloat(el.getAttribute("data-i18n-currency"));
        el.innerText = new Intl.NumberFormat(lang, { style: "currency", currency: "USD" }).format(amount);
    });
}

/** =================== REAL-TIME TRANSLATION SYNC =================== **/
async function startTranslationSync() {
    setInterval(async () => {
        const lang = detectLanguage();
        await loadTranslations(lang); // Only loads if 30 days have passed
    }, TRANSLATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000); // Check every 30 days
}

/** =================== SPA LANGUAGE SWITCHING =================== **/
document.addEventListener("DOMContentLoaded", async () => {
    const lang = detectLanguage();
    await applyTranslations(lang);
    startTranslationSync();

    document.querySelectorAll("[data-lang-switch]").forEach(button => {
        button.addEventListener("click", async (event) => {
            const selectedLang = event.target.getAttribute("data-lang-switch");
            if (selectedLang) {
                await setLanguage(selectedLang);
            }
        });
    });
});

export { detectLanguage, applyTranslations, setLanguage };
