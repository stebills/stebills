<img src="assets/brand/logo-512.png" alt="stebills logo" width="72" height="72">

# stebills

stebills is a Web3 utility bills payment platform built on the [Stellar](https://stellar.org) network: an Expo/React Native mobile client backed by an Express/TypeScript/MongoDB API.

Every user gets a self-custody Stellar wallet, created automatically at sign-up (email/password or Google), with a visible 24-word recovery phrase and support for multiple HD-derived accounts under that one phrase — no seed phrase, keys, or funds ever touch the server.

## Structure

- [`client/`](client) — Expo Router mobile app (React Native + NativeWind) — wallet creation, key custody, and the bills-payment UI
- [`server/`](server) — Express + TypeScript + MongoDB API — accounts, auth (including Google sign-in), and a public-key-only index of each user's Stellar accounts

Each package has its own README with setup instructions.

## Stellar at a glance

- **Non-custodial**: mnemonics and keys are generated and stored on-device (`expo-secure-store`); the server only ever stores public keys.
- **Google or email sign-up**: either path bootstraps a brand-new, independently generated Stellar wallet — nothing is derived from the identity provider.
- **Multi-account wallets**: additional accounts are derived from the same recovery phrase via [SEP-0005](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0005.md) HD derivation (`m/44'/148'/{index}'`), the same scheme used by Lobstr and other Stellar wallets.
- **Network**: Testnet today (funded via Friendbot), with a single config switch to move to Mainnet.

See [`server/README.md`](server/README.md#stellar-integration) for the full breakdown of how the client and server split responsibilities.

## Quick start

```bash
# API
cd server && cp .env.example .env && npm install && npm run server

# Mobile app
cd client && npm install && npm start
```
