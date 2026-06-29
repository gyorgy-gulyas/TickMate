# TickMate — Roadmap a kész v1-ig

> Nagyvonalú lépéslista a jelenlegi állapottól a szállítható v1-ig. A funkcionális
> alap: `TickMate_Spec_v1.0.md`; a megvalósítási sorrend: `CLAUDE_CODE.md §7`;
> a komponens-leképezés: `docs/COMPONENT_PLAN.md`. A 2. fázis (felhő/megosztás) külön.

Jelölés: ✅ kész · 🟡 részben · ⬜ hátravan

---

## 0. Alap (kész)
- ✅ Bare React Native 0.86 + TypeScript scaffold
- ✅ Téma-réteg (sötét + világos tokenek, ThemeProvider)
- ✅ Primitív + összetett komponensek; betűk (Hanken/JetBrains) + Phosphor ikonok
- ✅ React Native Web előnézet (gyors vizuális ellenőrzés böngészőben)
- ✅ Navigáció (react-navigation) + Főképernyő
- 🟡 Statikus képernyők: Beállítások, Nyelv, BT késleltetés, Versenyek, Verseny részletei, Gyors feladat, Súgó kész; a többi stub

## 1. UI befejezése — vizualizációk + maradék képernyők 🟡 (majdnem kész)
**Kész viz-komponensek:** BrandMark, TypeSchematic, OverlapSchematic, Timeline, DivergingBar, BTButton (+ Legend).
**Kész képernyők (18):** Főképernyő, Versenyek, Verseny részletei, Feladat típusok, Feladat szerkesztő (élő sémával), Gyors feladat, Gyakorló mód, Beállítások, Nyelv, BT késleltetés, Súgó, History, History részletek, Elemzés, Idővonal, és a **4 futás-nézet** (készenlét / normál / közös kapu / átfedő).
**Hátralévő polish (később):** világos mód finomhangolás minden képernyőn; üres/töltő/hiba állapotok; érintési célok ≥44; akadálymentesítés.

### Halasztva — későbbi terv (döntés: 2026-06-29) ⏸️
- **Feladat fotóból (OCR)** — a `ScanView` viz + a képernyő + az on-device OCR (lásd §5). Most „Hamarosan" placeholder.
- **Okosóra-kísérő** — a `WatchFace` viz + a képernyő + a natív óra-réteg (lásd §5). Most „Hamarosan" placeholder.

## 2. Adatmodell + állapot + perzisztencia ⬜
- Valódi adatmodell (Verseny, Feladat, Beállítások) a mock helyett
- Állapotkezelő (pl. Zustand) + tárolás (MMKV/AsyncStorage)
- CRUD: verseny/feladat létrehozás, szerkesztés, törlés, sorrend
- Beállítások perzisztálása (téma, nyelv, BT-offset, hangprofil, másodpercjelző)

## 3. Futás-motor (állapotgép) ⬜
- Fázisok: előkészítés → szakasz → kapu; automatikus haladás a feladatok között
- Típusok logikája: **normál**, **közös kapu** (egy esemény zár+indít), **átfedő** (több párhuzamos időzítő)
- Nagy pontosságú ütemezés/időmérés
- Eseménynapló (gombnyomás, indít/zár, megszakítás) → History + visszajátszás

## 4. Hangmotor — a kritikus rész ⬜
- WAV-generálás: 8 ms kattanások, gyorsuló kapu-visszaszámlálás (a pontos sor: 3.00→0.00), indító hang, másodperc-jelző
- Hang **előre generálása** a feladatok mentése után (versenyenként)
- **Alacsony késleltetésű, ütemezett lejátszás** (natív AVAudioEngine / Oboe, vagy expo-av) — jitter minimalizálás
- **BT-késleltetés offset** beépítése az ütemezésbe
- BT-kalibráció: mérés + kézi korrekció + teszt hang (a UI már megvan)
> Ez a legnagyobb műszaki kockázat — korán prototípuszandó valós eszközön.

## 5. Natív integrációk ⬜
- **Bluetooth gomb** bemenet (média-HID vagy BLE) → Start/Következő/Vissza/Megszakítás/Gyakorlás
- **Okosóra-kísérő** (Apple Watch / Wear OS): rezgő visszaszámlálás, óra mint vezérlő, csuklós számlap — külön natív réteg
- **Képfelismerés / OCR** (ML Kit / Vision) a „Feladat fotóból"-hoz — roadbook-számok, mindig szerkeszthető

## 6. Lokalizáció ⬜
- i18n keret (i18next), minden felirat HU/EN/DE/SK/IT
- A hangjelzések nyelvfüggetlenek maradnak

## 7. Platform / build / kiadás ⬜
- **Android környezet**: SDK + a Studio JBR (JDK) bekötése → valódi build emulátoron/eszközön (folyamatban)
- **iOS build**: Mac + Xcode szükséges (CI vagy fizikai Mac)
- **App-ikonok** bekötése (PNG-k megvannak): iOS app-ikon + Android adaptív ikon + splash
- Onboarding/engedélykérés (Bluetooth, kamera az OCR-hez)
- **Tesztelés**: unit (időzítés-logika, hangsor), eszköz-QA; opcionálisan E2E (Detox)
- Aláírás, store-metaadatok, adatvédelem; CI/CD

## 8. (2. fázis — később, külön mérföldkő)
Tömeges roadbook-import (CSV/QR/több oldal), feladat-készlet megosztás (QR/link), fiók + felhő-szinkron, CarPlay, több hangprofil, részletesebb statisztikák.

---

## Javasolt sorrend (a legrövidebb út a használható appig)
1. **UI befejezése** (1.) — látható, kattintható teljes app (web-en is ellenőrizve)
2. **Adatmodell** (2.) — a Versenyek/szerkesztő valódivá válik
3. **Android környezet** (7. eleje) — valódi eszközön fut
4. **Hangmotor prototípus** (4.) — a kritikus kockázat korai igazolása valós eszközön
5. **Futás-motor** (3.) — a hanggal együtt működő futás
6. **BT gomb** (5.) — a tényleges vezérlés
7. **Lokalizáció** (6.) + **polish/ikonok** (7.)
8. **Okosóra + OCR** (5. maradék) — fázisozható
9. **Kiadás** (7. vége)
