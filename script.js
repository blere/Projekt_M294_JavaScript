// Basis-URLs für die APIs
const apiBaseUrl = "https://api.coingecko.com/api/v3"; // CoinGecko API für Krypto-Daten
const testApiBaseUrl = "https://jsonplaceholder.typicode.com/posts"; // Platzhalter-API für POST, PUT, DELETE

// DOM-Elemente
const cryptoContainer = document.getElementById("crypto-container"); // Container für die Coin-Listen
const fetchButton = document.getElementById("fetch-button"); // Button zum Laden der Coins
const coinRange = document.getElementById("coin-range"); // Dropdown zur Auswahl der Anzahl Coins
const searchButton = document.getElementById("search-button"); // Button für die Suche
const searchInput = document.getElementById("search-input"); // Eingabefeld für die Suche
const sliderContainer = document.getElementById("crypto-slider"); // Slider-Container für die Top-Coins

const postButton = document.getElementById("post-button"); // Button für POST-Test
const putButton = document.getElementById("put-button"); // Button für PUT-Test
const deleteButton = document.getElementById("delete-button"); // Button für DELETE-Test

// Event: Coins laden (basierend auf der Auswahl im Dropdown-Menü)
fetchButton.addEventListener("click", () => {
    const limit = parseInt(coinRange.value, 10); // Anzahl der Coins aus dem Dropdown
    loadCryptos(limit); // Coins laden
});

// Event: Suche starten
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        searchCrypto(query); // Suche nach Coins
    } else {
        alert("Bitte geben Sie einen Suchbegriff ein.");
    }
});

// POST-Test
postButton.addEventListener("click", () => {
    fetch(testApiBaseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: "Test-Daten",
            body: "Dies ist ein POST-Test.",
            userId: 1,
        }),
    })
        .then(response => response.json())
        .then(data => {
            alert("POST erfolgreich! Daten: " + JSON.stringify(data));
        })
        .catch(error => {
            console.error("Fehler beim POST-Test:", error);
            alert("POST fehlgeschlagen.");
        });
});

// PUT-Test
putButton.addEventListener("click", () => {
    fetch(`${testApiBaseUrl}/1`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: 1,
            title: "Aktualisierte Daten",
            body: "Dies ist ein PUT-Test.",
            userId: 1,
        }),
    })
        .then(response => response.json())
        .then(data => {
            alert("PUT erfolgreich! Daten: " + JSON.stringify(data));
        })
        .catch(error => {
            console.error("Fehler beim PUT-Test:", error);
            alert("PUT fehlgeschlagen.");
        });
});

// DELETE-Test
deleteButton.addEventListener("click", () => {
    fetch(`${testApiBaseUrl}/1`, {
        method: "DELETE",
    })
        .then(response => {
            if (response.ok) {
                alert("DELETE erfolgreich!");
            } else {
                throw new Error("DELETE fehlgeschlagen!");
            }
        })
        .catch(error => {
            console.error("Fehler beim DELETE-Test:", error);
            alert("DELETE fehlgeschlagen.");
        });
});

// Funktion: Coins in die Liste laden
function loadCryptos(limit) {
    cryptoContainer.innerHTML = "<p>Daten werden geladen...</p>"; // Ladehinweis anzeigen

    fetch(`${apiBaseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP-Error! Status: ${response.status}`);
            }
            return response.json(); // Antwort in JSON umwandeln
        })
        .then(data => {
            renderCryptoList(data); // Coins in der Liste anzeigen
            displayLogos(data); // Logos in den Slider einfügen
        })
        .catch(error => {
            console.error("Fehler beim Laden der Coins:", error);
            cryptoContainer.innerHTML = `<p style="color: red;">Fehler: ${error.message}</p>`; // Fehler anzeigen
        });
}

// Funktion: Coin-Liste rendern
function renderCryptoList(data) {
    cryptoContainer.innerHTML = ""; // Container leeren
    if (data.length === 0) {
        cryptoContainer.innerHTML = "<p>Keine Coins gefunden.</p>";
        return;
    }
    data.forEach(coin => {
        const card = `
            <div class="crypto-card" onclick="showCoinDetails('${coin.id}')">
                <img src="${coin.image}" alt="${coin.name}" />
                <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
                <div class="crypto-stats">
                    <p><strong>Preis:</strong> $${coin.current_price.toFixed(2)}</p>
                    <p class="crypto-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                        ${coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                </div>
            </div>
        `;
        cryptoContainer.insertAdjacentHTML("beforeend", card); // Karte einfügen
    });
}

