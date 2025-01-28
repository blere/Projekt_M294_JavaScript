// Basis-URLs für die APIs
// CoinGecko-API wird für Kryptowährungsdaten verwendet
const apiBaseUrl = "https://api.coingecko.com/api/v3";
// Dummy-API wird für die Simulation von POST-, PUT- und DELETE-Requests genutzt
const dummyApiBaseUrl = "https://jsonplaceholder.typicode.com/posts";

// DOM-Elemente
// Container für die Coin-Liste auf der Hauptseite
const cryptoContainer = document.getElementById("crypto-container");
// Button zum Laden der Coins
const fetchButton = document.getElementById("fetch-button");
// Dropdown zur Auswahl der Anzahl der Coins (10, 25, 50)
const coinRange = document.getElementById("coin-range");
// Slider-Container für die Top 50 Coins
const sliderContainer = document.getElementById("crypto-slider");
// Elemente für das Popup, das Coin-Details anzeigt
const popupOverlay = document.getElementById("popup-overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");

// Favoriten aus dem localStorage laden oder eine leere Liste initialisieren
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Event: Coins laden, wenn der Button "fetchButton" geklickt wird
if (fetchButton) {
    fetchButton.addEventListener("click", () => {
        const limit = parseInt(coinRange?.value || 10, 10); // Anzahl der Coins aus dem Dropdown lesen
        loadTopCoins(limit); // Coins laden
    });
}

// Funktion: Top Coins (Hauptliste) laden
function loadTopCoins(limit) {
    if (!cryptoContainer) return; // Wenn der Container nicht existiert, nichts tun
    cryptoContainer.innerHTML = "<p>Daten werden geladen...</p>"; // Ladehinweis anzeigen

    // API-Request an CoinGecko, um die Top Coins basierend auf der Marktkapitalisierung zu erhalten
    fetch(`${apiBaseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`)
        .then(response => response.json()) // Antwort in JSON umwandeln
        .then(data => {
            renderCryptoList(data); // Coins in der Liste anzeigen
        })
        .catch(error => {
            console.error("Fehler beim Laden der Coins:", error); // Fehler ausgeben
            cryptoContainer.innerHTML = `<p style='color: red;'>Fehler: ${error.message}</p>`;
        });
}

// Funktion: Top 50 Coins für den Slider laden
function loadSliderCoins() {
    if (!sliderContainer) return; // Wenn der Slider-Container nicht existiert, nichts tun

    // API-Request an CoinGecko, um die Top 50 Coins zu laden
    fetch(`${apiBaseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1`)
        .then(response => response.json()) // Antwort in JSON umwandeln
        .then(data => {
            renderSlider(data); // Coins im Slider anzeigen
        })
        .catch(error => {
            console.error("Fehler beim Laden der Slider-Coins:", error); // Fehler ausgeben
        });
}

// Funktion: Coin-Liste (Hauptseite) rendern
function renderCryptoList(data) {
    if (!cryptoContainer) return; // Wenn der Container nicht existiert, nichts tun
    cryptoContainer.innerHTML = ""; // Container leeren

    // Jeden Coin durchlaufen und als Karte rendern
    data.forEach(coin => {
        const isPositive = coin.price_change_percentage_24h >= 0; // Überprüfen, ob die Preisänderung positiv ist
        const changeClass = isPositive ? "text-success" : "text-danger"; // CSS-Klasse basierend auf der Preisänderung
        const card = `
            <div class="col-12 col-md-4">
                <div class="card shadow-sm crypto-card" onclick="showCoinDetails('${coin.id}')">
                    <div class="card-body text-center">
                        <img src="${coin.image}" alt="${coin.name}" class="rounded-circle mb-3" style="width: 50px;">
                        <h5 class="card-title">${coin.name} (${coin.symbol.toUpperCase()})</h5>
                        <p><strong>Preis:</strong> $${coin.current_price.toFixed(2)}</p>
                        <p><strong>24h Änderung:</strong> <span class="${changeClass}">${coin.price_change_percentage_24h.toFixed(2)}%</span></p>
                    </div>
                </div>
            </div>
        `;
        cryptoContainer.insertAdjacentHTML("beforeend", card); // Karte in den Container einfügen
    });
}

