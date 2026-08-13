<div align="center">
  <img src="assets/brand/logo-512.png" alt="stebills logo" width="96" height="96">

  <h1>stebills</h1>

  <p><strong>Pay your bills with a Stellar-powered, self-custody wallet.</strong></p>

  <p>
    <a href="https://stellar.org"><img alt="Built on Stellar" src="https://img.shields.io/badge/built%20on-Stellar-08B5E5?style=flat-square"></a>
    <img alt="Status" src="https://img.shields.io/badge/status-active%20development-yellow?style=flat-square">
    <img alt="Network" src="https://img.shields.io/badge/network-testnet-orange?style=flat-square">
    <img alt="License" src="https://img.shields.io/badge/license-see%20repo-lightgrey?style=flat-square">
  </p>
</div>

---

## Who we are

We build **stebills**, a mobile app that combines everyday utility bill payments with a real, self-custody [Stellar](https://stellar.org) wallet. No custodians, no seed phrases held on our servers — every wallet is generated on the user's own device, and we never see a private key.

## Why Stellar

Stellar gives us fast, low-cost settlement and a mature ecosystem for moving value — the right foundation for a payments app that needs to be cheap and quick for everyday transactions, not just speculative trading. Building non-custodially on top of it means:

- **Users hold their own keys.** stebills cannot access, freeze, or lose funds on a user's behalf — because it never has the keys to begin with.
- **Standard wallet UX.** We follow [SEP-0005](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0005.md) HD derivation, the same scheme used by wallets like Lobstr, so a stebills recovery phrase behaves the way users already expect a Stellar wallet to behave.
- **One phrase, many accounts.** A single 24-word recovery phrase can derive multiple independent Stellar accounts, so users can separate funds without juggling multiple backups.

## How it works

1. **Sign up** — with email/password or Google. Either path immediately generates a brand-new, independent Stellar wallet on-device; nothing is derived from the identity provider itself.
2. **Back up** — the user is shown their 24-word recovery phrase once, and confirms they've saved it before continuing.
3. **Transact** — the wallet is funded and ready to use; our servers only ever store public keys, used to look up and label a user's accounts.
4. **Grow** — users can derive additional accounts from the same recovery phrase at any time, each independently fundable and manageable.

```
┌─────────────────────┐        public keys only        ┌─────────────────────┐
│   stebills mobile    │ ──────────────────────────────▶ │    stebills API     │
│  (keys + mnemonic     │                                 │  (accounts, auth,   │
│   generated on-device)│ ◀────────────────────────────── │   bill payments)    │
└─────────────────────┘        account metadata          └─────────────────────┘
          │
          │ reads/writes directly
          ▼
┌─────────────────────┐
│   Stellar network    │
│ (Horizon / Friendbot) │
└─────────────────────┘
```

## Tech stack

- **Mobile** — Expo / React Native, Expo Router, NativeWind
- **API** — Node.js, Express, TypeScript, MongoDB
- **Stellar** — `@stellar/stellar-sdk`, BIP-39 + SEP-0005 HD key derivation, Horizon, Friendbot (testnet)
- **Auth** — email/password and Google Sign-In, JWT sessions

## Status

stebills is in active development and currently runs against the Stellar **Testnet**. Wallet creation, backup, and multi-account management are live; on-chain bill payments (building and submitting payment transactions against a Stellar balance) are on the roadmap.

## Get involved

Check out the [stebills repository](.) for setup instructions, or reach out if you'd like to contribute.
