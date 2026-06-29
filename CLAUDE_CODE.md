# TickMate — fejlesztői utasítások (Claude Code)

Ez a dokumentum a **fejlesztőnek / Claude Code-nak** szól: hogyan építsd meg a TickMate appot a mellékelt design alapján. A termék-szintű leírás a `TickMate_Spec_v1.0.md`-ben van — ezt a kettőt együtt olvasd.

---

## 0. Mi ez a csomag

```
TickMate_handoff/
├─ CLAUDE_CODE.md            ← ez a fájl (fejlesztői utasítások)
├─ TickMate_Spec_v1.0.md     ← átdolgozott termékspecifikáció
├─ icon/                     ← kész app-ikonok (PNG)
│  ├─ TickMate-icon-1024.png        (elsődleges: zöld jel sötét alapon)
│  ├─ TickMate-icon-512.png
│  ├─ TickMate-icon-192.png
│  ├─ TickMate-icon-180.png
│  └─ TickMate-icon-green-1024.png  (alternatív: sötét jel zöld alapon)
└─ design/
   ├─ TickMate App.dc.html          ← FŐ REFERENCIA: mind a 21 képernyő
   ├─ TickMate Logo.dc.html         ← 14 logó koncepció (kiválasztva: 04 · Stopperóra)
   ├─ TickMate Explorations.dc.html ← korai irányok + sötét/világos párok
   └─ support.js                    ← a .dc.html előnézet futtatókönyvtára
```

## 1. Mit kell csinálni

A `design/` fájlok **HTML design-referenciák** (prototípusok), **nem szállítandó produkciós kód**. A feladat: a designt **újraépíteni React Native-ben**, a célplatform saját komponenseivel és mintáival. A `.dc.html` fájlokat csak vizuális/strukturális referenciaként használd — a `support.js`-t **ne** emeld át.

A `.dc.html` fájlok böngészőben közvetlenül megnyithatók (a `support.js` mellettük legyen). Az összes képernyő egy pannolható vásznon van. Internet kell a betűkhöz és ikonokhoz (Google Fonts + Phosphor CDN).

## 2. Stack és környezet

* **React Native** (iOS + Android, közös kódbázis). Expo vagy bare — a meglévő kódbázis döntése; ha nincs, Expo ajánlott a gyorsabb induláshoz, de a Bluetooth/audio natív modulok miatt valószínűleg **bare workflow** vagy dev-client kell.
* **Betűk:** Hanken Grotesk (UI), JetBrains Mono (számok, gombfeliratok) — csomagold be (`expo-font` vagy `react-native.config.js` + assets).
* **Ikonok:** `phosphor-react-native` (a prototípus a Phosphor *regular* készletét használja).
* **App-ikon:** az `icon/` PNG-k. iOS: 1024 a master (App Store), a többit a build pipeline generálja. Android: adaptív ikon — a stopperóra jel a foreground, a `#13151A` (vagy zöld) a background; 192/512 mellékelve.
* **Navigáció:** `react-navigation` (native stack a fejléces képernyőkhöz; a futás-képernyők fejléc nélküli, teljes nézetek).

### Natív modulok
* **Bluetooth gomb (HID/媒体gomb vagy BLE):** a fizikai gomb eseményeinek elkapása. Médiagomb esetén `react-native` media-key kezelés; egyedi BLE gomb esetén `react-native-ble-plx`.
* **Audio (alacsony késleltetés):** előre generált WAV gyors, ütemezett lejátszása — `react-native-sound` / `expo-av`, vagy natív AVAudioEngine / Oboe a pontos időzítéshez. A 8 ms-os kattanások miatt a késleltetés és a jitter kritikus → lásd BT-kalibráció (Spec 10.5).
* **Okosóra:** Apple Watch (WatchKit / `react-native-watch-connectivity`) és Wear OS — külön natív réteg; a haptika és a csuklós vezérlő miatt.
* **Képfelismerés (Spec 10.2):** on-device OCR — ML Kit Text Recognition (`@react-native-ml-kit/text-recognition`) vagy Vision; a roadbook-számok parse-olása, mindig szerkeszthető eredménnyel.

## 3. Design tokenek

### Színek
| Szerep | Hex |
| --- | --- |
| Háttér (app) | `#13151A` |
| Felület / kártya | `#1B1E23` |
| Felület 2 (chip, input, kapcsoló-sín) | `#23272E` |
| Kapcsoló-sín alt. | `#2A2F36` |
| Elsődleges szöveg | `#E9ECE9` |
| Másodlagos / halvány szöveg | `#8A938D` |
| Mono másodlagos (számok) | `#C3CCC6` |
| **Accent (zöld)** | `#4FB98A` |
| Accent sötét (átfedő/másodlagos) | `#2C5F49` |
| Accent-en lévő szöveg | `#0F1113` |
| „Készen állsz" kártya | bg `#15241D`, keret `rgba(79,185,138,.22)` |
| Lassabb (elemzés) | `#CAA24A` |
| Elválasztó vonal | `rgba(255,255,255,.06)` |

