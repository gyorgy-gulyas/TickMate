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
- ✅ A képernyők valós állapottal működnek (Zustand + perzisztencia, lásd §2); minden route valós képernyő (a `SectionFromPhoto` OCR és a `Smartwatch` is kész)

## 1. UI befejezése — vizualizációk + maradék képernyők ✅ (kész)
**Kész viz-komponensek:** BrandMark, TypeSchematic, OverlapSchematic, Timeline, DivergingBar, BTButton (+ Legend).
**Kész képernyők:** Főképernyő, Versenyek, Verseny részletei, Feladat típusok (**4 típus**: normál / követő / fonódó / átfedő), Feladat szerkesztő (élő sémával), Gyors feladat, Gyakorló mód, **Reakcióidő** + **Hangritmus** (gyakorlómódok, lásd `REACTION.md` / `RHYTHM.md`), Beállítások, Nyelv, BT késleltetés, Súgó, **Eredmények** (Result: valós idők + elemzés + megjegyzés egy helyen), Idővonal, és a **4 futás-nézet** (készenlét / futás / feladat kész / befejezve).
> **Összevonás (2026-06-30):** a külön History / History-részletek / Elemzés képernyők megszűntek; az eredmények a verseny alatt, az **Eredmények** képernyőn élnek (idők + élő elemzés + megjegyzés).
**Polish:** ✅ üres/töltő/hiba állapotok (`StatusView`, `inline` móddal a listákban is), ✅ **Súgó FAQ** tartalom (lenyíló Q&A, 4 nyelven). Hátravan: világos mód finomhangolás minden képernyőn; érintési célok ≥44; akadálymentesítés.

### Halasztva — későbbi terv (döntés: 2026-06-29) ⏸️
- **Okosóra-kísérő natív rétege** — a rezgő visszaszámlálás / csuklós vezérlés (Wear OS / Apple Watch). A képernyő + státusz + `watchLatencyMs` kész; a natív óra-réteg hátravan (lásd §5).

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
- 🟡 **Natív, alacsony késleltetésű lejátszás** — **Android kész** (`TmAudio` Kotlin modul, `AudioTrack` `PERFORMANCE_MODE_LOW_LATENCY`, ENCODING_PCM_FLOAT mono; a JS-ben renderelt PCM base64-ként megy át, eszközön bemérve szól). **iOS: a modul megvan** (`ios/TmNative/TmAudio.swift`, `AVAudioEngine`, ugyanaz a `play(base64Pcm, sampleRate)` interfész), de **még nem futott le felhő-buildben** (Mac/CI kell — lásd `docs/IOS_SETUP.md`). Ha az Android jitter kevés lenne, a JS-interfész változatlanul Oboe-ra cserélhető.
- 🟡 **Késleltetés-kompenzáció** — két külön érték (Beállítások → Eszköz):
  - **Füles (kimeneti) késleltetés** ✅ (`btAudioLatencyMs`): a futás-nézet a számlálót/jelzőket ennyivel hátrébb tolja, hogy egyezzen a hallottal; a Fülhallgató képernyőn **kalibráló teszt** (3 sípolás → 10 ritmusos kattanás → 3 sípolás + szinkron villanás).
  - **Gomb (bemeneti) késleltetés** ⬜ (`btButtonLatencyMs`): a teljes futás-idővonal origóját tolja korábbra — a **BT-gombbal** együtt jön (§5). A beállítás-képernyő kész, a hatás még nincs bekötve.
  - **Óra (kimeneti) késleltetés** ⬜ (`watchLatencyMs`): a rezgő visszaszámlálást / indítást igazítja a hanghoz — az **okosóra-réteggel** együtt jön (§5). A beállítás kész, a hatás még nincs bekötve.
  - ⬜ BT-auto-bemérés (a „Bemérés" gomb még stub) — kézi korrekció működik.
- ✅ **Eszköz-státusz kijelzés** (`TmBluetooth` Kotlin modul): a gomb (HID) / füles / óra a valós párosított/csatlakozott állapotot mutatja (nincs mock); párosítás a rendszer Bluetooth-beállításában (az app csak olvas). `BLUETOOTH_CONNECT` engedéllyel.
> A natív lejátszás volt a legnagyobb műszaki kockázat — Androidon megvan, valós eszközön (emulátor) hallhatóan szól.

## 5. Natív integrációk ⬜
- **Bluetooth gomb** bemenet (média-HID vagy BLE) → Start/Következő/Vissza/Megszakítás/Gyakorlás
- **Okosóra-kísérő** (Apple Watch / Wear OS): rezgő visszaszámlálás, óra mint vezérlő, csuklós számlap — külön natív réteg
- ✅ **Képfelismerés / OCR** (ML Kit, `@react-native-ml-kit/text-recognition` + `react-native-image-picker`): fotó/galéria → on-device OCR → egység-alapú kinyerés (hosszak `m`, idő `s`/`mm:ss`); 2 hossz → **követő**; hiányzó idő indítás előtt kötelező; a roadbook-kép a szakaszhoz mentve és a futás előtt előhívható. A rajzot nem értelmezzük — a típus mindig szerkeszthető. iOS: Vision hátravan.

## 6. Lokalizáció ⬜
- i18n keret (i18next), minden felirat HU/EN/DE/ES
- A hangjelzések nyelvfüggetlenek maradnak

## 7. Platform / build / kiadás 🟡
- ✅ **Android környezet**: SDK (C:\Android\Sdk) + a Studio JBR (JDK 21) bekötése → a debug build **megépült és elindult emulátoron** (2026-06-30). Megjegyzés: a `npm run android` Windowson elhasal (`gradlew.bat`), helyette közvetlen `gradlew app:installDebug` — lásd `docs/ANDROID_SETUP.md`.
- 🟡 **iOS build**: Mac nélkül **felhő-CI-vel** (Codemagic) → TestFlight/Ad Hoc a valódi iPhone-ra. A `codemagic.yaml` + `ios/TmNative` (audio/BT modul, lokális pod) + `Info.plist` engedélyek kész; hátravan: fizetős Apple Developer fiók + első felhő-build (lásd `docs/IOS_SETUP.md`).
- ✅ **Android app-ikon** (adaptív: sötét háttér + zöld stopperóra) + **cold-start splash** (SplashTheme → AppTheme) bekötve. Hátravan: iOS app-ikon.
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
