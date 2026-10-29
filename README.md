[![CI](https://github.com/twun13-grupp4/Campus-Skill-Exchange/actions/workflows/ci.yml/badge.svg)](https://github.com/twun13-grupp4/Campus-Skill-Exchange/actions/workflows/ci.yml)

# Campus-Skill-Exchange

## Project description

A web application for university students to exchange skills and knowledge with each other. Students ask and answer questions tied to a course; courses and programs can be shared across schools, so students on the same program at different universities see the same questions.

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

The database is a shared [MongoDB Atlas](https://www.mongodb.com/atlas) cluster. Copy `server/.env.example` to `server/.env` and fill in the values (get `MONGODB_URI` from the team; `JWT_SECRET` can be any random string, but must be the same for everyone talking to the shared database so tokens stay valid for each other). `.env` is gitignored — never commit it.

```bash
cd server
npm install
npm run dev            # development (restarts on file changes)
npm start              # production
```

Runs at http://localhost:3000

**Database seed data**

```bash
cd server
npm run initdb -- --yes
```

Wipes and reseeds the shared database (schools, programs, courses, users, questions, answers). Only run this when you actually want to reset the shared data — everyone on the team uses the same database. Seeded logins (password is the same for all of them):

| Email | Password | Role |
|---|---|---|
| anna@test.se | password123 | student |
| erik@test.se | password123 | student |
| sara@test.se | password123 | teacher |
| omar@test.se | password123 | student |
| lina@test.se | password123 | student |

## API endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users/register` | – | Create an account |
| POST | `/api/users/login` | – | Log in, returns a JWT |
| GET | `/api/users/me` | ✓ | Current user's profile |
| GET | `/api/schools` | – | List schools |
| GET | `/api/programs?school=<id>` | – | List programs, optionally filtered by school |
| GET | `/api/courses?school=<id>` | – | List courses, optionally filtered by school |
| GET | `/api/questions?school=&program=&course=&status=&search=` | – | List questions, with optional filters/search |
| GET | `/api/questions/:id` | – | Get a single question |
| POST | `/api/questions` | ✓ | Ask a question |
| GET | `/api/questions/:id/answers` | – | List answers to a question |
| POST | `/api/questions/:id/answers` | ✓ | Post an answer |

## Usage

Open the client URL above. Sign up or log in with one of the seeded accounts above, browse questions by school/program/course or search by keyword, ask a question, and answer existing ones.
