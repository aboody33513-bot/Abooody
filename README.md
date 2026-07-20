# Poultry Manager - init-project

This repository contains the initial project files for the Poultry Manager local app.

How to run locally:

1. Clone the repo and checkout branch `init-project`.
2. Copy `.env.example` to `.env` (optional) and edit if needed.
3. Run `npm install` to install dependencies.
4. Run `npm start`.
5. Open http://localhost:3000

Notes:
- The app uses SQLite and will create the database file automatically at `data/poultry.db`.
- Authentication was removed per request; the app is open locally.
- Import / Export and Backup pages are included.
