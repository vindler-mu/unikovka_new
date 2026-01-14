# 🎮 Úniková hra: Informační gramotnost - MUNI

## 📋 Obsah

1. [Přehled projektu](#přehled-projektu)
2. [Příběh a narativ](#příběh-a-narativ)
3. [Architektura hry](#architektura-hry)
4. [Herní flow](#herní-flow)
5. [Implementované sekce](#implementované-sekce)
6. [Technický stack](#technický-stack)
7. [Struktura souborů](#struktura-souborů)
8. [Datové modely](#datové-modely)
9. [Stav implementace](#stav-implementace)
10. [Následující kroky](#následující-kroky)

---

## 📖 Přehled projektu

**Název:** Úniková hra - Informační gramotnost
**Instituce:** Masarykova univerzita (MUNI)
**Cíl:** Výukový nástroj pro rozvoj informační gramotnosti studentů
**Formát:** Webová single-page aplikace (React)
**Herní doba:** 20 minut
**Obtížnost:** Střední až pokročilá

### 🎯 Pedagogické cíle

Hra učí studenty čtyři pilíře informační gramotnosti:

1. **Vyhledávání** - Efektivní strategie nalezení zdrojů
2. **Hodnocení** - Kritická analýza kvality informací
3. **Organizace** - Správa, uchování a organizace dat
4. **Komunikace** - Prezentace a sdílení výsledků

### 🎭 Herní mechaniky

- **Časový limit:** 20 minut na dokončení všech 4 úkolů
- **Progresivní obtížnost:** Každá sekce má 4 kola s rostoucí složitostí
- **Personalizace:** Obsah přizpůsoben 10 fakultám MUNI
- **Scoring system:** Max 400 bodů na sekci (1600 bodů celkem)
- **Penalty systém:** Špatné odpovědi snižují "integritu databáze"
- **Unlock mechanismus:** Hesla mezi úkoly jako story elementy

---

## 📚 Příběh a narativ

### 🎬 Premisa

Univerzitní systém **IGRAM** (Intelligent Guidance, Research and Academic Management) byl kompromitován hackerem a transformován na **AI.gor** - systém šířící dezinformace. Student má 20 minut na záchranu univerzitních systémů prokázáním dokonalé znalosti informační gramotnosti.

### 🎭 Hlavní postavy

**Dr. František Záložka** - knihovník, expert na informační gramotnost
**Dr. Marie Knihová** - knihovnice, konzultantka projektu IGRAM
**Pavel Novák** - IT Security Manager
**Hráč** - student MUNI, který musí zachránit univerzitu

### 📧 Story delivery

Příběh je prezentován skrze:
- **Emaily** (3 zprávy v úvodu)
- **Briefing screens** (před každým úkolem)
- **Librarian interludes** (mezi úkoly, vyžadují heslo)
- **Debriefing screens** (po dokončení úkolu)
- **Final completion** (epilog na základě výkonu)

### 🔐 Herní kód

Každý úkol odhalí jednu číslici finálního kódu:
- Task 1 → číslice **3**
- Task 2 → číslice **8**
- Task 3 → číslice **4**
- Task 4 → číslice **1**

**Finální kód: 3841** (obnovuje systém IGRAM)

---

## 🏗️ Architektura hry

### 🎮 Hlavní komponenty

```
EscapeRoomGame (App.js)
├── PersonalizationScreen (jméno, fakulta)
├── DesktopScreen (Desktop simulace)
├── EmailScreen (3 emaily s příběhem)
├── HackerTerminalScreen (aktivace hry příkazem)
├── OverviewScreen (výběr úkolu + zadání příkazu)
├── BriefingScreen (úvod do úkolu)
├── Section Components (interaktivní úkoly)
│   ├── Section1Container (4 kola)
│   ├── Section2Container (4 kola)
│   ├── Section3Container (4 kola)
│   └── [Section4Container] - TBD
├── DebriefingScreen (výsledky úkolu)
├── LibrarianInterlude (heslo mezi úkoly)
├── FinalCodePrompt (zadání finálního kódu)
├── CompletionScreen (epilog)
└── TimeoutScreen (time out screen)
```

### 🔄 State Management

Hlavní state v `App.js`:

```javascript
// Herní stav
const [currentTask, setCurrentTask] = useState(null)
const [taskStates, setTaskStates] = useState({ /* 4 úkoly */ })
const [collectedDigits, setCollectedDigits] = useState([])
const [completedTasks, setCompletedTasks] = useState(0)

// Časování
const [timeLeft, setTimeLeft] = useState(GAME_TIME) // 1200s = 20min
const [gameTimedOut, setGameTimedOut] = useState(false)

// Skóre a penalizace
const [databaseIntegrity, setDatabaseIntegrity] = useState(100)
const [wrongAnswersCount, setWrongAnswersCount] = useState(0)

// UI state
const [showBriefing, setShowBriefing] = useState(null)
const [showDebriefing, setShowDebriefing] = useState(null)
const [showLibrarianInterlude, setShowLibrarianInterlude] = useState(null)
const [showPasswordPrompt, setShowPasswordPrompt] = useState(null)
const [showFinalCodePrompt, setShowFinalCodePrompt] = useState(false)

// Personalizace
const [playerName, setPlayerName] = useState("")
const [selectedFaculty, setSelectedFaculty] = useState(null)
```

### 🎨 Styling approach

- **Terminal aesthetic** - Matrix-inspired design s modrými tóny
- **Monospace fonts** - Courier New, monospace
- **Responsive design** - Funguje na desktop i mobile
- **Faculty colors** - Každá fakulta má vlastní barvu (10 fakultních barev)
- **Accessibility** - Kontrast, keyboard navigation

---

## 🎯 Herní flow

### 1️⃣ Setup Phase

```
PersonalizationScreen
  ↓ (zadá jméno a fakultu)
DesktopScreen (simulace Windows desktop)
  ↓ (klikne na Gmail ikonu)
EmailScreen (přečte 3 emaily o krizi)
  ↓ (klikne na Terminal ikonu)
HackerTerminalScreen
  ↓ (zadá příkaz: "run restore protocol")
OverviewScreen
```

### 2️⃣ Task Loop (4x)

```
OverviewScreen
  ↓ (vybere úkol, zadá "run defense")
BriefingScreen
  ↓ (přečte zadání, klikne Start)
Section Container (4 kola)
  ↓ Round 1 → Round 2 → Round 3 → Round 4
  ↓ (získá skóre)
DebriefingScreen
  ↓ (získá číslici kódu)
LibrarianInterlude
  ↓ (zadá heslo pro odemčení další úlohy)
OverviewScreen (opakuje pro další úkol)
```

### 3️⃣ Completion Phase

```
OverviewScreen (všechny úkoly hotové)
  ↓ (zobrazí se výzva k finálnímu kódu)
FinalCodePrompt
  ↓ (zadá 3841)
CompletionScreen (epilog dle výkonu)
```

### ⏱️ Timeout Path

```
Kdykoliv během hry:
  timeLeft === 0
    ↓
  TimeoutScreen (game over)
```

---

## 🎓 Implementované sekce

### ✅ Section 1: Akademické vyhledávání (Task 1)

**Téma:** Efektivní vyhledávání v akademických databázích
**Status:** ✅ Kompletní (4/4 kola)
**Max skóre:** 400 bodů
**Datová pokrytí:** 10/10 fakult

#### Round 1: Výběr klíčových slov (Keyword Selection)
- **Mechanika:** Drag & drop slov z word banku
- **Validace:** 3-5 správných slov, max 2 špatná
- **Scoring:** +20 bodů za správné slovo, -10 za špatné, +10 bonus za akademická slova
- **Komponenty:**
  - `KeywordSelection.jsx`
  - `WordBank.jsx`
  - `SelectionArea.jsx`
  - `ValidationFeedback.jsx`

#### Round 2: Booleovské operátory (Boolean Query Builder)
- **Mechanika:** Skládání vyhledávacího dotazu s AND/OR/NOT
- **Validace:** Kontrola logické struktury dotazu
- **Scoring:** Správnost syntaxe, použití operátorů, závorek
- **Komponenty:**
  - `BooleanQueryBuilder.jsx`

#### Round 3: Výběr databáze (Database Ranking)
- **Mechanika:** Seřazení 5 databází podle vhodnosti
- **Validace:** Porovnání s ideálním pořadím
- **Scoring:** Penalizace za každou pozici mimo správné pořadí
- **Komponenty:**
  - `DatabaseRanking.jsx`

#### Round 4: Filtrování výsledků (Results Filter)
- **Mechanika:** Nastavení filtrů (rok, typ, peer-review)
- **Validace:** Kontrola všech filtrů
- **Scoring:** Body za každý správně nastavený filtr
- **Komponenty:**
  - `ResultsFilter.jsx`

**Datové soubory:**
- `/src/data/section1/round1_data.js` - 10 fakult
- `/src/data/section1/round2_data.js` - 10 fakult
- `/src/data/section1/round3_data.js` - 10 fakult
- `/src/data/section1/round4_data.js` - 10 fakult

---

### ✅ Section 2: Hodnocení informací (Task 2)

**Téma:** Kritické hodnocení kvality a relevance zdrojů
**Status:** ✅ Kompletní (4/4 kola)
**Max skóre:** 400 bodů
**Datová pokrytí:** 5/10 fakult (FF, PřF, LF, PrF, ESF)

#### Round 1: Posouzení důvěryhodnosti (Credibility Assessment)
- **Mechanika:** Drag & drop 8 zdrojů do 2 kategorií (důvěryhodné/nedůvěryhodné)
- **Validace:** Kontrola správného zařazení každého zdroje
- **Scoring:** 100% správnost = plný počet bodů
- **Komponenty:**
  - `CredibilityAssessment.jsx`
  - `SourceCard.jsx`

#### Round 2: Hodnocení kvality (Quality Evaluation)
- **Mechanika:** Hodnocení 6 kritérií pro 3 zdroje (škála 1-5)
- **Kritéria:** Autorství, metodologie, zdroje, aktuálnost, objektivita, impakt
- **Validace:** Porovnání s očekávaným hodnocením (tolerance ±1)
- **Scoring:** Body za každé správné nebo přijatelné hodnocení
- **Komponenty:**
  - `QualityEvaluation.jsx`

#### Round 3: Posouzení relevance (Relevance Judgment)
- **Mechanika:** Hodnocení 5 abstraktů na škále 1-5 podle relevance
- **Validace:** Přesnost hodnocení dle výzkumné otázky
- **Scoring:** Bonusy za přesné hodnocení
- **Komponenty:**
  - `RelevanceJudgment.jsx`

#### Round 4: Detektor fake news (Fake News Detector)
- **Mechanika:** Identifikace 4 red flags v článku (clickbait, bias, chybějící zdroje, emoce)
- **Validace:** Musí najít všechny 4 problémy
- **Scoring:** 25 bodů za každý nalezený red flag
- **Komponenty:**
  - `FakeNewsDetector.jsx`

**Datové soubory:**
- `/src/data/section2/section2_data.js` - 5 fakult
  - **TODO:** Přidat data pro FI, FSS, PedF, FSpS, PHARM

**Dependencies:**
- `@hello-pangea/dnd` - Drag & drop knihovna (React 19 compatible)

---

### ✅ Section 3: Organizace informací (Task 3)

**Téma:** Správa citací, poznámkování, strukturování
**Status:** ✅ Kompletní (4/4 kola)
**Max skóre:** 400 bodů
**Datová pokrytí:** 2/10 fakult (FF, PřF)

#### Round 1: Správa citací (Citation Management)
- **Mechanika:** Drag & drop 8 zdrojů do 3 kategorií (knihy, články, webové zdroje)
- **Feature:** Modal s náhledem citace (APA + ISO 690 formát)
- **Validace:** 100% správné zařazení
- **Scoring:** Procenta správnosti
- **Komponenty:**
  - `Round1_CitationManagement.jsx`
  - `Round1_CitationManagement.css`

#### Round 2: Poznámkování (Note-taking & Annotation)
- **Mechanika:** 3-fázový workflow
  1. **Fáze 1:** Zvýraznění vět (5 barev: cíl, metoda, výsledky, závěry, citace)
  2. **Fáze 2:** Přiřazení štítků zvýrazněným větám
  3. **Fáze 3:** Napsání syntézy (50-200 znaků)
- **Validace:** Správnost zvýraznění (50%), tagging (30%), poznámka (20%)
- **Scoring:** Celkem 100 bodů
- **Komponenty:**
  - `Round2_NoteTaking.jsx`
  - `Round2_NoteTaking.css`

#### Round 3: Konceptuální mapa (Concept Mapping)
- **Mechanika:** Umístění konceptů na plátno + vytvoření propojení s typy vztahů
- **Feature:** SVG vizualizace, milestones označení
- **Validace:** Umístění konceptů (30%), propojení (50%), milestones (20%)
- **Scoring:** Celkem 100 bodů
- **Komponenty:**
  - `ConceptMapping.jsx`
  - `ConceptMapping.css`

#### Round 4: Strukturování literatury (Literature Structuring)
- **Mechanika:** Přiřazení 8-12 zdrojů do struktury dokumentu (úvod, teorie, metody, atd.)
- **Feature:** Gap analysis otázka na konci
- **Validace:** Správné přiřazení (60%), pořadí (30%), gap analysis (10%)
- **Scoring:** Celkem 100 bodů
- **Komponenty:**
  - `LiteratureStructuring.jsx`
  - `LiteratureStructuring.css`

**Datové soubory:**
- `/src/data/section3/round1_citationManagement.json` - 2 fakulty
- `/src/data/section3/round2_noteTaking.json` - 2 fakulty
- `/src/data/section3/round3_conceptMapping.json` - 2 fakulty
- `/src/data/section3/round4_literatureStructuring.json` - 2 fakulty

**TODO:** Přidat data pro LF, ECON, PF, FSS, FI, PedF, FSpS, PHARM

---

### ⏳ Section 4: Komunikace výsledků (Task 4)

**Téma:** Prezentace a sdílení výzkumných výsledků
**Status:** ❌ Neimplementováno (0/4 kola)
**Max skóre:** 400 bodů (plánováno)
**Datová pokrytí:** 0/10 fakult

#### 🎯 Plánované kolo 1: Vytvoření abstraktu (Abstract Writing)
- **Mechanika:** Strukturované psaní abstraktu s 4 sekcemi
  - Cíl/Background
  - Metodologie
  - Výsledky
  - Závěry
- **Validace:**
  - Každá sekce 30-80 slov
  - Přítomnost klíčových slov
  - Správná struktura
- **Scoring:** 25 bodů za sekci

#### 🎯 Plánované kolo 2: Vizualizace dat (Data Visualization)
- **Mechanika:** Drag & drop datových sad na správné typy grafů
  - Sloupcový graf
  - Liniový graf
  - Koláčový graf
  - Scatter plot
  - Box plot
- **Validace:** Správný typ grafu pro daná data
- **Scoring:** 20 bodů za správnou vizualizaci

#### 🎯 Plánované kolo 3: Peer Review
- **Mechanika:** Hodnocení fiktivního článku/prezentace
  - Identifikace 5 problémů
  - Výběr 3 silných stránek
  - Multiple choice otázky
- **Validace:** Kritické myšlení
- **Scoring:** Body za správnou analýzu

#### 🎯 Plánované kolo 4: Publikační strategie (Publication Strategy)
- **Mechanika:** Matching game - výzkum → typ publikace
  - Konferenční příspěvek
  - Časopisecký článek (Q1-Q4)
  - Blog post
  - Preprint
  - Open access vs. paywall
- **Validace:** Vhodnost kanálu pro typ výzkumu
- **Scoring:** 20 bodů za správný match

**Komponenty k vytvoření:**
- `Section4Container.jsx`
- `Round1_AbstractWriting.jsx`
- `Round2_DataVisualization.jsx`
- `Round3_PeerReview.jsx`
- `Round4_PublicationStrategy.jsx`

**Datové soubory k vytvoření:**
- `/src/data/section4/round1_abstractWriting.json`
- `/src/data/section4/round2_dataVisualization.json`
- `/src/data/section4/round3_peerReview.json`
- `/src/data/section4/round4_publicationStrategy.json`

---

## 💻 Technický stack

### Core Technologies

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-scripts": "5.0.1"
}
```

### Dependencies

```json
{
  "@hello-pangea/dnd": "^17.0.0",  // Drag & drop (React 19 compatible)
  "prop-types": "^15.8.1"          // Runtime type checking
}
```

### Development Tools

- **Create React App** - Project scaffolding
- **ESLint** - Code linting
- **Git** - Version control
- **npm** - Package management

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (responsive design)

---

## 📁 Struktura souborů

```
unikova_hra/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── Section1/              # Akademické vyhledávání
│   │   │   ├── Section1Container.jsx
│   │   │   ├── TerminalWrapper.jsx
│   │   │   ├── Section1Terminal.css
│   │   │   ├── Round1_KeywordSelection/
│   │   │   │   ├── KeywordSelection.jsx
│   │   │   │   ├── WordBank.jsx
│   │   │   │   ├── SelectionArea.jsx
│   │   │   │   └── ValidationFeedback.jsx
│   │   │   ├── Round2_BooleanOperators/
│   │   │   │   └── BooleanQueryBuilder.jsx
│   │   │   ├── Round3_DatabaseSelection/
│   │   │   │   └── DatabaseRanking.jsx
│   │   │   └── Round4_ResultsFilter/
│   │   │       └── ResultsFilter.jsx
│   │   │
│   │   ├── Section2/              # Hodnocení informací
│   │   │   ├── Section2Container.jsx
│   │   │   ├── Section2Container.css
│   │   │   ├── Round1_CredibilityAssessment/
│   │   │   │   ├── CredibilityAssessment.jsx
│   │   │   │   ├── CredibilityAssessment.css
│   │   │   │   ├── SourceCard.jsx
│   │   │   │   └── SourceCard.css
│   │   │   ├── Round2_QualityEvaluation/
│   │   │   │   ├── QualityEvaluation.jsx
│   │   │   │   └── QualityEvaluation.css
│   │   │   ├── Round3_RelevanceJudgment/
│   │   │   │   ├── RelevanceJudgment.jsx
│   │   │   │   └── RelevanceJudgment.css
│   │   │   └── Round4_FakeNewsDetector/
│   │   │       ├── FakeNewsDetector.jsx
│   │   │       └── FakeNewsDetector.css
│   │   │
│   │   ├── Section3/              # Organizace informací
│   │   │   ├── Section3Container.jsx
│   │   │   ├── Section3Container.css
│   │   │   ├── Round1_CitationManagement/
│   │   │   │   ├── Round1_CitationManagement.jsx
│   │   │   │   └── Round1_CitationManagement.css
│   │   │   ├── Round2_NoteTaking/
│   │   │   │   ├── Round2_NoteTaking.jsx
│   │   │   │   └── Round2_NoteTaking.css
│   │   │   ├── Round3_ConceptMapping/
│   │   │   │   ├── ConceptMapping.jsx
│   │   │   │   └── ConceptMapping.css
│   │   │   └── Round4_LiteratureStructuring/
│   │   │       ├── LiteratureStructuring.jsx
│   │   │       └── LiteratureStructuring.css
│   │   │
│   │   ├── Section4/              # ❌ TODO: Komunikace
│   │   │   └── [TBD]
│   │   │
│   │   ├── PersonalizationScreen.js
│   │   ├── DesktopScreen.js
│   │   ├── EmailScreen.js
│   │   ├── HackerTerminalScreen.js
│   │   ├── OverviewScreen.js
│   │   ├── BriefingScreen.js
│   │   ├── DebriefingScreen.js
│   │   ├── LibrarianInterlude.js
│   │   ├── PasswordPrompt.js
│   │   ├── FinalCodePrompt.js
│   │   ├── CompletionScreen.js
│   │   ├── TimeoutScreen.js
│   │   ├── TaskScreen.js           # Legacy (používá se pro Task 4)
│   │   ├── StatusDashboard.js
│   │   └── ErrorBoundary.js
│   │
│   ├── data/
│   │   ├── gameData.js            # Konstanty, fakulty, emaily
│   │   ├── task/                  # Legacy task data
│   │   │   ├── Task1Data.js
│   │   │   ├── Task2Data.js
│   │   │   ├── Task3Data.js
│   │   │   └── Task4Data.js
│   │   ├── section1/
│   │   │   ├── round1_data.js
│   │   │   ├── round2_data.js
│   │   │   ├── round3_data.js
│   │   │   └── round4_data.js
│   │   ├── section2/
│   │   │   └── section2_data.js
│   │   ├── section3/
│   │   │   ├── round1_citationManagement.json
│   │   │   ├── round2_noteTaking.json
│   │   │   ├── round3_conceptMapping.json
│   │   │   └── round4_literatureStructuring.json
│   │   └── section4/              # ❌ TODO
│   │       └── [TBD]
│   │
│   ├── utils/
│   │   ├── gameLogic.js           # Herní logika, scoring
│   │   ├── sounds.js              # Zvukové efekty (placeholder)
│   │   ├── section1/
│   │   │   ├── round1Utils.js
│   │   │   ├── round2Utils.js
│   │   │   ├── round3Utils.js
│   │   │   └── round4Utils.js
│   │   ├── section2/
│   │   │   ├── round1Utils.js
│   │   │   ├── round2Utils.js
│   │   │   ├── round3Utils.js
│   │   │   └── round4Utils.js
│   │   ├── section3/
│   │   │   ├── round1Utils.js
│   │   │   ├── round2Utils.js
│   │   │   ├── round3Utils.js
│   │   │   └── round4Utils.js
│   │   └── section4/              # ❌ TODO
│   │       └── [TBD]
│   │
│   ├── hooks/
│   │   └── useGameTimer.js        # Custom hook pro časovač
│   │
│   ├── constants/
│   │   └── uiConstants.js         # UI konstanty
│   │
│   ├── App.js                     # Hlavní komponenta, state management
│   ├── index.js                   # Entry point
│   └── index.css                  # Global styles
│
├── .gitignore
├── package.json
├── README.md
├── INTEGRATION_GUIDE.md
└── CLAUDE.md                      # Tato dokumentace
```

---

## 📊 Datové modely

### Faculty Model

```javascript
{
  id: "ff",                    // Unikátní identifikátor
  name: "Filozofická fakulta", // Plný název
  shortName: "FF",             // Zkratka
  color: "#4BC8FF",            // Fakultní barva (hex)
  motto: "Veritas et sapientia", // Motto
  specialization: "Humanitní vědy a jazyky" // Oblast
}
```

**10 fakult:**
- FF (Filozofická) - `#4BC8FF`
- PřF (Přírodovědecká) - `#00AF3F`
- LF (Lékařská) - `#F01928`
- ESF (Ekonomicko-správní) - `#B9006E`
- PrF (Právnická) - `#9100DC`
- FSS (Sociálních studií) - `#007A53`
- FI (Informatiky) - `#F2D45C`
- PedF (Pedagogická) - `#FF7300`
- FSpS (Sportovních studií) - `#5AC8AF`
- PHARM (Farmaceutická) - `#56788D`

### Task State Model

```javascript
{
  task1: { completed: false, score: 0 },
  task2: { completed: false, score: 0 },
  task3: { completed: false, score: 0 },
  task4: { completed: false, score: 0 }
}
```

### Round Result Model

```javascript
{
  score: 85,           // Získané body (0-100)
  maxScore: 100,       // Maximum bodů
  percentage: 85,      // Procenta
  breakdown: [         // Detail skóre
    { label: "...", points: 30, earned: true },
    // ...
  ]
}
```

### Section Result Model

```javascript
{
  totalScore: 340,     // Celkové skóre sekce
  maxScore: 400,       // Maximum (4 kola × 100)
  roundResults: {
    round1: { score: 85, percentage: 85 },
    round2: { score: 90, percentage: 90 },
    round3: { score: 80, percentage: 80 },
    round4: { score: 85, percentage: 85 }
  }
}
```

---

## 📈 Stav implementace

### ✅ Hotové komponenty (90%)

#### Core Game Flow ✅
- [x] PersonalizationScreen
- [x] DesktopScreen
- [x] EmailScreen (3 emaily)
- [x] HackerTerminalScreen
- [x] OverviewScreen
- [x] BriefingScreen (4 briefings)
- [x] DebriefingScreen (4 debriefings)
- [x] LibrarianInterlude (3 interludes s hesly)
- [x] PasswordPrompt
- [x] FinalCodePrompt
- [x] CompletionScreen (epilog dle výkonu)
- [x] TimeoutScreen
- [x] StatusDashboard
- [x] ErrorBoundary
- [x] useGameTimer hook

#### Section 1 ✅ (100%)
- [x] Section1Container
- [x] Round 1: KeywordSelection (4 komponenty)
- [x] Round 2: BooleanQueryBuilder
- [x] Round 3: DatabaseRanking
- [x] Round 4: ResultsFilter
- [x] Data pro 10 fakult
- [x] Validační utils (4 soubory)

#### Section 2 ✅ (100% kola, 50% dat)
- [x] Section2Container
- [x] Round 1: CredibilityAssessment + SourceCard
- [x] Round 2: QualityEvaluation
- [x] Round 3: RelevanceJudgment
- [x] Round 4: FakeNewsDetector
- [x] Data pro 5 fakult (FF, PřF, LF, PrF, ESF)
- [x] Validační utils (4 soubory)
- [ ] Data pro zbylých 5 fakult (FI, FSS, PedF, FSpS, PHARM)

#### Section 3 ✅ (100% kola, 20% dat)
- [x] Section3Container
- [x] Round 1: CitationManagement
- [x] Round 2: NoteTaking (3-phase workflow)
- [x] Round 3: ConceptMapping
- [x] Round 4: LiteratureStructuring
- [x] Data pro 2 fakulty (FF, PřF)
- [x] Validační utils (4 soubory)
- [ ] Data pro zbylých 8 fakult

### ❌ Zbývající implementace (10%)

#### Section 4 ❌ (0%)
- [ ] Section4Container
- [ ] Round 1: AbstractWriting
- [ ] Round 2: DataVisualization
- [ ] Round 3: PeerReview
- [ ] Round 4: PublicationStrategy
- [ ] Data pro 10 fakult (plánováno)
- [ ] Validační utils (4 soubory)

#### Data Expansion 📊
- [ ] Section 2: +5 fakult (FI, FSS, PedF, FSpS, PHARM)
- [ ] Section 3: +8 fakult (LF, ECON, PF, FSS, FI, PedF, FSpS, PHARM)

#### Polish & Features 🎨
- [ ] Sound effects (sounds.js má pouze placeholder)
- [ ] Advanced animations
- [ ] Mobile optimization
- [ ] Analytics tracking
- [ ] Difficulty levels
- [ ] Hint system enhancement
- [ ] Leaderboard (optional)

---

## 🚀 Následující kroky

### Priorita 1: Dokončení Section 4 (Critical)

**Krok 1: Vytvoření struktury**
```bash
mkdir -p src/components/Section4/Round{1..4}_*
mkdir -p src/data/section4
mkdir -p src/utils/section4
```

**Krok 2: Implementace kol**
1. Round1_AbstractWriting - 4 textové bloky s validací
2. Round2_DataVisualization - Drag & drop grafy
3. Round3_PeerReview - Multiple choice hodnocení
4. Round4_PublicationStrategy - Matching game

**Krok 3: Data pro všechny fakulty**
- Vytvořit 10 variant pro každé kolo
- Akademické výzkumné scenáře pro každou fakultu

**Krok 4: Integrace do App.js**
```javascript
if (currentTask === 3) {
  return <Section4Container ... />
}
```

### Priorita 2: Rozšíření dat

**Section 2: +5 fakult**
- FI: Informatické zdroje, AI výzkum
- FSS: Sociologické studie, průzkumy
- PedF: Pedagogický výzkum, vzdělávání
- FSpS: Sportovní vědy, fyziologie
- PHARM: Farmaceutický výzkum, klinické studie

**Section 3: +8 fakult**
- Stejné fakulty jako Section 2
- Plus LF, ECON, PF pro kompletní pokrytí

### Priorita 3: UX vylepšení

- [ ] Přidat zvukové efekty (success, error, time warning)
- [ ] Vylepšit animace přechodů mezi obrazovkami
- [ ] Mobilní optimalizace (touch gestures)
- [ ] Loading states během validace
- [ ] Progress bars pro dlouhé operace
- [ ] Accessibility improvements (ARIA labels, keyboard nav)

### Priorita 4: Testing & QA

- [ ] End-to-end testování celého flow
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Validace všech dat (typos, consistency)
- [ ] Beta testing se studenty

### Priorita 5: Deployment

- [ ] Build optimization
- [ ] Hosting setup (GitHub Pages / Netlify / Vercel)
- [ ] Domain configuration
- [ ] SSL certificate
- [ ] Analytics integration (Google Analytics / Matomo)
- [ ] Error monitoring (Sentry)

---

## 🎓 Pedagogické poznámky

### Obtížnost kol

Každá sekce má progresivní obtížnost:
- **Round 1:** Základy (easy)
- **Round 2:** Aplikace (medium)
- **Round 3:** Analýza (medium-hard)
- **Round 4:** Syntéza (hard)

### Čas na kolo

Průměrný čas na kolo: **2-3 minuty**
- 4 sekce × 4 kola = 16 kol
- 16 × 2.5 min = 40 minut čistého času
- S 20 minutami tlačí na rychlé rozhodování

### Feedback strategie

- **Immediate feedback:** Při dragování, vyplňování
- **Inline feedback:** Po akci (správně/špatně)
- **Round feedback:** Po dokončení kola (detail skóre)
- **Section feedback:** Po dokončení všech 4 kol
- **Final feedback:** Epilog na základě celkového výkonu

### Scoring filosofie

- **Pozitivní skóre:** Odměna za správné odpovědi
- **Negativní skóre:** Malá penalizace za chyby (motivace k přemýšlení)
- **Bonus skóre:** Extra body za excelentní výkon
- **Percentage display:** Srozumitelný pro studenty

---

## 🔧 Technické poznámky

### React 19 Upgrade

Projekt byl upgradován na React 19:
- **Důvod:** Nové features, performance
- **Breaking change:** `react-beautiful-dnd` nefunguje
- **Řešení:** Použití `@hello-pangea/dnd` (fork)

### Drag & Drop implementace

Používá se `@hello-pangea/dnd`:
```javascript
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
```

**Klíčové komponenty:**
- `DragDropContext` - Wrapper pro celou DnD oblast
- `Droppable` - Oblast, kam lze položit
- `Draggable` - Prvek, který lze táhnout

### State Management přístup

- **Prop drilling:** State v App.js prochází props
- **Důvod:** Jednodušší pro malý projekt
- **Alternativa:** Context API nebo Redux (overkill pro tuto velikost)

### Styling přístup

- **CSS Modules:** Ne (není potřeba)
- **Inline styles:** Pro dynamické barvy (fakultní barvy)
- **Separate CSS:** Pro každou komponentu
- **Global CSS:** Pro shared styles (index.css)

### Terminal aesthetic

Konzistentní design napříč sekcemi:
- Monospace fonty
- Matrix-inspired blue (#0000dc)
- Matrix background (green raining code)
- Terminal border styling
- Fakultní barvy pro akcenty

---

## 📝 Konvence kódování

### Naming Conventions

**Komponenty:** PascalCase
```javascript
PersonalizationScreen.js
Section1Container.jsx
KeywordSelection.jsx
```

**Utils:** camelCase
```javascript
round1Utils.js
gameLogic.js
```

**Data:** snake_case (JSON) nebo camelCase (JS)
```javascript
round1_data.js
section2_data.js
round1_citationManagement.json
```

### Struktura komponent

```javascript
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./ComponentName.css";

const ComponentName = ({ prop1, prop2, onComplete }) => {
  // State
  const [state, setState] = useState(initialValue);

  // Callbacks
  const handleAction = useCallback(() => {
    // logic
  }, [dependencies]);

  // Render
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  onComplete: PropTypes.func.isRequired
};

ComponentName.defaultProps = {
  prop2: 0
};

export default ComponentName;
```

### Validační utils struktura

```javascript
/**
 * Validate Round X
 * @param {Object} userInput - User's answers
 * @param {Object} data - Correct data
 * @returns {Object} Validation results with scores
 */
export const validateRoundX = (userInput, data) => {
  let totalScore = 0;
  const breakdown = [];

  // Validation logic

  return {
    totalScore,
    maxScore: 100,
    percentage,
    breakdown,
    passed: totalScore >= 70
  };
};

/**
 * Get feedback for performance
 * @param {number} percentage - Score percentage
 * @returns {Object} Feedback message and icon
 */
export const getFeedback = (percentage) => {
  if (percentage >= 90) return { level: "Vynikající!", ... };
  // ...
};
```

---

## 🐛 Známé problémy a workaroundy

### 1. React 19 Drag & Drop

**Problém:** `react-beautiful-dnd` není kompatibilní s React 19

**Řešení:**
```bash
npm install @hello-pangea/dnd
```

### 2. Terminal Wrapper CSS

**Problém:** CSS konflikty mezi sekcemi

**Řešení:** Separátní CSS soubory s prefixed classes
```css
.section1-terminal { ... }
.section2-container { ... }
```

### 3. Faculty Data Fallback

**Problém:** Neexistující data pro některé fakulty

**Řešení:** Fallback na FF data
```javascript
const data = facultyData[facultyId] || facultyData.ff;
```

### 4. Time Synchronization

**Problém:** Časovač pokračuje i při pauze (teoreticky)

**Řešení:** useGameTimer hook s start/stop funkcionalitou
```javascript
const { timeLeft, startTimer, stopTimer } = useGameTimer(GAME_TIME);
```

---

## 📚 Reference a zdroje

### Informační gramotnost

- **ACRL Framework:** Association of College & Research Libraries
- **Metaliteracy:** Combined literacy framework
- **CRAAP Test:** Currency, Relevance, Authority, Accuracy, Purpose

### Design inspirace

- **Terminal aesthetics:** Matrix, Hacknet, Uplink
- **Educational games:** Factitious, Bad News Game
- **Escape rooms:** Digital escape room mechanics

### Technická dokumentace

- [React 19 Docs](https://react.dev/)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- [MUNI Brand Guidelines](https://www.muni.cz/)

---

## 👥 Kontakt a podpora

**Vytvořeno pro:** Masarykova univerzita (MUNI)
**Oddělení:** Informační gramotnost, Univerzitní knihovna

**Development:**
- Framework: React 19
- Status: V vývoji (90% hotovo)
- Last Updated: 2025-01-XX

---

## 📄 Licence

Tento projekt je vlastněn Masarykovou univerzitou a je určen pro vzdělávací účely.

---

**🎯 Celkový stav projektu: 90% HOTOVO**

- ✅ Section 1: 100% (4/4 kola, 10/10 fakult)
- ✅ Section 2: 100% (4/4 kola, 5/10 fakult)
- ✅ Section 3: 100% (4/4 kola, 2/10 fakult)
- ❌ Section 4: 0% (0/4 kola, 0/10 fakult)
- ✅ Core Flow: 100%
- ✅ Story: 100%

**Následující krok: Implementace Section 4 - Komunikace výsledků**
