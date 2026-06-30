# Reakcióidő — viselkedési terv (jóváhagyva)

> A „Gyakorló mód → Reakcióidő" viselkedése. Implementáció-független. Jóváhagyva: 2026-06-30.

## Cél
Tiszta **reakció-latencia** edzése: milyen gyorsan reagálsz egy **váratlan** indító jelre (ms-ben). Szándékosan más, mint a „Hangritmus" (az a visszaszámlálás *megérzése*/pontossága lesz). A kulcs a kiszámíthatatlanság — nem lehet előre nyomni.

## Döntések (2026-06-30)
- **Szett:** fix **3 kör** + összegzés.
- **Mért érték:** **nyers** ms (a jel és a gombnyomás közti teljes idő; nincs BT-offset korrekció).
- **Mentés:** nincs — **csak az aktuális szett** (semmi nem perzisztálódik).
- **Léptetés:** automatikus a következő körre rövid szünettel.

## Bemenet — egy gomb
A valós eszközhöz hűen **egyetlen** input: a Bluetooth START gomb (weben koppintás bárhova). Ugyanaz a nyomás a fázistól függően jelent mást. A mérés a **press-down** pillanatában történik (`onPressIn`).

## Állapotgép
`KÉSZENLÉT → (nyom) VÁRAKOZÁS(véletlen csend) → JEL → (nyom) EREDMÉNY → … 3× → ÖSSZEGZÉS`

1. **KÉSZENLÉT** — instrukció; nyomásra indul a szett (1. kör).
2. **VÁRAKOZÁS** — véletlen csendes késleltetés (1,5–4,0 mp); induláskor halk „felkészülés" hang.
   - Itt nyomsz → **TÚL KORAI** (hibás rajt): a kör érvénytelen, **ugyanaz a kör** új véletlen késleltetéssel újraindul; a hibás rajt számolódik.
3. **JEL** — a késleltetés végén éles **hang** (a kapuknál is használt durva végkattanás) + a háttér zöldre vált („MOST!"). Innen indul a reakció-óra.
4. **EREDMÉNY** — nyomásra: reakció = nyomás − jel (ms), nagy számként színkóddal (< 250 kiváló · 250–350 jó · > 350 lassú); halk megerősítő kattanás; rövid szünet után auto-léptetés.
5. **ÖSSZEGZÉS** (3 kör után) — átlag + legjobb, a 3 próbálkozás csíkban, hibás rajtok száma; „Újra" / „Vissza".

## Audio-first (dokkolt telefon)
Végig használható kijelző nélkül is: felkészülés-hang → csend → éles kattanás → nyomás → megerősítő kattanás. A ms a kijelzőn marad átnézésre.

## Nyitott / későbbi
- **BT-offset korrekció**: valós eszközön a mért érték tartalmazza a rendszer/BT késleltetést — opcionálisan levonható a beállított offset (most: nyers).
- **Perzisztens rekord / előzmény**: most szándékosan nincs; később bővíthető személyes rekorddal.
- **Hangritmus** mód (a visszaszámlálás megérzése, előjeles eltérés) — külön gyakorlat.
