// Basis-URL der CoinGecko API
const apiBaseUrl = "https://api.coingecko.com/api/v3";

// DOM-Elemente aus dem HTML
const cryptoContainer = document.getElementById("crypto-container"); // Container für die Top-Coins
const cryptoSlider = document.getElementById("crypto-slider"); // Slider-Container für Logos
const coinRange = document.getElementById("coin-range"); // Dropdown für die Auswahl (Top 10, 25, 50)
const fetchButton = document.getElementById("fetch-button"); // Button zum Laden der Top-Coins
const popup = document.getElementById("coin-popup"); // Popup-Container
const popupClose = document.querySelector(".popup-close"); // Schliessen-Button des Popups
const coinDetails = document.getElementById("coin-details"); // Container für die Details eines Coins im Popup

// Variable für den Swiper (Slider)
let swiper;

// Funktion: Swiper-Instanz erstellen oder aktualisieren
let initializeSwiper = () => {
    if (!swiper) {
        // Erstellt eine neue Swiper-Instanz, falls keine existiert
        swiper = new Swiper('.swiper', {
            slidesPerView: 7, // Zeigt 7 Slides gleichzeitig an
            spaceBetween: 20, // Abstand zwischen den Slides
            loop: true, // Endlos-Schleife aktivieren
            autoplay: {
                delay: 3000, // Automatischer Wechsel alle 3 Sekunden
                disableOnInteraction: false, // Autoplay stoppt nicht bei Interaktion
            },
            speed: 800, // Geschwindigkeit der Animation
            centeredSlides: true, // Zentriert die aktiven Slides
        });
    } else {
        // Falls die Instanz existiert, wird sie aktualisiert
        swiper.update();
    }
};

// Event: Direkt beim Laden der Seite die Logos in den Slider laden
window.addEventListener("DOMContentLoaded", () => {
    loadSlideshow(); // Logos laden und im Slider anzeigen
});

// Event: Coins laden und anzeigen, wenn der Button "Anzeigen" geklickt wird
fetchButton.addEventListener("click", () => {
    const limit = coinRange.value; // Hole die ausgewählte Anzahl Coins (10, 25, 50)
    loadCryptos(limit); // Lade die entsprechenden Coins
});

// Funktion: Lade die Logos in die Slideshow
function loadSlideshow() {
    fetch(`${apiBaseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`)
        .then(response => response.json()) // Antwort wird in JSON umgewandelt
        .then(data => {
            displayLogos(data); // Zeige die Logos im Slider an
        })
        .catch(error => console.error("Fehler beim Laden der Slideshow-Daten:", error)); // Fehlerbehandlung
}

// Funktion: Lade die Top-Coins basierend auf der Auswahl (10, 25, 50)
function loadCryptos(limit) {
    // Zeige einen Ladeindikator, während die Daten geladen werden
    cryptoContainer.innerHTML = "<p>Daten werden geladen...</p>";

    fetch(`${apiBaseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Fehler beim Abrufen der Daten."); // Fehlermeldung bei nicht erfolgreicher Antwort
            }
            return response.json(); // Antwort in JSON umwandeln
        })
        .then(data => {
            displayCryptos(data); // Zeige die Coins in Kartenform an
        })
        .catch(error => {
            // Fehler anzeigen, falls die API nicht erreichbar ist
            cryptoContainer.innerHTML = `<p style="color: red;">Fehler: ${error.message}</p>`;
        });
}

// Funktion: Zeige die Logos im Slider an
function displayLogos(data) {
    cryptoSlider.innerHTML = ""; // Slider leeren
    data.forEach(coin => {
        // Erstelle ein Slide für jedes Coin-Logo
        const slide = `
            <div class="swiper-slide">
                <img src="${coin.image}" alt="${coin.name} Logo">
            </div>
        `;
        cryptoSlider.insertAdjacentHTML("beforeend", slide); // Füge das Slide in den Slider ein
    });

    initializeSwiper(); // Swiper-Instanz erstellen oder aktualisieren
}

// Funktion: Zeige die Coins in Kartenform an
function displayCryptos(data) {
    cryptoContainer.innerHTML = ""; // Container leeren
    data.forEach((coin, index) => {
        // Bestimme die Farbe für die Preisänderung (grün für positiv, rot für negativ)
        const changeColor = coin.price_change_percentage_24h >= 0 ? "green" : "red";

        // Erstelle eine Karte für jeden Coin
        const card = `
            <div class="crypto-card" tabindex="0" onclick="showCoinDetails('${coin.id}')">
                <span class="crypto-rank">${index + 1}.</span>
                <img src="${coin.image}" alt="${coin.name} Logo" class="crypto-logo">
                <h3 class="crypto-name">${coin.name} (${coin.symbol.toUpperCase()})</h3>
                <p>Preis: $${coin.current_price.toFixed(2)}</p>
                <p style="color: ${changeColor};">Änderung: ${coin.price_change_percentage_24h.toFixed(2)}%</p>
            </div>
        `;
        cryptoContainer.insertAdjacentHTML("beforeend", card); // Füge die Karte in den Container ein
    });
}

// Funktion: Zeige die Details eines Coins im Popup
function showCoinDetails(coinId) {
    fetch(`${apiBaseUrl}/coins/${coinId}`) // Hole die Details eines Coins von der API
        .then(response => response.json()) // Antwort in JSON umwandeln
        .then(data => {
            // Fülle die Popup-Inhalte mit den Coin-Details
            coinDetails.innerHTML = `
                <h2>${data.name} (${data.symbol.toUpperCase()})</h2>
                <p><strong>Preis:</strong> $${data.market_data.current_price.usd}</p>
                <p><strong>Marktkapitalisierung:</strong> $${data.market_data.market_cap.usd.toLocaleString()}</p>
                <p><strong>24h Hoch:</strong> $${data.market_data.high_24h.usd}</p>
                <p><strong>24h Tief:</strong> $${data.market_data.low_24h.usd}</p>
                <p><strong>Marktvolumen:</strong> $${data.market_data.total_volume.usd.toLocaleString()}</p>
            `;
            popup.classList.remove("hidden"); // Zeige das Popup
            popup.setAttribute("aria-hidden", "false"); // Markiere das Popup als sichtbar
        })
        .catch(error => console.error("Fehler beim Laden der Coin-Details:", error)); // Fehlerbehandlung
}

// Event: Popup schließen, wenn der Schliessen-Button geklickt wird
popupClose.addEventListener("click", closePopup);

// Event: Popup schliessen, wenn außerhalb des Inhalts geklickt wird
popup.addEventListener("click", (event) => {
    if (event.target === popup) {
        closePopup();
    }
});

// Funktion: Popup schliessen
function closePopup() {
    popup.classList.add("hidden"); // Verstecke das Popup
    popup.setAttribute("aria-hidden", "true"); // Markiere das Popup als verborgen
}
