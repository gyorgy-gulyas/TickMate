# Android környezet beüzemelése (Windows)

> Cél: a TickMate (bare React Native **0.86**) **valódi Android eszközön / emulátoron** fusson.
> A `web` előnézethez ez NEM kell — csak az Android buildhez.

A projekt elvárt verziói (`android/build.gradle`):

| Eszköz | Verzió |
| --- | --- |
| Node.js | **≥ 22.11** (LTS 22 ajánlott) |
| JDK | **17** (Temurin vagy az Android Studio beépített JBR-je) |
| Android SDK Platform | **API 36** (Android 16) — `compileSdk`/`targetSdk = 36`, `minSdk = 24` |
| Build-Tools | **36.0.0** |
| NDK | **27.1.12297006** |
| Gradle (wrapper) | 9.3.1 (a `gradlew` automatikusan letölti) |

---

## 1. Node.js
A RN 0.86 friss Node-ot igényel. Telepíts **Node 22 LTS**-t (a korábbi 20.15 kevés volt).
Ellenőrzés: `node -v` → `v22.x`.

## 2. JDK 17
Két út:
- **Egyszerű:** használd az Android Studio beépített JDK-ját (JBR 17). Telepítés után a `JAVA_HOME` mutasson ide:
  `C:\Program Files\Android\Android Studio\jbr`
- **Vagy** telepíts külön **Eclipse Temurin JDK 17**-et (adoptium.net), és a `JAVA_HOME` arra mutasson.

Ellenőrzés: `java -version` → `17.x`.

## 3. Android Studio + SDK
1. Töltsd le és telepítsd az **Android Studio**-t (legújabb stabil).
2. Első indításkor a varázsló feltelepíti az alap SDK-t. Utána: **Settings → Languages & Frameworks → Android SDK** (vagy a *More Actions → SDK Manager*).
3. **SDK Platforms** fül → pipáld be: **Android 16.0 (API 36)**.
4. **SDK Tools** fül → kapcsold be a „Show Package Details"-t, és válaszd ki pontosan:
   - **Android SDK Build-Tools** → **36.0.0**
   - **NDK (Side by side)** → **27.1.12297006**
   - **CMake** (a legújabb felajánlott)
   - **Android SDK Platform-Tools**
   - **Android Emulator** (ha emulátoron tesztelsz)
5. Apply → letölti.

Az SDK alapértelmezett helye:
`C:\Users\<felhasználó>\AppData\Local\Android\Sdk`

## 4. Környezeti változók (Windows)
Rendszer → *Környezeti változók* (vagy PowerShell-ben `setx`):

```
ANDROID_HOME = C:\Users\<felhasználó>\AppData\Local\Android\Sdk
JAVA_HOME    = C:\Program Files\Android\Android Studio\jbr   (vagy a Temurin 17 útja)
```

A **Path**-hoz add hozzá:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
```

Nyiss **új** terminált, hogy érvénybe lépjenek. Ellenőrzés:
`adb --version` és `emulator -list-avds`.

## 5. `android/local.properties`
A korábbi „SDK location not found" hibát ez oldja. Hozz létre egy
`android/local.properties` fájlt ezzel a sorral (a `\` escape-elve):

```
sdk.dir=C\:\\Users\\<felhasználó>\\AppData\\Local\\Android\\Sdk
```

*(Ha az `ANDROID_HOME` jól be van állítva, gyakran enélkül is megy — de ez a biztos.)*
Ez a fájl **nincs verziókövetve** (gépspecifikus).

## 6. Eszköz vagy emulátor
- **Emulátor:** Android Studio → *Device Manager* → *Create device* → pl. Pixel 7, rendszerkép **API 36**. Indítsd el.
- **Fizikai telefon:** kapcsold be a *Fejlesztői beállítások → USB hibakeresés*, csatlakoztasd USB-vel, engedélyezd a párosítást. `adb devices` listázza.

## 7. Futtatás (konzolból, önállóan)

> Az env változók (`ANDROID_HOME`, `JAVA_HOME`, `Path`) már be vannak állítva a
> regiszterben, ezért **egy friss terminál** automatikusan látja őket — nem kell
> semmit beállítani futtatás előtt. (Régi, már nyitott terminál még a régi
> változókat látja → nyiss újat.)

### a) Emulátor indítása
Vagy az Android Studio **Device Manager**-ből a ▶ gombbal, **vagy** konzolból:
```powershell
emulator -list-avds                       # melyik AVD-k vannak
emulator -avd pixel_6_pro_-_api_34        # indítás (új PowerShell-ablakban hagyd futni)
```
Várd meg, míg az emulátor teljesen elindul. Ellenőrzés:
```powershell
adb devices        # kell egy "emulator-5554   device" sor
```
(Fizikai telefon is jó USB-hibakereséssel — `adb devices` listázza.)

### b) Metro bundler — 1. terminál
A projekt gyökerében (`D:\Projects.OWN\TickMate`), hagyd futni:
```powershell
npm start
```

### c) Build + telepítés — 2. terminál
**Fontos:** a `npm run android` / `npx react-native run-android` ezen a Windows
gépen elhasal (`'gradlew.bat' is not recognized…`), ezért a Gradle wrappert
**közvetlenül** hívjuk az `android` mappából:
```powershell
cd D:\Projects.OWN\TickMate\android
.\gradlew.bat app:installDebug -PreactNativeDevServerPort=8081
```
Ez lefordítja és **felteszi** a debug APK-t a futó emulátorra/telefonra.

### d) App elindítása
A telepítés után jelenik meg a **TickMate** ikon az emulátoron — rákattintva indul,
és csatlakozik a Metróhoz. Vagy konzolból:
```powershell
adb shell am start -n com.tickmate/.MainActivity
```

Az **első** build lassú (Gradle 9.3.1 + függőségek letöltése, NDK/C++ fordítás —
több perc). Utána a Gradle daemon miatt gyors. Kódváltozás után elég a **c)** lépést
újrafuttatni (a Metro maradhat futva); csak JS-változásnál sokszor elég az emulátoron
**R, R** (reload).

---

## Hibaelhárítás
- **„SDK location not found"** → hiányzik az `ANDROID_HOME` vagy az `android/local.properties` (lásd 4–5.).
- **JDK-verzió hiba / „Unsupported class file major version"** → nem JDK 17 fut; állítsd a `JAVA_HOME`-ot 17-re.
- **`adb` nem található** → a `platform-tools` nincs a Path-ban (4.).
- **Node-verzió figyelmeztetés** → frissíts Node 22-re.
- **`'gradlew.bat' is not recognized…`** (a `npm run android` hibája Windowson) → ne a CLI-t használd, hanem közvetlenül a wrappert: `cd android` majd `.\gradlew.bat app:installDebug` (lásd 7/c).
- **„Another process is running on port 8081" kérdés** a `npm run android`-nál → már fut a Metro; a közvetlen `gradlew app:installDebug` úton ez a kérdés fel sem jön.
- **Metro port (8081) foglalt** → `npx react-native start --reset-cache`, vagy zárd be a régi Metrót.
- **Gradle „daemon" / heap hiba** → `android/gradle.properties`-ben emeld a `org.gradle.jvmargs` heap-et, vagy `cd android && ./gradlew --stop`.
- **Lassú/akadó build** → első alkalommal normális; ne szakítsd meg.

## Megjegyzés
- A bare RN projekt natív kódja az `android/` mappában van (verziókövetett).
- A **natív hanglejátszás** (alacsony késleltetés + BT-offset) és a **BT-gomb** a soron következő natív munka — ezekhez kell ez a környezet.
- iOS-hez Mac + Xcode szükséges (külön).