// Funktion: Coin-Details im Popup anzeigen
function showCoinDetails(coinId) {
    // API-Request, um die Details eines Coins zu laden
        fetch(`${apiBaseUrl}/coins/${coinId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data); // API-Antwort für Debugging prüfen
                popupContent.innerHTML = `
                    <div>
                        <img src="${data.image?.large || ''}" class="rounded-circle mb-3" style="width: 80px;">
                        <h2>${data.name || 'Unbekannt'} (${data.symbol?.toUpperCase() || 'N/A'})</h2>
                        <p><strong>Preis:</strong> $${data.market_data?.current_price?.usd || 'N/A'}</p>
                        <p><strong>Marktkapitalisierung:</strong> $${data.market_data?.market_cap?.usd?.toLocaleString() || 'N/A'}</p>
                        <p><strong>24h Hoch:</strong> $${data.market_data?.high_24h?.usd || 'N/A'}</p>
                        <p><strong>24h Tief:</strong> $${data.market_data?.low_24h?.usd || 'N/A'}</p>
                        <a href="${data.links?.homepage?.[0] || '#'}" target="_blank" class="btn btn-link">Offizielle Webseite</a>
                        <button class="btn btn-success mt-3" onclick="addToFavorites('${data.id}', '${data.name}', '${data.symbol}', '${data.image.large || ''}')">
                            Zu Favoriten hinzufügen
                        </button>
                    </div>
                `;
                popup.classList.remove("d-none");
                popupOverlay.classList.remove("d-none");
            })
            .catch(error => console.error("Fehler beim Laden der Coin-Details:", error));
    }
    

// Funktion: Coin zu den Favoriten hinzufügen
function addToFavorites(id, name, symbol, image) {
    const isFavorite = favorites.some(fav => fav.id === id); // Prüfen, ob der Coin bereits ein Favorit ist

    if (!isFavorite) {
        favorites.push({ id, name, symbol, image }); // Coin zu den Favoriten hinzufügen
        localStorage.setItem("favorites", JSON.stringify(favorites)); // Favoriten im localStorage speichern
        alert(`${name} wurde zu den Favoriten hinzugefügt.`);
    } else {
        alert(`${name} ist bereits in den Favoriten.`);
    }
}

// Funktion: Slider rendern
function renderSlider(data) {
    sliderContainer.innerHTML = ""; // Slider-Container leeren

    // Coins in den Slider einfügen
    data.forEach(coin => {
        const slide = `<div class="swiper-slide"><img src="${coin.image}" alt="${coin.name}" style="max-height: 50px;"></div>`;
        sliderContainer.insertAdjacentHTML("beforeend", slide);
    });

    // Slider initialisieren
    new Swiper(".swiper", {
        slidesPerView: 6,
        loop: true,
        autoplay: { delay: 0 },
        speed: 2000,
    });
}

// Funktion: Popup schliessen
function closePopup() {
    popup.classList.add("d-none"); // Popup ausblenden
    popupOverlay.classList.add("d-none"); // Overlay ausblenden
}

// Funktion: Favoriten rendern
function renderFavorites() {
    const favoritesList = document.getElementById("favorites-list");
    if (!favoritesList) return;
    favoritesList.innerHTML = ""; // Favoriten-Container leeren

    if (favorites.length === 0) {
        favoritesList.innerHTML = `<p class="text-center text-muted">Keine Favoriten hinzugefügt.</p>`;
        return;
    }

    // Favoriten durchlaufen und Karten rendern
    favorites.forEach(coin => {
        const card = `
        <div class="col-12 col-md-4">
            <div class="card shadow-sm favorite-card">
                <div class="card-body text-center">
                    <img src="${coin.image}" alt="${coin.name}" class="mb-3">
                    <h5 class="card-title">${coin.name} (${coin.symbol.toUpperCase()})</h5>
                    <button class="btn btn-danger btn-sm mt-3" onclick="removeFavorite('${coin.id}')">Entfernen</button>
                </div>
            </div>
        </div>
    `;
        favoritesList.insertAdjacentHTML("beforeend", card);
    });
}

// Funktion: Favoriten entfernen
function removeFavorite(id) {
    favorites = favorites.filter(fav => fav.id !== id); // Coin aus der Favoritenliste entfernen
    localStorage.setItem("favorites", JSON.stringify(favorites)); // Favoriten im localStorage aktualisieren
    renderFavorites(); // Favoritenliste neu rendern
}

// Initialisierung: Seite basierend auf dem Datensatz der aktuellen Seite laden
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = document.body.dataset.page;

    if (currentPage === "index") {
        loadTopCoins(10); // Standardmässig die Top 10 Coins laden
        loadSliderCoins(); // Slider laden
    } else if (currentPage === "favorites") {
        renderFavorites(); // Favoritenliste rendern
        loadSliderCoins(); // Slider laden
    }
});

/* Dummy-API-Funktionen */
// Funktion: Dummy-POST (Daten erstellen)
function createDummyPost() {
    fetch(dummyApiBaseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: "Beispiel-Titel",
            body: "Dies ist ein Beispiel für einen POST-Request.",
            userId: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("POST erfolgreich:", data);
        document.getElementById("dummy-response").innerHTML = `
            <div class="alert alert-success">
                <strong>POST erfolgreich:</strong> ${JSON.stringify(data)}
            </div>
        `;
    })
    .catch(error => console.error("Fehler beim POST-Request:", error));
}

// Funktion: Dummy-PUT (Daten aktualisieren)
function updateDummyPost(id) {
    fetch(`${dummyApiBaseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: id,
            title: "Aktualisierter Titel",
            body: "Dies ist ein aktualisiertes Beispiel für einen PUT-Request.",
            userId: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("PUT erfolgreich:", data);
        document.getElementById("dummy-response").innerHTML = `
            <div class="alert alert-warning">
                <strong>PUT erfolgreich:</strong> ${JSON.stringify(data)}
            </div>
        `;
    })
    .catch(error => console.error("Fehler beim PUT-Request:", error));
}

// Funktion: Dummy-DELETE (Daten löschen)
function deleteDummyPost(id) {
    fetch(`${dummyApiBaseUrl}/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            document.getElementById("dummy-response").innerHTML = `
                <div class="alert alert-danger">
                    <strong>DELETE erfolgreich:</strong> Post mit ID ${id} wurde gelöscht.
                </div>
            `;
        } else {
            throw new Error("Fehler beim Löschen der Daten");
        }
    })
    .catch(error => console.error("Fehler beim DELETE-Request:", error));
}