// Funktion: Slider-Logos laden
function displayLogos(data) {
    const sliderContainer = document.getElementById("crypto-slider");
    sliderContainer.innerHTML = ""; // Slider-Container leeren

    // Originale Logos hinzufügen
    data.forEach(coin => {
        const slide = `
            <div class="swiper-slide">
                <img src="${coin.image}" alt="${coin.name} Logo" title="${coin.name}" />
            </div>
        `;
        sliderContainer.insertAdjacentHTML("beforeend", slide); // Füge das Slide hinzu
    });

    // Dupliziere die Logos für die nahtlose Animation
    data.forEach(coin => {
        const slide = `
            <div class="swiper-slide">
                <img src="${coin.image}" alt="${coin.name} Logo" title="${coin.name}" />
            </div>
        `;
        sliderContainer.insertAdjacentHTML("beforeend", slide); // Dupliziere die Logos
    });

    // Swiper-Instanz initialisieren
    new Swiper(".swiper", {
        slidesPerView: 6, // Anzahl der gleichzeitig angezeigten Slides
        spaceBetween: 10, // Abstand zwischen den Logos
        loop: true, // Endlosschleife aktivieren
        speed: 2000, // Geschwindigkeit der Bewegung (niedriger = schneller)
        autoplay: {
            delay: 0, // Keine Verzögerung (kontinuierliche Bewegung)
            disableOnInteraction: false, // Autoplay nicht stoppen bei Interaktion
        },
    });
}

// Event: Logos direkt beim Laden der Seite laden
window.addEventListener("DOMContentLoaded", () => {
    fetch(`${apiBaseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1`)
        .then(response => response.json())
        .then(data => {
            displayLogos(data); // Zeige die Logos im Slider an
        })
        .catch(error => console.error("Fehler beim Laden der Slider-Daten:", error));
});



// Funktion: Details zu einem Coin in einem Popup anzeigen
function showCoinDetails(coinId) {
    fetch(`${apiBaseUrl}/coins/${coinId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP-Error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const popupContent = `
                <div class="popup-overlay" onclick="closePopup()"></div>
                <div class="popup">
                    <span class="close-btn" onclick="closePopup()">×</span>
                    <img src="${data.image.large}" alt="${data.name}" />
                    <h2>${data.name} (${data.symbol.toUpperCase()})</h2>
                    <p><strong>Aktueller Preis:</strong> $${data.market_data.current_price.usd}</p>
                    <p><strong>Marktkapitalisierung:</strong> $${data.market_data.market_cap.toLocaleString()}</p>
                    <p><strong>24h Hoch:</strong> $${data.market_data.high_24h.usd}</p>
                    <p><strong>24h Tief:</strong> $${data.market_data.low_24h.usd}</p>
                    <p><a href="${data.links.homepage[0]}" target="_blank">Offizielle Webseite</a></p>
                </div>
            `;
            document.body.insertAdjacentHTML("beforeend", popupContent); // Popup anzeigen
        })
        .catch(error => console.error("Fehler beim Laden der Coin-Details:", error));
}

// Funktion: Popup schließen
function closePopup() {
    const popup = document.querySelector(".popup");
    const overlay = document.querySelector(".popup-overlay");
    if (popup) popup.remove();
    if (overlay) overlay.remove();
}

// Funktion: Suche nach Coins
function searchCrypto(query) {
    fetch(`${apiBaseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250`)
        .then(response => response.json())
        .then(data => {
            const filtered = data.filter(coin =>
                coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query)
            );
            renderCryptoList(filtered);
        })
        .catch(error => {
            console.error("Fehler bei der Suche:", error);
            cryptoContainer.innerHTML = `<p style="color: red;">Fehler: ${error.message}</p>`;
        });
}

// Standardmäßig die Top 10 Coins laden
window.addEventListener("DOMContentLoaded", () => {
    loadCryptos(10);
});
