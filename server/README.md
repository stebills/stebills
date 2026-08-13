# stebills — API server

Express + TypeScript + MongoDB API for the stebills utility bills payment platform.

## Get started

```bash
cp .env.example .env   # fill in the values
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
| POST | `/users` | — | Register a new user |
| POST | `/users/login` | — | Log in |
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

Several models/services (wallet, transactions, referrals, bank details, beneficiaries) exist without controllers/routes yet — they're pre-existing, partially built domains outside the scope of this cleanup pass.
