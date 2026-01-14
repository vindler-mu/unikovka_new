# 🔌 Integration Guide: Section 1 do stávající hry

Tento návod vám ukáže, jak integrovat nový Section 1 (Round 1: Keyword Selection) do současné hry.

## 📦 Co máte připraveno

✅ **Hotové komponenty:**
- `Section1Container` - wrapper pro všechna kola
- `KeywordSelection` - hlavní komponenta Round 1
- `WordBank`, `SelectionArea`, `ValidationFeedback` - dílčí komponenty
- `round1Utils.js` - validační a scoring logika

✅ **Ukázková data:**
- `/src/data/section1/round1_data.js` - data pro FF a PřF

## 🎯 Integrace - Krok za krokem

### Krok 1: Nahradit Task1Data novým Section1

#### V `src/App.js`:

**Přidejte import:**
```javascript
import Section1Container from "./components/Section1/Section1Container";
```

**Najděte místo, kde se zobrazuje Task1:**
```javascript
// Současný kód - NAJDĚTE TOTO:
if (currentTask === 0 && !taskStates.task1.completed) {
  const currentTaskData = gameDataArray[currentTask];
  return (
    <TaskScreen
      currentTask={currentTask}
      taskData={currentTaskData}
      // ... další props
    />
  );
}
```

**Nahraďte s Section1Container:**
```javascript
// NOVÝ kód:
if (currentTask === 0 && !taskStates.task1.completed) {
  return (
    <Section1Container
      facultyId={selectedFaculty?.id || "ff"}
      facultyColor={selectedFaculty?.color}
      onSectionComplete={(result) => {
        // Zpracování dokončení Section 1
        console.log("Section 1 completed with score:", result.totalScore);

        // Označit task jako dokončený
        setTaskStates((prev) => ({
          ...prev,
          task1: { ...prev.task1, completed: true },
        }));

        // Přidat sebranou číslici
        setCollectedDigits((prev) => [...prev, COLLECTED_DIGITS[0]]);

        // Zvýšit počet dokončených úkolů
        setCompletedTasks((prev) => prev + 1);

        // Přidat do unlocked story segments
        setUnlockedStorySegments((prev) => [...prev, 0]);

        // Zobrazit debriefing
        setTimeout(() => {
          setShowDebriefing(0);
        }, 100);
      }}
    />
  );
}
```

### Krok 2: Testování

**Spusťte hru:**
```bash
npm start
```

**Test flow:**
1. Vyplňte personalizaci (jméno, fakulta)
2. Projděte desktop screen
3. Přečtěte si emaily
4. Zadejte příkaz v terminále: `run restore protocol`
5. V overview screen zadejte: `run defense`
6. **Měli byste vidět nový Section 1 Round 1!** 🎉

### Krok 3: Přidejte vaše data

**Upravte `/src/data/section1/round1_data.js`:**

Přidejte data pro všechny vaše fakulty. Vzor:

```javascript
export const round1Data = {
  ff: {
    scenario: {
      question: "Vaše výzkumná otázka pro FF...",
      field: "Politologie",
      context: "Kontext..."
    },
    wordBank: [
      {
        id: 1,
        text: "klíčové slovo",
        isCorrect: true,
        academicLevel: "high",
        feedback: "Vysvětlení proč je správně..."
      },
      // ... dalších 11 slov
    ],
    validation: {
      minCorrect: 3,
      maxWords: 5,
      maxIncorrect: 2
    },
    scoring: {
      correctWord: 20,
      incorrectWord: -10,
      academicBonus: 10,
      maxScore: 100
    }
  },
  // Přidejte pro: prf, lf, econ, pf, fss, fi, ped, fspch, pharm
};
```

## 🎨 Customizace

### Fakultní barvy

Barvy jsou automaticky převzaty z `selectedFaculty.color`. Ujistěte se, že máte je správně nastavené v `/src/data/gameData.js`:

```javascript
export const faculties = [
  {
    id: "ff",
    color: "#4BC8FF",  // Tato barva se použije v Section1
    // ...
  },
  // ...
];
```

### Úprava skórovacího systému

Pokud chcete změnit body, upravte v datech každé fakulty:

```javascript
scoring: {
  correctWord: 25,      // Změnit z 20 na 25
  incorrectWord: -15,   // Změnit penalizaci
  academicBonus: 15,    // Změnit bonus
  maxScore: 100         // Nechat stejné
}
```

## 🐛 Troubleshooting

### Problém: Section1 se nezobrazuje

**Zkontrolujte:**
1. Je `currentTask === 0`?
2. Je `!taskStates.task1.completed`?
3. Je import Section1Container správně?

**Debug:**
```javascript
console.log("Current task:", currentTask);
console.log("Task1 state:", taskStates.task1);
```

### Problém: Chybí data pro moji fakultu

**Řešení:**
1. Otevřete `/src/data/section1/round1_data.js`
2. Přidejte objekt pro vaši fakultu (id musí odpovídat `facultyId`)
3. Nebo použijte fallback: component automaticky použije `ff` pokud nenajde data

**Temporary fix v round1_data.js:**
```javascript
export const getRound1Data = (facultyId) => {
  return round1Data[facultyId] || round1Data.ff; // fallback
};
```

### Problém: Styling není správný

**Zkontrolujte:**
1. Je `facultyColor` prop předán?
2. Máte nainstalované všechny dependencies?

```bash
npm install
```

## 📋 Checklist před produkcí

- [ ] Přidána data pro všechny fakulty
- [ ] Otestován flow od začátku do konce
- [ ] Ověřeno skórování
- [ ] Funguje validace správně
- [ ] Funguje na mobile
- [ ] Feedback texty jsou správně
- [ ] Barvy fakult fungují
- [ ] Console je bez errors
- [ ] Přechod na další části hry funguje

## 🚀 Další kroky

Po úspěšné integraci Round 1:

1. **Implementujte Round 2:** Boolean Operators
2. **Implementujte Round 3:** Database Selection
3. **Implementujte Round 4:** Results Filter
4. **Přidejte analytics:** Track user performance
5. **Vylepšete feedback:** Personalizované podle výkonu

## 💡 Tipy

1. **Začněte s jednou fakultou** - otestujte kompletně
2. **Použijte console.log** - sledujte flow dat
3. **Testujte na mobile** - responsive design
4. **Sbírejte feedback** - od uživatelů
5. **Iterujte data** - upravujte slova podle výsledků

## 📞 Potřebujete pomoc?

Pokud narazíte na problém:
1. Zkontrolujte console errors
2. Ověřte, že všechny soubory jsou na správném místě
3. Zkuste restartovat dev server (`npm start`)

---

**Hotovo!** 🎉 Teď máte Round 1 integrovaný do hry!

Další session můžeme implementovat Round 2, 3, 4 nebo vylepšit stávající Round 1 podle vašeho feedbacku.
