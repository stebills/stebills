# stebills

stebills is a utility bills payment platform: an Expo/React Native mobile client backed by an Express/TypeScript/MongoDB API.

## Structure

- [`client/`](client) — Expo Router mobile app (React Native + NativeWind)
- [`server/`](server) — Express + TypeScript + MongoDB API

Each package has its own README with setup instructions.

## Quick start

```bash
# API
cd server && cp .env.example .env && npm install && npm run server

# Mobile app
cd client && npm install && npm start
```
