# TickMate — Komponens- és architektúra-terv (design-elemzés)

> Forrás: `design/TickMate App.dc.html` (21 képernyő) + `CLAUDE_CODE.md` + `TickMate_Spec_v1.0.md`.
> Stack-döntés: **bare React Native** (TypeScript). A natív audio (AVAudioEngine/Oboe), BLE gomb és okosóra rétegek miatt.
> Ez egy **terv**, nem kód. A `.dc.html` csak vizuális/strukturális referencia — a `support.js`-t nem emeljük át.

---

## 1. Design tokenek (a CSS-ből kiolvasva, egyezik a CLAUDE_CODE.md-vel)

### Színek
| Token | Hex | Megjegyzés |
| --- | --- | --- |
| `bg` | `#13151A` | app háttér |
| `surface` | `#1B1E23` | kártya |
| `surface2` | `#23272E` | chip, input, ikon-csempe |
| `railAlt` | `#2A2F36` | kapcsoló-sín, slider-sín |
| `textPrimary` | `#E9ECE9` | |
| `textSecondary` | `#8A938D` | |
| `monoSecondary` | `#C3CCC6` | számok másodlagos |
| `accent` | `#4FB98A` | zöld |
| `accentDark` | `#2C5F49` | átfedő másodlagos sáv |
| `onAccent` | `#0F1113` | zöld gombon lévő szöveg |
| `readyBg` / `readyBorder` | `#15241D` / `rgba(79,185,138,.22)` | „Készen állsz" kártya |
| `slower` | `#CAA24A` | elemzés: lassabb |
| `divider` | `rgba(255,255,255,.06)` | |
| `numBright` | `#F1F4F1` | nagy számok |

### Tipográfia
- **UI:** Hanken Grotesk 500/600/700/800.
- **Szám + gombfelirat:** JetBrains Mono 500/700/800 (tabuláris).
- Kulcsméretek: futás-szám `84/800 -.03em`; statisztika `30/800` mono; watch-szám `46/800`; kártyacím `16/700`; mezőcímke `11/700 uppercase +.1em`; fázis `13/700 uppercase +.24em` zöld; gomb `13/700` mono uppercase `+.09em`.

### Forma / méret
- Telefon-referencia **300×640** — arányokat venni át, nem fix px-t.
- Sugarak: kártya 14, input/chip 8–12, gomb 13, ikon-csempe 11, telefon 42.
- Padding: tartalom oldalt 18, elem-gap 11–16. Ikon-csempe 42×42.
- Gomb magasság 50 (fő) / 46 (STOP). Toggle 46×28 (knob 22). **Érintési cél ≥ 44.**

---

## 2. A 21 képernyő — csoportosítva

**Kezelés / lista (header-es, NavBar-ral):**
1. Főképernyő — brand lockup + „Készen állsz" kártya + 6 MenuCard
2. Versenyek — ListRow lista + „Új verseny" footer gomb
3. Verseny részletei — Pill + SectionRow lista + dupla footer (újragenerálás / Start)
4. Szakasz típusok — 3 TypeCard sémával (normál / közös kapu / átfedő)
5. Szakasz szerkesztő — Field-ek + SegmentedControl + élő TypeSchematic előnézet + kamera akció
6. Szakasz fotóból — ScanView + felismert Field-ek check-circle jelzőkkel
7. Gyors feladat — 2 Field + Toggle
8. Gyakorló mód — 4 MenuCard
9. Beállítások — SettingsRow-k (érték / chevron / toggle / slider)
10. Nyelv — SettingsRow + check (5 nyelv)
11. Bluetooth késleltetés — StatCard + Stepper + teszt/auto/mentés gombok
12. Okosóra-kísérő — WatchFace + SettingsRow-k + slider
13. Súgó — Gyors kezdés (számozott) + FAQ ListRow-k + Kapcsolat MenuCard

**Futás (header NÉLKÜL, teljes nézet, `content` space-between):**
14. Készenlét — Chip + StatCard + nagy kör START gomb + UpcomingRow-k
15. Normál — Chip + Phase + BigNum + ProgressTrack (RAJT→CÉL) + STOP
16. Közös kapu — mint normál + automatikus-váltás info-kártya
17. Átfedő (2 aktív) — elsődleges BigNum + másodlagos OverlapSecondary kártya

**Előzmény / elemzés (header-es):**
18. Szakaszok idővonala — Timeline (sáv + átfedő sáv + vezetővonal) + Legend + jegyzet
19. History — ListRow lista
20. History részletek — SectionRow lista mért időkkel + Note + „Elemzés" gomb
21. Futás elemzés — StatCard + DivergingBar lista (gyorsabb zöld / lassabb sárga)

