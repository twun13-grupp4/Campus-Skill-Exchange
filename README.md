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
```bash
cd server
npm install
npm run dev
```
Runs at http://localhost:3000

## Usage

Assignment 1 uses static/mock data — no database connection required yet. Open the client URL above and browse the listing/detail views.
