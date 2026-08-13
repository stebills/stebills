# stebills — mobile client

Expo Router app for the stebills utility bills payment platform.

## Stack

- Expo SDK 51 / React Native 0.74
- expo-router (file-based routing)
- NativeWind (Tailwind for React Native)

## Get started

```bash
npm install
npm start
```

Then choose a target from the Expo CLI output:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Project layout

- `app/` — screens and layouts (file-based routing, grouped by `(screens)`/`(modals)`)
- `lib/ui/components/` — shared UI components (buttons, form inputs, etc.)
- `hooks/` — shared React hooks
- `constants/` — colors, spacing, static copy
- `assets/` — images, SVG icons, fonts

## Scripts

- `npm start` — start the Expo dev server
- `npm run android` / `npm run ios` / `npm run web` — start targeting a specific platform
- `npm run lint` — run ESLint
- `npm test` — run Jest tests