### Tipográfia
* **UI:** Hanken Grotesk, 500/600/700/800.
* **Számok + gombfeliratok:** JetBrains Mono, 500/700/800 (tabuláris érzet).
* Méretek (px ≈ RN dp): nagy futás-szám 84/800 (letter-spacing −.03em); statisztika 30/800 mono; kártyacím 16/700; alcím 11/600; mezőcímke 11/700 uppercase +.1em; fázis 13/700 uppercase +.24em zöld; gomb 13/700 mono uppercase +.09em.

### Forma / méret
* Telefon-referencia 300×640 (a layout arányokat vedd át, ne a px-t fixáld). Kártya sarok 14, input/chip 8–12, gomb 13.
* Tartalom oldalpadding 18, elem-gap 11–16.
* Ikon-csempe 42×42 (sarok 11, bg `#23272E`, zöld ikon).
* Gomb magasság 50 (fő), 46 (STOP). Kapcsoló 46×28 (gomb 22). **Érintési célpont ≥ 44.**

## 4. Komponens-leltár (a designból)

* **StatusBar/NavBar:** fejléc vissza-nyíllal + címmel; jobb oldali akció (`+`, kamera) és/vagy `?` súgó ikon.
* **MenuCard:** ikon-csempe + cím + alcím + chevron (Főképernyő, Gyakorló mód).
* **ListRow:** név + meta + chevron (Versenyek, History).
* **SectionRow:** sorszám (mono, zöld) + típus-ikon + név + `5 / 7 mp`.
* **TypeSchematic (rajzos séma):** vízszintes pálya + kapu-jelek + időcímkék; normál / közös kapu (világos jel) / átfedő (két sáv). Élő előnézet a szerkesztőben.
* **SegmentedControl:** Normál / Követő / Átfedő (ikonnal).
* **Field / Stepper / Toggle / Slider.**
* **RunView:** chip + nagy mono számláló + **vízszintes progress sáv** (RAJT→CÉL) + STOP. Átfedőnél másodlagos kis számláló + vékony sáv.
* **Watch face (okosóra), DivergingBar (elemzés), Timeline (idővonal), ScanView (fotó).**
* **Brand lockup:** stopperóra jel + „Tick" (elsődleges) + „Mate" (zöld). A főképernyő fejlécében.

## 5. Viselkedés / logika

* **Vezérlés:** a Bluetooth gomb a fő bemenet (Start/Következő/Vissza/Megszakítás/Gyakorlás). A kijelző másodlagos.
* **Hang:** lásd Spec §8. A hangsor a szakaszok mentése után **előre generálódik** (WAV); a Start a kész fájlt játssza. A BT-késleltetés offsetet (Spec 10.5) add hozzá az ütemezéshez.
* **Közös kapu:** egyetlen kapuesemény zárja az egyiket és indítja a következőt → automatikus továbblépés.
* **Átfedő:** több aktív időzítő párhuzamosan; a UI elsődleges + másodlagos számlálót mutat.
* **Progress sáv:** a hátralévő idő arányában (prototípusban statikus %, élesben élő).
* **Súgó:** a `?` kontextus-érzékeny lapot/tooltipet nyit az adott képernyőről.
* **Téma + nyelv:** perzisztens; a hangjelzések nyelvfüggetlenek.

## 6. Assetek

* Betűk: Hanken Grotesk, JetBrains Mono (Google Fonts).
* Ikonok: Phosphor (regular). Használt nevek többek közt: `bluetooth-connected, flag-checkered, timer, target, clock-counter-clockwise, gear-six, caret-left, plus, play, check, stop, arrows-clockwise, lightning, metronome, play-circle, plus-circle, question, camera, scan, check-circle, chart-bar, minus, envelope-simple`, szakasztípusok: `arrow-right` (normál), `link-simple` (közös kapu), `arrows-split` (átfedő).
* App-ikon: `icon/` mappa (kész PNG-k).
* **Hangfájlok nincsenek** a csomagban — a hangmotor állítja elő (Spec §8). Referencia: `oldtimer_full_section_8ms.wav`.
* Fotó/kép nincs a designban.

## 7. Javasolt megvalósítási sorrend

1. Téma/tokenek + alap komponensek (NavBar, MenuCard, ListRow, Field, Toggle, gomb).
2. Navigáció + statikus képernyők (Főképernyő, Versenyek, Beállítások, Súgó, Nyelv).
3. Adatmodell (verseny/szakasz) + szerkesztő séma-előnézettel + szakasztípusok.
4. Hangmotor (WAV generálás + ütemezett lejátszás) + BT-késleltetés kalibráció.
5. BT gomb integráció + futás-állapotgép (normál → közös kapu → átfedő).
6. Futás-nézetek (készenlét/normál/közös/átfedő).
7. History + naplózás + elemzés.
8. Képfelismerés (egy szakasz), gyakorló mód, okosóra-kísérő.
9. 2. fázis: tömeges import, megosztás, felhő (külön mérföldkő).

## 8. Megjegyzések / kockázatok

* **Audio-pontosság** a legkritikusabb: a 8 ms-os kattanások időzítése és a BT-késleltetés kompenzációja dönti el a használhatóságot. Korán prototípuszd.
* A fizikai Bluetooth gomb modellje (média-HID vs. egyedi BLE) határozza meg a bemeneti réteget — tisztázandó a hardverrel.
* Okosóra-réteg jelentős külön munka — fázisozható a fő app után.
* A példányadatok (versenynevek, idők) **placeholderek** — valós adatmodellel helyettesítendők.
