<img src="../assets/brand/logo-512.png" alt="stebills logo" width="64" height="64">

# stebills — API server

Express + TypeScript + MongoDB API for the stebills Web3 utility bills payment platform, built on [Stellar](https://stellar.org).

## Get started

```bash
cp .env.example .env   # fill in the values, including GOOGLE_CLIENT_ID for Google Sign-In
npm install
npm run server          # dev server with nodemon + ts-node
```

## Scripts

- `npm run server` — start the dev server (nodemon + ts-node)
- `npm run build` — type-check and compile to `dist/`
- `npm start` — run the compiled build
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` — Prettier

## Project layout

- `src/config/` — database connection
- `src/controllers/` — request handlers
- `src/services/` — business logic, external API integrations
- `src/models/` — Mongoose schemas
- `src/middlewares/` — auth, admin gating, error handling
- `src/routers/` — Express route definitions
- `src/utils/` — shared helpers (`catchAsync`, `apiResponse`, `paginate`, etc.)

## API routes

All routes are mounted under `/api`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/users` | — | Register a new user (email/password) |
| POST | `/users/login` | — | Log in (email/password) |
| POST | `/auth/google` | — | Sign in with a Google ID token; creates the user (and their fiat wallet/profile/referral) on first sign-in |
| GET | `/users` | admin | List users (paginated, searchable) |
| GET | `/users/suspended` | admin | List suspended users |
| GET | `/users/agents` | admin | List agents |
| GET | `/users/:id` | user | Get a user by id |
| PUT | `/users/:id` | user | Update a user |
| PATCH | `/users/:id/toggle-suspension` | admin | Suspend/unsuspend a user |
| DELETE | `/users/:id` | admin | Delete a user and related records |
| POST | `/auth/send-otp` | — | Send an email OTP |
| POST | `/auth/resend-otp` | — | Resend an email OTP |
| POST | `/auth/verify-otp` | — | Verify an OTP |
| POST | `/auth/verify-email` | — | Verify a user's email |
| POST | `/auth/set-password` | — | Set a user's password |
| POST | `/auth/set-transaction-pin` | user | Set the transaction PIN |
| POST | `/auth/verify-transaction-pin` | user | Verify the transaction PIN |
| GET | `/profile` | user | Get the current user's profile |
| GET | `/profiles` | admin | List profiles (paginated, searchable) |
| POST | `/upload?type=image\|file` | — | Upload a file |
| POST | `/wallet/accounts` | user | Register a Stellar account (public key) generated on the client |
| GET | `/wallet/accounts` | user | List the current user's registered Stellar accounts |
| GET | `/wallet/accounts/next-index` | user | Get the next free HD-wallet account index for the user |
| PATCH | `/wallet/accounts/:id` | user | Rename a Stellar account |
| DELETE | `/wallet/accounts/:id` | user | Remove a Stellar account |

## Stellar integration

Wallet key generation and signing happen entirely on the client (`client/lib/stellar/`), using `bip39` + `ed25519-hd-key` to derive [SEP-0005](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0005.md) keypairs (`m/44'/148'/{accountIndex}'`) from a BIP-39 mnemonic, and `@stellar/stellar-sdk` to talk to Horizon. The server never sees a secret key or mnemonic — it only stores public keys and metadata:

- The client generates/holds the mnemonic (`secureStorage.ts`) and derives an account keypair per `accountIndex` (`wallet.ts`).
- On testnet, new accounts can be funded via Stellar's Friendbot (`fundTestnetAccount`).
- The client registers the resulting public key with the server (`POST /wallet/accounts`), which persists it in the `StellarAccount` model alongside the user, a label, network (`testnet`/`mainnet`), and HD account index.
- Account balances are read directly from Horizon by the client (`getAccountInfo`), not proxied through the server.
- Google Sign-In (`POST /auth/google`) only establishes identity — the client still generates an independent, unrelated mnemonic for a new Google user, the same as it does for email/password sign-up.
- Losing a device means losing local access to the mnemonic (by design — this is non-custodial). Re-entering the recovery phrase on a new device (client's "Import Wallet" screen) restores it; the server's `GET /wallet/accounts` is used there to confirm the re-entered phrase's first derived key matches a previously registered account.

This currently covers wallet provisioning only. Actually sending payments (building/signing/submitting Stellar transactions) and settling bills against a Stellar balance are not yet implemented — there are no server or client code paths that construct a payment operation yet. The pre-existing `Wallet` and `Transaction` models represent an older, non-Stellar balance/bill-payment domain (Naira wallet balance, Monnify bank accounts, airtime/data/electricity/TV transactions) and are not yet wired to the Stellar accounts added here.
