<img src="../assets/brand/logo-512.png" alt="stebills logo" width="64" height="64">

# stebills — mobile client

Expo Router app for the stebills Web3 utility bills payment platform, with a built-in non-custodial [Stellar](https://stellar.org) wallet.

## Stack

- Expo SDK 51 / React Native 0.74
- expo-router (file-based routing)
- NativeWind (Tailwind for React Native)
- `@stellar/stellar-sdk`, `bip39`, `ed25519-hd-key` — Stellar key derivation and Horizon access
- `expo-secure-store` — on-device key storage
- `expo-auth-session` — Google Sign-In

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

Set the API base URL and Google OAuth client IDs in `app.json` under `expo.extra` before testing sign-up/login against a real server or Google Sign-In.

## Project layout

- `app/` — screens and layouts (file-based routing, grouped by `(screens)`/`(modals)`)
  - `(screens)/onboarding/` — sign-up, PIN setup, wallet creation, seed phrase reveal + confirmation
  - `(screens)/login/` — email/password login, Google sign-in landing, wallet import (for a new device)
  - `(screens)/dashboard/` — wallet home, multi-account management, account detail (address, secret reveal)
- `lib/stellar/` — wallet crypto core: mnemonic generation, SEP-0005 account derivation, Friendbot funding, Horizon reads, and secure on-device persistence (`wallet.ts`, `secureStorage.ts`, `bootstrap.ts`)
- `lib/api/` — API client and typed wrappers for auth (email/password + Google) and Stellar account registration (`client.ts`, `auth.ts`, `wallet.ts`, `useGoogleSignIn.ts`)
- `lib/ui/components/` — shared UI components (buttons, form inputs, etc.)
- `lib/polyfills.ts` — crypto polyfills (`react-native-get-random-values`, `Buffer`) required for Stellar key generation, imported first in the root layout
- `hooks/` — shared React hooks
- `constants/` — colors, spacing, static copy
- `assets/` — images, SVG icons, fonts

## Wallet architecture

Keys never leave the device. `lib/stellar/wallet.ts` generates a 24-word BIP-39 mnemonic and derives Stellar keypairs from it via SLIP-0010/SEP-0005 (`m/44'/148'/{accountIndex}'`); `lib/stellar/secureStorage.ts` persists the mnemonic and the list of derived accounts in `expo-secure-store`. The server (see [`server/README.md`](../server/README.md#stellar-integration)) only ever receives the resulting **public** keys via `lib/api/wallet.ts`.

Because recovery phrases are device-local, logging into an account on a new device with no local wallet routes to `(screens)/login/importWalletScreen`, where re-entering the phrase restores account access.

## Scripts

- `npm start` — start the Expo dev server
- `npm run android` / `npm run ios` / `npm run web` — start targeting a specific platform
- `npm run lint` — run ESLint
- `npm test` — run Jest tests, including the Stellar crypto core smoke test (`lib/stellar/__tests__/wallet.test.ts`). Set `RUN_NETWORK_TESTS=1` to also exercise real Testnet Friendbot funding and Horizon reads.
