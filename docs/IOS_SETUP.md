# iOS build & test — Mac nélkül (felhő + valódi iPhone)

> Cél: a TickMate iPhone-on fusson, **Mac nélkül**. A fordítás felhő-Macen
> (Codemagic) megy, a futás a saját iPhone-odon. Simulator nem kell.

## A lényeg dióhéjban
1. **Codemagic** (felhő-Mac) lefordítja + aláírja az appot → `.ipa`.
2. Az `.ipa` felkerül a telefonodra **TestFlighttel** (OTA) vagy **Ad Hoc** linkről.
3. A buildet Windowsról indítod (git push vagy „Start new build" a Codemagic UI-ban).

## Ingyenes út (most ezt próbáljuk) — Codemagic + Sideloadly

Így **nem kell fizetős fiók**: a Codemagic aláírás nélküli `.ipa`-t épít (Apple fiók
nélkül), és a telefonra a **Sideloadly** teszi fel a **saját ingyenes Apple ID**-ddal.
Korlátok: az app **7 naponta lejár** (újratelepítés), egyszerre max. 3 sideloadolt app.

### 1) Unsigned `.ipa` építése a felhőben (Apple fiók nélkül)
1. Regisztrálj a **codemagic.io**-n (ingyenes), *Add application* → ez a GitHub repo.
2. Indítsd az **`ios-unsigned`** workflow-t (a `codemagic.yaml`-ban van; nem kér semmi
   aláírást/Apple-fiókot).
3. Ha kész, az *Artifacts*-ból töltsd le a **`TickMate-unsigned.ipa`**-t a Windows gépedre.

### 2) Windows előkészítés
- Telepítsd az **iTunes**-t és az **iCloud**-ot az **apple.com**-ról (a `.exe` verziót,
  **NE** a Microsoft Store-ból) — ezek hozzák az iPhone-illesztőt.
- Töltsd le a **Sideloadly**-t: **sideloadly.io** → telepítsd.

### 3) Telepítés a telefonra (Sideloadly)
1. Csatlakoztasd az iPhone-t USB-vel, oldd fel, és a telefonon **„Trust / Megbízom"**.
2. Nyisd meg a Sideloadly-t → húzd rá a `TickMate-unsigned.ipa`-t.
3. Írd be az **Apple ID**-det (ingyenes is jó). Ha be van kapcsolva a kétlépcsős
   azonosítás, hozz létre egy **app-specifikus jelszót** (appleid.apple.com → *Sign-In and
   Security → App-Specific Passwords*), és azt add meg.
4. **Start** → aláírja + felteszi.
5. A telefonon: **Beállítások → Általános → VPN és eszközkezelés** → a saját Apple ID
   fejlesztői profilját **megbízhatóvá** teszed.
6. Indítsd a **TickMate**-et. 🎉

### 4) 7 nap múlva
Az ingyenes aláírás lejár → **futtasd újra a Sideloadly-t** ugyanígy (a felhő-buildet nem
kell újra, elég a meglévő `.ipa`).

> **Auto-frissítés kényelmesen:** a Sideloadly helyett/mellett használhatod az **AltStore**-t
> (altstore.io): telepíted az **AltServer**-t Windowsra (iTunes+iCloud kell hozzá), a telefonra
> az AltStore appot, és az **7 naponta magától újrahitelesít**, amíg a gép + telefon egy WiFi-n
> van. Ugyanazt az `.ipa`-t eszi.

### Ha az app hangos és működik → jöhet a fizetős fiók
Ha az ingyenes úton minden jó (hang, OCR, futás), akkor éri meg a **$99/év** Apple Developer,
amivel a lejárat/7-nap gond megszűnik (**TestFlight** vagy **Ad Hoc** — lásd lent).

---

## Mit igényel (fiókok) — a fizetős út
- **Apple Developer Program — $99/év.** Mac nélkül ez **kell**: mind a TestFlight,
  mind az Ad Hoc aláírás fizetős fiókhoz kötött. (Ingyenes fiók csak Macen, Xcode-ból,
  7 napig telepítene — nálunk nincs Mac.)
  - *Ingyenes kiskapu:* **AltStore** (Windows AltServer + ingyenes Apple ID) sideloadolja
    a felhőben épített `.ipa`-t, de **7 naponta** újra kell hitelesíteni. Macerős; a `.ipa`-t
    így is a Codemagic építi.
- **Codemagic-fiók** (van ingyen keret — ehhez a projekthez bőven elég).

## Egyszeri beállítás
1. **Codemagic** → *Add application* → válaszd ezt a GitHub repót.
2. **App Store Connect API-kulcs**: Apple Developer → *Users and Access → Integrations →
   App Store Connect API* → **Generate key** (App Manager szerep). Töltsd le a `.p8`-at,
   jegyezd fel a **Key ID**-t és **Issuer ID**-t.
3. Codemagic → *Teams → Integrations → App Store Connect* → add hozzá a kulcsot.
4. Codemagic → a projekt *Environment variables* → hozz létre egy **`appstore`** csoportot,
   és tedd bele (a `codemagic.yaml` erre hivatkozik): az App Store Connect kulcsot és az
   `APPLE_TEAM_ID`-t (Apple Developer → Membership).
5. Válassz **bundle id**-t (pl. `com.sajatnev.tickmate`), és:
   - írd be a `codemagic.yaml` `BUNDLE_ID` mezőjébe,
   - App Store Connect → *Apps* → **+ New App** ugyanezzel a bundle id-vel.

## Fordítás + telepítés
- **TestFlight (ajánlott, OTA):** a `codemagic.yaml` alapból ezt csinálja
  (`submit_to_testflight: true`). Build után az iPhone-odon a **TestFlight** appból
  telepíted. (Első alkalommal add magad tesztelőként App Store Connectben.)
- **Ad Hoc (TestFlight nélkül, „sima telepítés"):**
  - App Store Connect → *Devices* → **regisztráld az iPhone UDID-jét**.
  - `codemagic.yaml`: a signing lépésben a `--type IOS_APP_ADHOC` sort használd, és
    **töröld a `publishing:` blokkot**.
  - Build után töltsd le a `.ipa`-t az *artifacts*-ból, és telepítsd: Apple Configurator,
    letöltő-link (pl. Diawi), vagy AltStore.

## Ami már kész a repóban
- **iOS natív hang** — `ios/TmNative/TmAudio.swift` (`AVAudioEngine`, alacsony késleltetés),
  ugyanaz a `play(base64Pcm, sampleRate)` interfész, mint Androidon → **nem néma** az app.
- **iOS BT-státusz** — `ios/TmNative/TmBluetooth.swift` (a füles az `AVAudioSession`
  route-ból; gomb/óra egyelőre „nincs párosítva").
- **Lokális pod** (`ios/TmNative/TmNative.podspec`) + Podfile-bejegyzés → a `pod install`
  behúzza (nincs kézi `.xcodeproj` piszkálás).
- **OCR/kép** — az `@react-native-ml-kit/text-recognition` és a `react-native-image-picker`
  iOS-képes; az `Info.plist`-ben ott a kamera + fotó engedély-szöveg.

## Ha az első felhő-build elhasal
Nem tudom itt (Windowson) lefordítani, ezért a végső build a felhőben dől el. Ha hibázik:
- **`TmBluetooth.swift` fordítási hiba** (pl. `import React` promise-típusok): **töröld a
  `TmBluetooth.swift` + `TmBluetooth.m` fájlokat** és buildelj újra — a hang így is megy,
  csak iOS-en minden eszköz „nincs párosítva" lesz.
- **Deployment target eltérés** a podspecben: állítsd az `ios/TmNative/TmNative.podspec`
  `s.platform = :ios, "15.1"` sorát az app értékére (Xcode → target → Minimum Deployments).
- **Aláírási hiba**: ellenőrizd a bundle id egyezését (yaml ↔ App Store Connect) és az
  API-kulcs jogosultságát.

## Ami iOS-en még hátravan (később)
- A gomb/óra BT-státusz és -késleltetés valódi bekötése (Android-nal együtt halad).
- Finomhangolás valós eszközön (hang-latencia kalibrálás iPhone-on).