---

## 3. Újrahasznosítható komponens-leltár

### Primitívek
| Komponens | CSS- alap | Hol |
| --- | --- | --- |
| `Button` (pri/sec) | `.btn` | minden footer |
| `IconTile` | `.micon` | MenuCard, hstat, Súgó |
| `Field` (label+input+unit) | `.field/.finput/.funit` | szerkesztő, gyors feladat, fotóból, BT |
| `SegmentedControl` | `.seg3/.segopt` | szerkesztő (típus) |
| `Toggle` | `.tog/.knob` | gyors feladat, beállítások, okosóra |
| `Slider` | `.slider/.sfill/.sknob` | beállítások, okosóra |
| `Stepper` | `.stepper/.stepbtn/.stepval` | BT késleltetés |
| `Chip` | `.chip` | futás-nézetek |
| `Pill` | `.pill/.pdot` | verseny részletei |
| `Card` (alap felület) | `.tcard/.note/.ovsec` | több helyen |

### Összetett
| Komponens | CSS-alap | Hol |
| --- | --- | --- |
| `NavBar` (back/cím/akciók: +, kamera, ?) | `.nav/.bk/.add/.hlp/.navt` | minden header-es képernyő |
| `MenuCard` | `.mcard` | Főképernyő, Gyakorló mód, Súgó kapcsolat |
| `ListRow` | `.lrow` | Versenyek, History, Súgó FAQ |
| `SectionRow` (num+típusikon+név+mono) | `.srow2/.lnum/.tico/.lmono` | verseny részletei, history részletek |
| `SettingsRow` (név+érték/chevron/toggle/slider) | `.srow/.sname/.sval` | beállítások, okosóra, nyelv |
| `StatCard` (2 statisztika + vline) | `.statcard/.statn/.vline` | készenlét, BT, elemzés |
| `ProgressTrack` | `.htrack/.hfill` | futás-nézetek |
| `BigNum` | `.bignum/.bigunit` | futás-nézetek |
| `ReadyStatusCard` | `.hstat` | Főképernyő |
| `UpcomingRow` | `.uprow` | készenlét |

### Sémák / vizualizációk (react-native-svg)
| Komponens | CSS-alap | Hol |
| --- | --- | --- |
| `TypeSchematic` (pálya + kapuk + idők, normál/közös) | `.schtrack/.schgate/.schdot/.schtime/.schcap` | típusok, szerkesztő előnézet |
| `OverlapSchematic` (2 mini sáv) | `.tltrack/.tlbar` | típuskártya (átfedő) |
| `Timeline` (sávok + átfedés + vezetővonal + tengely) | `.tlwrap/.tlbar/.tlsec/.vguide/.tlaxis` | idővonal |
| `DivergingBar` (közép + két irány) | `.dvrow/.dvtrack/.dvmid/.dvbar` | elemzés |
| `WatchFace` | `.watch/.watchnum/.watchhap` | okosóra |
| `ScanView` (kamerakeret) | `.scanbox/.scanframe` | fotóból |
| `BTButton` (nagy kör START) | `.btbtn` | készenlét |
| `BrandLockup` (stopperóra SVG + Tick/Mate) | inline SVG | Főképernyő |
| `Legend` | `.lgd/.lgdt` | idővonal, elemzés |

**Brand mark SVG** (viewBox 0 0 64 64): korona-`rect`(27.5,6,9,6) + szár `M32 12 V16` + test `circle(32,36,r18)` + mutatók `M32 36 L32 25` és `M32 36 L40 40`. → `BrandMark.tsx` (react-native-svg).

---

## 4. Javasolt mappastruktúra (bare RN + TS)

```
src/
  theme/        tokens.ts · ThemeProvider.tsx (sötét/világos) · typography.ts
  components/
    primitives/ Button, Field, Toggle, Slider, Stepper, SegmentedControl, Chip, Pill, IconTile, Card
    composite/  NavBar, MenuCard, ListRow, SectionRow, SettingsRow, StatCard, ProgressTrack, BigNum, UpcomingRow
    viz/        TypeSchematic, OverlapSchematic, Timeline, DivergingBar, WatchFace, ScanView, BTButton, BrandMark, Legend
  screens/
    home/ races/ sections/ run/ practice/ history/ settings/ help/
  navigation/   RootNavigator.tsx (native stack header-es; külön headerless csoport a futás-nézeteknek)
  domain/       models.ts (Race, Section, SectionType=normal|shared|overlap) · store (állapot)
  audio/        engine.ts (WAV generálás + ütemezett lejátszás) · latency.ts (BT offset)
  ble/          button.ts (média-HID / BLE gomb bemenet)
  i18n/         hu, en, de, sk, it
  native/       watch/ (WatchConnectivity / Wear OS bridge)
  assets/       fonts/ (Hanken Grotesk, JetBrains Mono) · icons (app-ikon az icon/-ból)
```

