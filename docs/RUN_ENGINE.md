# Futás-motor — viselkedési terv (jóváhagyva)

> Mit csinál a futás vezérlése. Implementáció-független. Jóváhagyva: 2026-06-29.

## Alapelvek
- A telefon **nem időmérő**, nem kommunikál a kapukkal/fotocellákkal — az időt **a kapuk mérik**, velük nem vagyunk összekötve. Ez a feladat lényege.
- A **BT gomb egyetlen funkciója: START** (ugyanaz, mint a képernyős START). A megnyomását **nem naplózzuk**.
- A motor **csak hangot játszik és vizuálisan vezet**.
- **Valós idők: kézi** — a feladat végén helyben beírhatók (és/vagy utólag az **Eredmények** képernyőn).
- **Feladatok közti léptetés: csak a képernyős** „Következő feladat" gombbal.
- **Megszakítás → eldobás** (a befejezetlen futás nem rögzül).

## Folyamat (egy verseny futása)
1. **Verseny részletei → Start** → belépés a futásba az 1. feladatnál, KÉSZENLÉT.
2. **KÉSZENLÉT:** feladat-adatok + nagy **START**. Vissza = kilépés (eldobás).
3. **START → a feladat hangja lefut.** Közben él a nézet:
   - fázis (ELŐKÉSZÍTÉS → SZAKASZ), nagy számláló a következő kapuig, progress;
   - a hang vezet (ketyegés → gyorsuló + emelkedő visszaszámlálás → éles végkattanás);
   - fonódó/átfedőnél a párhuzamosan aktív szakaszok külön számlálóval.
4. **Hang vége (feladat kész):** beírható a **valós idő** (szegmensenként, a cél referenciaként) + **„Következő feladat"** gomb → a következő feladat KÉSZENLÉTére.
5. Ismétlés minden feladatra. Az utolsó után **BEFEJEZVE** → az addig beírt idők a verseny **Run**-jába mentődnek → „Eredmény megtekintése" (az **Eredmények** képernyő).
6. **Megszakítás** (vissza) bármikor → eldobás (a beírt idők nem mentődnek, amíg nincs Befejezve).

## Állapotgép
`KÉSZENLÉT → (START) → FUT (hang) → (hang vége) FELADAT KÉSZ (idő + Következő) → köv. KÉSZENLÉT … → BEFEJEZVE (mentés)`
Bármikor: **MEGSZAKÍTÁS → eldobás**.

## Idő + hang
STARTkor a (már legenerált) feladat-hang teljes idővonala elindul; a vizuális számláló a START időpontjától számol, így a hanggal együtt fut. A kijelző másodlagos — a hang a fő vezető.
A futás-sávokon a **szakaszhatárok** (kapuk) tömör jelölők, az audió **gyorsuló ütemei** pedig halvány, vékony vonalak — a `data/timing.ts` `COUNTDOWN_OFFSETS` közös forrásából, így a kép és a hang garantáltan együtt marad.

## Kapcsolat az eredménnyel
A futás végigjátszása a verseny **egyetlen Run-ját** tölti (ugyanaz a modell). A Befejezéskor a beírt idők bekerülnek. A RaceDetail **„Eredmények"** gombja ugyanezt a Run-t nyitja az **Eredmények** (Result) képernyőn — ez az egységes hely a valós idők szerkesztésére, az **élő elemzésre** (átl. / szakaszonkénti eltérés) és a **megjegyzésre**. (A korábbi külön History / History-részletek / Elemzés képernyők megszűntek — összevonás: 2026-06-30.)

## Nyitott / későbbi
- Fonódó/átfedő: a **B szakasz kezdési időpontja** nincs az adatmodellben → közelítjük (fonódó: B az A közepén; átfedő: B az A felénél). Ha pontosítjuk, felvehetünk egy „B kezdése" mezőt.
- Gyors feladatból indított futás (egy-feladatos) — később.
