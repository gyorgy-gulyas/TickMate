# Hangritmus — viselkedési terv (jóváhagyva)

> A „Gyakorló mód → Hangritmus" viselkedése. Implementáció-független. Jóváhagyva: 2026-06-30.

## Cél
A **reakció ellentéte**. A reakciónál egy *váratlan* jelre kell *minél gyorsabban* reagálni; itt a visszaszámlálás **kiszámítható** (hallod, ahogy gyorsul a kapu felé), és pontosan a **kapu pillanatában** (a durva végkattanáskor) kell nyomnod — se korábban, se később. A valós verseny készsége: a vezető a gyorsuló ütemre ráérez, és a célkapun pont a kattanáskor halad át.

## Döntések (2026-06-30)
- **Szett:** fix **3 kör** + összegzés.
- **Két szint** (a készenléti képernyőn választható):
  - **Vezetett** — a végkattanás is szól, vele együtt nyomsz (ritmus-építő, könnyebb).
  - **Néma** — az utolsó kattanás **néma**; oda kell nyomnod, ahol lenne (az igazi „megszokás"-próba).
- **Mért érték:** **előjeles ±ms**, **csak vizuálisan** (nincs hallható felfedés nyomás után).
- **Mentés:** nincs — **csak az aktuális szett**.

## Mit hallasz
A **valós** kapu-visszaszámlálást játsszuk egyetlen cél-pillanatba: a `data/timing.ts` `COUNTDOWN_OFFSETS` sora (3.00→0.00), emelkedő hangmagasságú gyorsuló kattanások, a végén (a választott szinttől függően) a durva végkattanás = a cél. Ugyanaz a szintézis, mint futás közben (`audio/buildTask.ts` → `buildCountdownPCM`).

## Mit mérünk
**Előjeles hiba** (±ms) a cél-pillanathoz képest: **korai** (−) / **késő** (+). Az |hiba| adja a pontszámot; az átlagos előjel a **torzítás** (rendszeresen korán vagy későn nyomsz-e).

## Állapotgép
`KÉSZENLÉT (szint) → (Kezdés) FUT (gyorsuló ütem) → [cél pillanat] → (nyom) EREDMÉNY (±ms) → … 3× → ÖSSZEGZÉS`
- Színkód: |hiba| < ~60 ms „pontos" (zöld) · < ~150 ms „jó" · efölött korai/késő (sárga).
- **Tisztességesség:** a cél-pillanat körönként véletlen (3,5–5,5 mp), így a bevezető hossza változik — a *ritmusra* kell ráérezni, nem másodperceket számolni.
- Ha a célnál nem nyomsz (~1,2 mp türelmi idő), a kör automatikusan „késő"-ként zárul.
- **Összegzés:** átlagos |hiba|, legjobb, **torzítás** (átl. előjel → korán/későn/kiegyensúlyozott), a 3 próbálkozás csíkban.

## Vizuál (a futás-nézet nyelvén)
Egy sáv telik a cél felé, rajta a **gyorsuló ütem-vonalak** (halvány) és a **KAPU**-jelölő (tömör); a kitöltés a nyomásodig nő, ott megfagy és a hiba szerint színeződik — a KAPU-jelölőhöz képesti rés mutatja, mennyit tévedtél.

## Audio-first (dokkolt telefon)
A lényeg a hang; a kijelző másodlagos. (A nyomás utáni **hallható** felfedés most szándékosan nincs — későbbi opció a dokkolt, eyes-free használathoz.)

## Nyitott / későbbi
- Nyomás utáni **hallható** cél-felfedés (a két hang közti rés hallhatóvá teszi a hibát).
- BT-késleltetés offset beépítése valós eszközön.
- Perzisztens rekord / előzmény (most session-only).
