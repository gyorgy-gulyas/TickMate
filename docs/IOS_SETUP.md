# iOS build & test — Mac nélkül (felhő + valódi iPhone)

> Cél: a TickMate iPhone-on fusson, **Mac nélkül**. A fordítás felhő-Macen
> (Codemagic) megy, a futás a saját iPhone-odon. Simulator nem kell.

## A lényeg dióhéjban
1. **Codemagic** (felhő-Mac) lefordítja + aláírja az appot → `.ipa`.
2. Az `.ipa` felkerül a telefonodra **TestFlighttel** (OTA) vagy **Ad Hoc** linkről.
3. A buildet Windowsról indítod (git push vagy „Start new build" a Codemagic UI-ban).

## Mit igényel (fiókok)
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