Ikonok: `phosphor-react-native` (regular). Használt nevek a CLAUDE_CODE.md §6-ban; szakasztípus-ikonok: `arrow-right` (normál), `link-simple` (közös kapu), `arrows-split` (átfedő).

---

## 5. Eldöntött pontok (tisztázva)

1. **Onboarding / BT-párosítás → CSAK A BEÁLLÍTÁSOKBÓL.** Nincs külön onboarding/első-indítás flow. A párosítás a Beállítások képernyőről indul (a „Bluetooth gomb" / „Bluetooth füles" sor rendszer-/párosító párbeszédet nyit). A Főképernyő „Készen állsz" kártyája az aktuális kapcsolat-állapotot tükrözi (kész / nincs eszköz).
2. **Terminológia → „FELADAT" mindenhol.** Egységesen „feladat" minden képernyőn (a futás-chip már így van). A `TickMate_Spec_v1.0.md` és `CLAUDE_CODE.md` „szakasz" előfordulásait ehhez kell igazítani a build során. (A „kapu" marad kapu.)
3. **Világos mód → MINDKÉT MÓD AZONNAL.** Minden komponens sötét+világos témában. Mivel az `Explorations` elvetett irány (más betűk/accentek), a világos palettát a sötét tokenekből **vezetjük le** — lásd §6.
4. **Hangmotor → A UI UTÁN.** Előbb a teljes vizuális réteg + navigáció állóképes (placeholder/egyszerű hanggal), az audio motor (8 ms kattanások + ütemezett WAV + BT-offset) utána, külön mérföldkőként.

### Megmaradó technikai jegyzetek
- **Státuszsor (9:41 + akku):** mock; valós eszközön `SafeAreaView` + valódi rendszer-státuszsor.
- **Példányadatok placeholderek** (versenynevek, idők) — valós adatmodellel.
- **Hangfájlok nincsenek** a csomagban — a hangmotor állítja elő (Spec §8).

---

## 6. Világos mód — levezetett paletta (JÓVÁHAGYVA)

> Az `Explorations` világos képernyői **nem** használhatók forrásként (más fontok: Archivo/Barlow/Space Grotesk; más accentek: borostyán/lime). A végleges rendszer csak sötétben létezik, ezért a lentit a sötét tokenekből vezettem le: **azonos zöld accent, invertált felületek**, AA-kontrasztra hangolva.

| Token | Sötét (kész) | Világos (javasolt) | Indok |
| --- | --- | --- | --- |
| `bg` | `#13151A` | `#F4F6F4` | hűvös-semleges off-white |
| `surface` | `#1B1E23` | `#FFFFFF` | emelt felület (kártya) |
| `surface2` | `#23272E` | `#E9EDE9` | chip/input |
| `railAlt` | `#2A2F36` | `#D8DDD8` | kapcsoló-/slider-sín |
| `textPrimary` | `#E9ECE9` | `#16191C` | invertált |
| `textSecondary` | `#8A938D` | `#5B635D` | AA a világos bg-n |
| `monoSecondary` | `#C3CCC6` | `#434A45` | számok másodlagos |
| `accent` | `#4FB98A` | `#4FB98A` | **változatlan** (fill-re jó) |
| `accentText` (szöveg/ikon zöldben) | `#4FB98A` | `#2C5F49` | világos bg-n a sötétebb zöld kell az AA-hoz |
| `onAccent` | `#0F1113` | `#0F1113` | sötét szöveg zöld gombon |
| `readyBg` / `readyBorder` | `#15241D` / `rgba(79,185,138,.22)` | `#E4F3EB` / `rgba(44,95,73,.28)` | „Készen állsz" kártya |
| `slower` | `#CAA24A` | `#9A7521` | elemzés-sárga, sötétítve a kontraszthoz |
| `divider` | `rgba(255,255,255,.06)` | `rgba(0,0,0,.08)` | |
| `numBright` | `#F1F4F1` | `#16191C` | nagy számok |

→ A téma-réteg (`theme/tokens.ts`) ezt a két készletet exportálja egy közös típus mögött; a komponensek csak szemantikus token-neveket használnak (`colors.surface`, `colors.accentText`), így a váltás egyetlen provideren múlik.
```
