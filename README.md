[![CI](https://github.com/twun13-grupp4/Campus-Skill-Exchange/actions/workflows/ci.yml/badge.svg)](https://github.com/twun13-grupp4/Campus-Skill-Exchange/actions/workflows/ci.yml)

# Campus-Skill-Exchange

## Project description

A web application for university students to exchange skills and knowledge between each other within their program.

## Structure

MERN app split into two separate projects:

- `client/` — React (Vite) frontend
- `server/` — Express + Mongoose backend

## Setup & run

**Client**

```bash
cd client
npm install
npm run dev      # development
npm run build    # production build (output in client/dist)
```

Runs at http://localhost:5173

**Server**

The database is a shared [MongoDB Atlas](https://www.mongodb.com/atlas) cluster. Get the `.env` file from the team and place it in `server/` (it is gitignored, never commit it).

```bash
cd server
npm install
npm run dev            # development (restarts on file changes)
npm start              # production
```

Runs at http://localhost:3000

## Usage

Open the client URL above and browse the listing/detail views. The client still uses mock data until it is connected to the API (#43).
