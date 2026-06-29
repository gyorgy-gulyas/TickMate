# TickMate — Funkcionális specifikáció v1.0

> Átdolgozott, kibővített változat. Alap: *OldTimer Assistant PRD v0.1*.
> A v0.1 óta hozzáadott funkciók és a kétfázisú ütemterv ebben a dokumentumban szerepelnek.
> Verzió: 1.0 · Dátum: 2026.06 · Platform: iOS + Android (React Native)

---

## 1. Cél

A **TickMate** célja, hogy a magyarországi oldtimer ügyességi versenyeken a versenyző számára **hangalapú időzítési segítséget** nyújtson.

Az alkalmazás:
* nem hivatalos időmérő rendszer;
* nem kommunikál a verseny fotocelláival;
* nem méri a hivatalos eredményt;
* kizárólag a versenyző segítésére szolgál.

Elsődleges cél: a vezető **minimális vizuális figyelemmel**, szinte kizárólag **hangjelzések** alapján tudja teljesíteni a feladatokat.

## 2. Név és márka

* **Név:** TickMate — „tick" (a kattanások / időmérés) + „mate" (társ a versenyben).
* **Szóvédjegy:** **Tick** fehér/elsődleges szín + **Mate** zöld (`#4FB98A`), Hanken Grotesk 800.
* **Logo / app-ikon:** vonalas **stopperóra** (korona-gomb, oldalgomb, mutató). Zöld jel sötét alapon (elsődleges) vagy sötét jel zöld alapon (alternatív). Fájlok: `icon/` mappa, koncepciók: `design/TickMate Logo.dc.html`.

## 3. Célközönség

* egyedül versenyző oldtimer pilóták (elsődleges);
* navigátorral versenyző párosok.

## 4. Alapelvek

* A telefon végig a tartóban marad.
* A kezelést egy fizikai **Bluetooth gomb** végzi.
* A vezető **Bluetooth fülhallgatót** használ.
* A kijelző csak másodlagos információforrás; nagy kontraszt, nagy tipográfia.
* Az elsődleges kommunikáció **hangjelzésekkel** történik.
* Tervezési elvek: ne kelljen a kijelzőt nézni; egyetlen gombbal kezelhető; ösztönösen érthető hangjelzések; legkisebb reakcióidő; egyszerű, gyors, megbízható.

## 5. Verseny- és szakaszmodell

Egy verseny **szakaszok** sorozata. Szakasz mezői:
* **név**
* **típus** (lásd 6.)
* opcionális **távolság** (m)
* **előkészítési idő** (mp)
* **szakasz / teljesítési idő** (mp)
* opcionális **megjegyzés**

A verseny során a rendszer automatikusan halad a szakaszok között.

## 6. Szakasztípusok

1. **Normál** — egy szakasz, két kapu. Folyamat: `Gomb → előkészítés → START kapu → szakasz → CÉL kapu`.
2. **Egymást követő / közös kapu** — az egyik szakasz CÉL kapuja egyúttal a következő START kapuja; a rendszer **automatikusan vált**.
3. **Átfedő** — két (vagy több) szakasz időzítése **egyszerre aktív**; a rendszer több párhuzamos időzítőt kezel.

A típusokat az app **rajzos sémával** és típus-ikonokkal mutatja be (idővonal-szerű ábra kapukkal és időközökkel).

## 7. Kezelés

Elsődleges vezérlés a **Bluetooth gombbal**:
* Start
* Következő szakasz
* Visszalépés
* Megszakítás
* Gyakorló mód indítása

Másodlagos: a kijelző érintése; opcionálisan az **okosóra** mint vezérlő (lásd 11.).

## 8. Hangrendszer (Sound Profile v1)

* **Induló hang:** a gomb megnyomásakor külön, jól felismerhető hang.
* **Másodperc jelző:** minden egész másodpercben rövid mechanikus kattanás — 8 ms, száraz, jól elkülöníthető (ki-/bekapcsolható).
* **Kapu visszaszámlálás:** a kapu előtt 3 mp-cel automatikusan indul, gyorsuló ritmusban:
  `3.00, 2.00, 1.50, 1.00, 0.75, 0.50, 0.35, 0.25, 0.15, 0.08, 0.00`
  minden jel 8 ms, azonos hangmagasság, éles hang; csak az időközök változnak.
* A hangsor a szakaszok **mentése után előre generálódik** (WAV), hogy a Start ne késsen.
* Referencia: `oldtimer_full_section_8ms.wav` (nem mellékelt).

## 9. Kijelző (futás közben)

Minimalista, ránézős felület. Megjelenített adatok: aktuális szakasz, távolság, előkészítési idő, szakasz idő, következő kapu, hátralévő idő. Nagy betűméret.

Futás-nézetek: **készenlét**, **normál (aktív)** vízszintes haladásjelzővel, **közös kapu** (automatikus váltás), **átfedő** (két egyidejű időzítő — elsődleges nagy + másodlagos kisebb számláló).

## 10. Funkciók (v1 — megvalósítandó)

### 10.1 Verseny- és szakaszkezelés
* Verseny létrehozása, szerkesztése, törlése.
* Szakaszok felvitele: név, típus, távolság, előkészítés, szakasz, megjegyzés; **élő séma-előnézet**.
* Teljes verseny előre felvihető; lista típus-ikonokkal és `5 / 7 mp` (előkészítés / szakasz) értékekkel.

