# PROJEKT_M_294

Das **PROJEKT_M_294** ist eine Webanwendung, die Kryptowährungsdaten in Echtzeit abruft und darstellt. Die Anwendung nutzt die CoinGecko-API, um die Top-Kryptowährungen basierend auf ihrer Marktkapitalisierung anzuzeigen. Zusätzlich bietet sie Funktionen wie das Speichern von Favoriten und die Demonstration von CRUD-Operationen mit einer Dummy-API.

---

## Funktionen

### Hauptfunktionen
- **Anzeige von Kryptowährungen**:
  - Dynamische Liste der Top 10, 25 oder 50 Coins basierend auf der Marktkapitalisierung.
  - Detaillierte Informationen wie Preis, Marktkapitalisierung, 24-Stunden-Hoch und -Tief.
  - Prozentuale Änderungen der Preise (grün für positiv, rot für negativ).
  
- **Favoriten-Management**:
  - Benutzer können Kryptowährungen zur Favoritenliste hinzufügen und entfernen.
  - Favoriten werden lokal im Browser (localStorage) gespeichert.
  - Favoriten sind übersichtlich in Karten mit Hover-Effekt dargestellt.

- **Popup für Coin-Details**:
  - Zeigt detaillierte Informationen zu einer Kryptowährung in einem Popup-Fenster an.
  - Enthält einen Link zur offiziellen Webseite des Coins.

- **Slider für Top-Coins**:
  - Ein horizontal scrollender Slider zeigt die Top 50 Coins mit ihren Logos.

- **CRUD-Operationen (Simuliert)**:
  - Demonstration von `POST`, `PUT` und `DELETE` mit einer Dummy-API (https://jsonplaceholder.typicode.com/).

---

## Technologien

### Verwendete Technologien:
- **HTML**: Struktur der Benutzeroberfläche.
- **CSS**: Styling und Layout, inkl. Responsivität.
- **JavaScript**: 
  - API-Integration (CoinGecko-API und Dummy-API).
  - Dynamisches Rendering der Inhalte.
  - Favoriten-Management über `localStorage`.

- **Frameworks und Bibliotheken**:
  - [Bootstrap 5](https://getbootstrap.com/): Für das Layout und responsives Design.
  - [Swiper.js](https://swiperjs.com/): Für den Slider.
  - [CoinGecko API](https://www.coingecko.com/en/api): Zur Anzeige von Kryptowährungsdaten.
  - [JSONPlaceholder API](https://jsonplaceholder.typicode.com/): Für die Simulation von CRUD-Operationen.

---

## Projektstruktur

### Ordnerstruktur:
```plaintext
PROJEKT_M_294/
│
├── css/
│   └── style.css         # Benutzerdefinierte CSS-Datei
│
├── html/
│   └── favorites.html    # Favoriten-Seite
│
├── java-script/
│   └── script.js         # Haupt-JavaScript-Datei
│
├── index.html            # Hauptseite
├── README.md             # Projektbeschreibung

