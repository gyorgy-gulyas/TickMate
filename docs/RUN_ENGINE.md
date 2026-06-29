# Futás-motor — viselkedési terv (jóváhagyva)

> Mit csinál a futás vezérlése. Implementáció-független. Jóváhagyva: 2026-06-29.

## Alapelvek
- A telefon **nem időmérő**, nem kommunikál a kapukkal/fotocellákkal — az időt **a kapuk mérik**, velük nem vagyunk összekötve. Ez a feladat lényege.
- A **BT gomb egyetlen funkciója: START** (ugyanaz, mint a képernyős START). A megnyomását **nem naplózzuk**.
- A motor **csak hangot játszik és vizuálisan vezet**.
- **Valós idők: kézi** — a feladat végén helyben beírhatók (és/vagy utólag az Eredmény-szerkesztőben).
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
5. Ismétlés minden feladatra. Az utolsó után **BEFEJEZVE** → az addig beírt idők a verseny **Run**-jába mentődnek → „Eredmény megtekintése".
6. **Megszakítás** (vissza) bármikor → eldobás (a beírt idők nem mentődnek, amíg nincs Befejezve).

## Állapotgép
`KÉSZENLÉT → (START) → FUT (hang) → (hang vége) FELADAT KÉSZ (idő + Következő) → köv. KÉSZENLÉT … → BEFEJEZVE (mentés)`
Bármikor: **MEGSZAKÍTÁS → eldobás**.

## Idő + hang
STARTkor a (már legenerált) feladat-hang teljes idővonala elindul; a vizuális számláló a START időpontjától számol, így a hanggal együtt fut. A kijelző másodlagos — a hang a fő vezető.

## Kapcsolat az eredménnyel
A futás végigjátszása a verseny **egyetlen Run-ját** tölti (ugyanaz a modell). A Befejezéskor a beírt idők bekerülnek; a RaceDetail „Eredmény szerkesztése" marad az utólagos/javító út.

## Nyitott / későbbi
- Fonódó/átfedő: a **B szakasz kezdési időpontja** nincs az adatmodellben → közelítjük (fonódó: B az A közepén; átfedő: B az A felénél). Ha pontosítjuk, felvehetünk egy „B kezdése" mezőt.
- Gyors feladatból indított futás (egy-feladatos) — később.
