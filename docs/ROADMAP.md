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
- ✅ A képernyők valós állapottal működnek (Zustand + perzisztencia, lásd §2); csak a `SectionFromPhoto` (OCR) és `Smartwatch` maradt „Hamarosan" placeholder

## 1. UI befejezése — vizualizációk + maradék képernyők ✅ (kész)
**Kész viz-komponensek:** BrandMark, TypeSchematic, OverlapSchematic, Timeline, DivergingBar, BTButton (+ Legend).
**Kész képernyők:** Főképernyő, Versenyek, Verseny részletei, Feladat típusok (**4 típus**: normál / követő / fonódó / átfedő), Feladat szerkesztő (élő sémával), Gyors feladat, Gyakorló mód, **Reakcióidő** + **Hangritmus** (gyakorlómódok, lásd `REACTION.md` / `RHYTHM.md`), Beállítások, Nyelv, BT késleltetés, Súgó, **Eredmények** (Result: valós idők + elemzés + megjegyzés egy helyen), Idővonal, és a **4 futás-nézet** (készenlét / futás / feladat kész / befejezve).
> **Összevonás (2026-06-30):** a külön History / History-részletek / Elemzés képernyők megszűntek; az eredmények a verseny alatt, az **Eredmények** képernyőn élnek (idők + élő elemzés + megjegyzés).
**Hátralévő polish (később):** világos mód finomhangolás minden képernyőn; üres/töltő/hiba állapotok; érintési célok ≥44; akadálymentesítés.

### Halasztva — későbbi terv (döntés: 2026-06-29) ⏸️
- **Feladat fotóból (OCR)** — a `ScanView` viz + a képernyő + az on-device OCR (lásd §5). Most „Hamarosan" placeholder.
- **Okosóra-kísérő** — a `WatchFace` viz + a képernyő + a natív óra-réteg (lásd §5). Most „Hamarosan" placeholder.

## 2. Adatmodell + állapot + perzisztencia ✅
- ✅ Valódi adatmodell a mock helyett: `data/model.ts` (Race, Section 4 típussal, Segment[], Settings, Run/RunLeg/RunSection) + `data/timing.ts` (kapu-/leg-időzítés, közös countdown)
- ✅ Állapotkezelő: `store/useStore.ts` — **Zustand + persist** (v3 + migrate); tárolás web=localStorage, natív=AsyncStorage
- ✅ CRUD: verseny/feladat létrehozás, szerkesztés, törlés
- ✅ Eredmény-modell: **versenyenként egy Run** (snapshot a tervből + a beírt valós idők); élő elemzés az Eredmények képernyőn
- ✅ Beállítások perzisztálása (téma, nyelv, BT-offset, másodpercjelző)

## 3. Futás-motor (állapotgép) ✅
- ✅ Fázisok: KÉSZENLÉT → FUT (hang) → FELADAT KÉSZ (kézi idő) → … → BEFEJEZVE; viselkedés: `docs/RUN_ENGINE.md`
- ✅ Mind a **4 típus** logikája: normál, **követő** (közös kapu), **fonódó** (B az A-ban), **átfedő** (B az A-ba lóg) — `data/timing.ts`
- ✅ A vizuális számláló a START-tól, a hang idővonalával együtt fut; szakaszhatár- és (audio-szinkron) ütem-jelölők a sávokon
- ✅ Gyors feladatból indított egy-feladatos futás is ugyanitt (RunScreen)
- ⬜ Eseménynapló + visszajátszás — kihagyva (a telefon **nem időmérő**; lásd RUN_ENGINE.md)