### 10.2 Szakasz felvétele fotóból (képfelismerés) — ÚJ
* A roadbook **lefotózása** → a mezők (név, távolság, előkészítés, szakasz) **automatikus kitöltése**.
* A felismert értékek mindig **szerkeszthetők**; az alacsony megbízhatóságú mezőket jelölni kell.
* Hatókör: **egyetlen szakasz** felvétele. (A teljes, tömeges roadbook-import a 2. fázis — lásd 13.)
* Technika: on-device OCR / dokumentum-szövegfelismerés (pl. ML Kit / Vision).

### 10.3 Gyors feladat
* Mentés nélküli, azonnali időzítés (előkészítés + szakasz idő + másodpercjelző kapcsoló). A hang azonnal elkészül a Start előtt.

### 10.4 Gyakorló mód
* Reakcióidő, hangritmus, teljes feladatsor végigjátszása, saját feladat létrehozása.

### 10.5 Bluetooth-késleltetés kalibráció + hang-előnézet — ÚJ
* A fülhallgató audio-késleltetésének **mérése és kompenzálása** (ms-ban tárolt offset, a hangsor időzítéséhez adva).
* Mért érték + **kézi korrekció** (stepper) + **automatikus mérés** + **teszt hang** lejátszása.

### 10.6 Okosóra-kísérő (Apple Watch / Wear OS) — ÚJ
* Néma, **rezgő visszaszámlálás** a hang mellé/helyett (hangos autóban).
* **Óra mint vezérlő** (start/stop a csuklóról), haptika erőssége állítható.
* Csuklós számlap: fázis + nagy szám + rezgés-állapot.

### 10.7 Futás utáni elemzés — ÚJ
* Elért vs. cél idők összevetése **szakaszonként** (kétirányú eltérés-diagram: gyorsabb = zöld, lassabb = `#CAA24A`).
* Átlagos eltérés, legjobb szakasz. Elérés: History · részletek → „Elemzés".

### 10.8 History / naplózás
* Minden esemény naplózása: gombnyomások, szakasz indítás/befejezés, megszakítások. Visszajátszhatóság.
* Korábbi futások listája + részletek (mért idők, megjegyzés, elemzés).

### 10.9 Súgó — ÚJ
* Önálló Súgó képernyő: „Gyors kezdés" lépések, GYIK, kapcsolat.
* **Kontextusfüggő `?` ikon** a fejlécben minden olyan képernyőn, ahol értelme van (Verseny részletei, Szakasz típusok/szerkesztő, Gyors feladat, Gyakorló mód, Beállítások, Idővonal, Bluetooth késleltetés, Okosóra, Elemzés, Szakasz fotóból). Egyszerű listákon és a futás-képernyőkön nincs.

### 10.10 Beállítások
* Bluetooth gomb, Bluetooth füles, **Bluetooth késleltetés**, **Okosóra**, hangerő, hangprofil, **nyelv**, másodpercjelző, **sötét/világos mód**.

### 10.11 Nyelv — ÚJ
* Nyelvválasztó (Magyar, English, Deutsch, Slovenčina, Italiano). A **hangjelzések nyelvfüggetlenek**; csak a felirat változik.

### 10.12 Sötét / világos mód
* Alapértelmezett a **sötét** mód (vezetéshez). **Világos mód** napfényhez (PRD §10). Ugyanaz a zöld accent, invertált felület.

## 11. Képernyők (21 db) — a design fájlban

Kezelés/lista: Főképernyő · Versenyek · Verseny részletei · Szakasz típusok · Szakasz szerkesztő · Szakasz fotóból · Gyors feladat · Gyakorló mód · Beállítások · Nyelv · Bluetooth késleltetés · Okosóra · Súgó.
Futás: Készenlét · Normál · Közös kapu · Átfedő (2 aktív).
Előzmény/elemzés: Szakaszok idővonala · History · History részletek · Futás elemzés.

> Részletes képernyőleírások, layout és design-tokenek: lásd `CLAUDE_CODE.md`.

## 12. Állapotmodell (vázlat)

* Verseny-lista; kiválasztott verseny; szakaszok tömbje (név, típus, távolság, előkészítés, szakasz, megjegyzés).
* Generált hang státusza versenyenként (nincs / generálás / kész).
* Futási állapot: aktuális szakasz index, fázis (előkészítés/szakasz), hátralévő idő(k) — átfedőnél több párhuzamos időzítő; eseménynapló.
* Beállítások: BT gomb, BT füles, BT késleltetés-offset, okosóra, hangerő, hangprofil, nyelv, másodpercjelző, téma.

## 13. Ütemterv (fázisok)

**1. fázis (ez a kör — megtervezve):** teljes verseny-/szakaszkezelés, szakasztípusok + séma, **szakasz fotóból (egy szakasz)**, gyors feladat, gyakorló mód, futás-nézetek, **BT-késleltetés kalibráció**, **okosóra-kísérő**, **futás-elemzés**, history, **súgó**, **nyelv**, sötét/világos mód.

**2. fázis (később — felhős / prémium „felsős" szint):**
* **Tömeges roadbook / itinerárium import** (teljes verseny egyszerre: CSV / QR / több oldal).
* **Szakasz-készlet megosztása** más versenyzőkkel (QR / link).
* Minden **közösségi / felhős** funkció (fiók, szinkron, megosztás).
* Jövőbeli (PRD §14): több / saját hangprofil, CarPlay információs nézet, részletesebb statisztikák.

## 14. Tervezési alapelvek (ismétlés)

Vezetés közben ne kelljen a kijelzőt figyelni; egyetlen Bluetooth gombbal kezelhető; ösztönösen érthető hangjelzések; legkisebb reakcióidő; egyszerű, gyors, megbízható. A cél nem általános stopper, hanem a magyar oldtimer ügyességi versenyekre szabott digitális versenyasszisztens.
