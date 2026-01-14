# 📚 Domácí knihovna

Jednoduchý prototyp webové aplikace pro správu domácí knihovny.

## ✨ Funkce

- **Přidávání knih** - Formulář pro přidání nové knihy s podrobnostmi (název, autor, žánr, počet stran, rok vydání, poznámky)
- **Seznam knih** - Přehledný grid zobrazující všechny knihy
- **Editace knih** - Možnost úpravy všech údajů o knize
- **Mazání knih** - Odebrání knihy z knihovny
- **Označení přečtení** - Sledování stavu přečtení každé knihy
- **Vyhledávání** - Fulltextové vyhledávání v názvech, autorech a žánrech
- **Filtry** - Filtrování dle stavu (všechny/přečtené/nepřečtené)
- **Statistiky** - Dashboard s přehledem knihovny (celkem knih, přečteno, k přečtení, procento dokončení, celkový počet stran)
- **Perzistence dat** - Automatické ukládání do localStorage prohlížeče

## 🚀 Spuštění

### Instalace závislostí

```bash
npm install
```

### Spuštění vývojového serveru

```bash
npm start
```

Aplikace se otevře na adrese [http://localhost:3000](http://localhost:3000)

### Build pro produkci

```bash
npm run build
```

## 🛠️ Technologie

- **React 19** - UI framework
- **lucide-react** - Ikony
- **localStorage** - Ukládání dat
- **CSS3** - Styling s gradientními efekty

## 📱 Responzivní design

Aplikace je plně responzivní a funguje na:
- Desktop
- Tablet
- Mobilní zařízení

## 🎨 Hlavní komponenty

### `App.js`
Hlavní komponenta aplikace, spravuje celkový stav, data knih a integruje všechny dílčí komponenty.

### `AddBookForm`
Formulář pro přidání nové knihy s validací povinných polí.

### `BookList`
Grid zobrazující všechny knihy, včetně prázdného stavu.

### `BookCard`
Karta jednotlivé knihy s možností editace, mazání a změny stavu přečtení.

### `SearchBar`
Vyhledávací pole s filtry pro zobrazení všech/přečtených/nepřečtených knih.

### `Stats`
Statistický dashboard zobrazující přehled knihovny.

## 🎯 Použití

1. **Přidání knihy**: Klikněte na tlačítko "Přidat novou knihu" a vyplňte formulář
2. **Vyhledávání**: Použijte vyhledávací pole pro nalezení konkrétní knihy
3. **Filtrace**: Použijte tlačítka pod vyhledáváním pro filtrování dle stavu
4. **Označení jako přečtené**: Klikněte na tlačítko v dolní části karty knihy
5. **Editace**: Klikněte na ikonu tužky v pravém horním rohu karty
6. **Smazání**: Klikněte na ikonu koše v pravém horním rohu karty

## 💾 Ukládání dat

Všechna data jsou automaticky ukládána do localStorage vašeho prohlížeče. Data zůstanou zachována i po zavření a opětovném otevření aplikace.

## 🎓 Budoucí vylepšení

Možná rozšíření prototypu:
- Export dat do CSV/JSON
- Import knih z ISBN
- Hodnocení knih (hvězdičky)
- Kategorie a tagy
- Wishlist (seznam knih k zakoupení)
- Půjčování knih přátelům
- Integrace s Goodreads API
- Dark mode
- Backend a databáze
- Multi-user podpora

## 📄 Licence

Tento projekt je prototyp vytvořený pro demonstrační účely.

---

Vytvořeno s ❤️ pomocí React
