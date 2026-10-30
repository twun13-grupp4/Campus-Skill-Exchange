[![CI](https://github.com/twun13-grupp4/Campus-Skill-Exchange/actions/workflows/ci.yml/badge.svg)](https://github.com/twun13-grupp4/Campus-Skill-Exchange/actions/workflows/ci.yml)

# Campus-Skill-Exchange

## Project description

A web application for university students to exchange skills and knowledge with each other. Students ask and answer questions tied to a course; programs are shared across schools, so students on the same program at different universities see each other's questions.

## Structure

MERN app split into two separate projects:

- `client/` — React (Vite) frontend
- `server/` — Express + Mongoose backend

## Documentation

- [Design](docs/design.md) — architecture (MVC), authentication, user roles, views
- [Database](docs/database.md) — schema diagram, collections and relations
- [User manual](docs/user-manual.md) — how to use the app
- [Project logs](docs/project-logs/)

## Setup & run

**Client**

```bash
cd client
npm install
npm run dev      # development
npm run build    # production build (output in client/dist)
```

Runs at http://localhost:5173 (API calls to `/api` are proxied to the server, so start the server too)

**Server**

The database is a shared [MongoDB Atlas](https://www.mongodb.com/atlas) cluster. Copy `server/.env.example` to `server/.env` and fill in the values (get `MONGODB_URI` from the team; `JWT_SECRET` can be any long random string). `.env` is gitignored — never commit it.

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

Wipes and reseeds the shared database (schools, programs, courses, users, questions, answers, notifications). Only run this when you actually want to reset the shared data — everyone on the team uses the same database. Seeded logins (password is the same for all of them):

| Email | Password | Role |
|---|---|---|
| anna@test.se | password123 | student |
| erik@test.se | password123 | student |
| sara@test.se | password123 | teacher |
| omar@test.se | password123 | student |
| lina@test.se | password123 | student |
| moa@test.se | password123 | moderator |

## Testing

**Automated API tests** (Jest + Supertest):

```bash
cd server
npm test
```

The tests run against a temporary in-memory MongoDB (`mongodb-memory-server`), so they never touch the shared database and need no `.env`. The first run downloads a MongoDB binary. They also run in CI on every pull request.

They cover the core features end to end through the API: registration and login, listing/filtering/searching and asking questions, answering and the notifications it creates, profile editing, and the delete permissions (author vs. other user vs. moderator).

**Manual testing** of the UI before each hand-in:

- Refresh the browser on every route (`/`, `/questions/:id`, `/ask`, `/login`, `/signup`, `/profile`) and check it comes back the same
- Check the layout at phone width and on desktop
- Sign up, log in, log out, and check that `/ask` and `/profile` require login
- Ask, answer and delete as different users (including `moa@test.se`), and check the notification bell
- ESLint passes in `client/` and `server/` (`npm run lint`)

## Deploy

From the project root, with `server/.env` in place:

```bash
npm run deploy
```

Installs dependencies, builds the client and starts the server, which serves both the API and the built client at http://localhost:3000 (or `PORT`). Any route can be refreshed or deep-linked.

On a host like Render, use `npm run build` as the build command and `npm start` as the start command, and set `MONGODB_URI` and `JWT_SECRET` as environment variables.

## API endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users/register` | – | Create an account |
| POST | `/api/users/login` | – | Log in, returns a JWT |
| GET | `/api/users/me` | ✓ | Current user's profile |
| PATCH | `/api/users/me` | ✓ | Update name, school and program |
| GET | `/api/schools` | – | List schools |
| GET | `/api/programs?school=<id>` | – | List programs, optionally filtered by school |
| GET | `/api/courses?school=<id>&program=<id>` | – | List courses, optionally filtered by school and/or program |
| GET | `/api/questions?school=&program=&course=&status=&search=` | – | List questions, with optional filters/search |
| GET | `/api/questions/:id` | – | Get a single question |
| POST | `/api/questions` | ✓ | Ask a question |
| GET | `/api/questions/:id/answers` | – | List answers to a question |
| POST | `/api/questions/:id/answers` | ✓ | Post an answer |
| DELETE | `/api/questions/:id` | ✓ author/moderator | Delete a question and its answers |
| DELETE | `/api/answers/:id` | ✓ author/moderator | Delete an answer |
| GET | `/api/notifications` | ✓ | Your 20 newest notifications |
| PATCH | `/api/notifications/:id/read` | ✓ | Mark a notification as read |

Errors return `{ "message": "..." }` with 400 (invalid input), 401 (not logged in), 403 (not allowed) or 404 (not found).

## Usage

Open the client URL above. Sign up or log in with one of the seeded accounts above, browse questions by school/program/course or search by keyword, ask a question, answer existing ones, and edit your profile. See the [user manual](docs/user-manual.md) for details.