## 4. Hangmotor 🟡 (szintézis kész; natív lejátszás: Android kész, iOS + BT-offset hátravan)
- ✅ PCM-szintézis: 8 ms kattanások, gyorsuló + emelkedő kapu-visszaszámlálás (sor: 3.00→0.00), durva végkattanás, indító hang, másodperc-jelző — `audio/synth.ts` + `audio/buildTask.ts`
- ✅ Hang **összeállítása** feladatonként (`COUNTDOWN_OFFSETS` közös forrás a vizuális ütem-jelölőkkel)
- ✅ Web-lejátszás (Web Audio) az előnézethez — `audio/player.web.ts`
- 🟡 **Natív, alacsony késleltetésű lejátszás** — **Android kész** (`TmAudio` Kotlin modul, `AudioTrack` `PERFORMANCE_MODE_LOW_LATENCY`, ENCODING_PCM_FLOAT mono; a JS-ben renderelt PCM base64-ként megy át, eszközön bemérve szól). **iOS hátravan** (AVAudioEngine, Mac kell). Ha az Android jitter kevés lenne, a JS-interfész változatlanul Oboe-ra cserélhető.
- ⬜ **BT-késleltetés offset** beépítése az ütemezésbe; BT-kalibráció valós méréssel (a UI megvan)
> A natív lejátszás volt a legnagyobb műszaki kockázat — Androidon megvan, valós eszközön (emulátor) hallhatóan szól.

## 5. Natív integrációk ⬜
- **Bluetooth gomb** bemenet (média-HID vagy BLE) → Start/Következő/Vissza/Megszakítás/Gyakorlás
- **Okosóra-kísérő** (Apple Watch / Wear OS): rezgő visszaszámlálás, óra mint vezérlő, csuklós számlap — külön natív réteg
- **Képfelismerés / OCR** (ML Kit / Vision) a „Feladat fotóból"-hoz — roadbook-számok, mindig szerkeszthető

## 6. Lokalizáció ⬜
- i18n keret (i18next), minden felirat HU/EN/DE/SK/IT
- A hangjelzések nyelvfüggetlenek maradnak

## 7. Platform / build / kiadás 🟡
- ✅ **Android környezet**: SDK (C:\Android\Sdk) + a Studio JBR (JDK 21) bekötése → a debug build **megépült és elindult emulátoron** (2026-06-30). Megjegyzés: a `npm run android` Windowson elhasal (`gradlew.bat`), helyette közvetlen `gradlew app:installDebug` — lásd `docs/ANDROID_SETUP.md`.
- **iOS build**: Mac + Xcode szükséges (CI vagy fizikai Mac)
- **App-ikonok** bekötése (PNG-k megvannak): iOS app-ikon + Android adaptív ikon + splash
- Onboarding/engedélykérés (Bluetooth, kamera az OCR-hez)
- **Tesztelés**: unit (időzítés-logika, hangsor), eszköz-QA; opcionálisan E2E (Detox)
- Aláírás, store-metaadatok, adatvédelem; CI/CD

## 8. (2. fázis — később, külön mérföldkő)
Tömeges roadbook-import (CSV/QR/több oldal), feladat-készlet megosztás (QR/link), fiók + felhő-szinkron, CarPlay, több hangprofil, részletesebb statisztikák.

---

## Javasolt sorrend (a legrövidebb út a használható appig)
1. ✅ **UI befejezése** (1.) — látható, kattintható teljes app (web-en ellenőrizve)
2. ✅ **Adatmodell** (2.) — a Versenyek/szerkesztő valódi, perzisztens
3. ✅ **Hangmotor — szintézis** (4. első fele) — kattanások/visszaszámlálás, web-előnézet
4. ✅ **Futás-motor** (3.) — a hang idővonalával együtt futó nézetek
5. ✅ **Android környezet** (7. eleje) — valódi eszközön fut (megépült + elindult emulátoron, 2026-06-30)
6. 🟡 **Hangmotor — natív lejátszás** (4. második fele) — Android ✅ (AudioTrack low-latency); hátravan: BT-offset + iOS
7. ⬜ **BT gomb** (5.) — a tényleges vezérlés (csak START)
8. ⬜ **Lokalizáció** (6.) + **polish/ikonok** (7.)
9. ⬜ **Okosóra + OCR** (5. maradék) — fázisozható
10. ⬜ **Kiadás** (7. vége)
