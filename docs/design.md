# Design

## Overview

Campus Skill Exchange is a MERN app (MongoDB, Express, React, Node.js) where university students ask and answer questions tied to a course. Programs are shared across schools, so students on the same program at different universities see each other's questions.

The project is split into two separate npm projects:

- `client/` — React (Vite) single-page app with Material UI and React Router
- `server/` — Express REST API with Mongoose models on a shared MongoDB Atlas database

In production the Express server also serves the built client (`client/dist`), so the whole app runs as one process (see [Deploy](../README.md#deploy)).

## Architecture (MVC)

```
Browser
  └─ React views (pages/, components/)          View
       └─ client/src/api/*  (Axios, JWT header)
            │  HTTP /api/...
            ▼
Express server.js
  └─ routes/          URL + method → middleware → controller
  └─ middleware/      requireAuth, requireOwnerOrModerator
  └─ controllers/     read the request, validate, send the response   Controller
  └─ services/        database queries and business rules
  └─ models/          Mongoose schemas                                Model
       ▼
MongoDB Atlas
```

| Layer | Folder | Responsibility |
|---|---|---|
| Model | `server/models/` | Mongoose schemas, validation, indexes, password hashing |
| Service | `server/services/` | Queries and business rules (filtering, search, notifications), shapes the public JSON |
| Controller | `server/controllers/` | Reads params/body, calls services, maps results to HTTP status codes |
| Routes | `server/routes/` | Maps URLs to controllers and attaches middleware |
| Middleware | `server/middleware/` | Authentication (JWT) and ownership/role checks |
| View | `client/src/pages/`, `client/src/components/` | React components; never touch the DOM directly |
| Client API | `client/src/api/` | One Axios instance plus one module per resource |

The client never talks to the database. All data goes through the REST API documented in the [README](../README.md#api-endpoints).

## Authentication

1. `POST /api/users/register` or `/login` returns a JWT (valid for 7 days).
2. The client stores the token (`api/token.js`) and the Axios client adds `Authorization: Bearer <token>` to every request.
3. `requireAuth` verifies the token, loads the user and puts it on `req.user`.
4. If a request using the current token gets a 401, the client clears the session.
5. On page load, `AuthContext` restores the session by calling `GET /api/users/me`.

Passwords are hashed with bcrypt in a `pre('save')` hook and are never returned by the API (`select: false`).

## User roles

Every user has a `role`: `student` (default), `teacher` or `moderator`. Roles are set in the database and can't be changed through the API.

| Action | Guest | Student / Teacher | Moderator |
|---|---|---|---|
| Browse, filter and search questions | ✓ | ✓ | ✓ |
| View a question and its answers | ✓ | ✓ | ✓ |
| Ask a question / post an answer | – | ✓ | ✓ |
| Delete own question or answer | – | ✓ | ✓ |
| Delete **any** question or answer | – | – | ✓ |
| View and edit own profile | – | ✓ | ✓ |
| Receive notifications | – | ✓ | ✓ |

The server enforces this with `requireAuth` (401 if not logged in) and `requireOwnerOrModerator` (403 if neither the author nor a moderator). The client uses `utils/permissions.js` to only show delete buttons to users who are allowed to use them.

## Notifications

When someone answers a question, the server creates a `Notification` for the question's author (not when you answer your own question). The navbar polls `GET /api/notifications` every 30 seconds and shows the number of unread notifications on the bell. Opening a notification marks it as read and navigates to the question.

## Views and routes

All views are deep-linkable and survive a browser refresh.

| Route | View | Access |
|---|---|---|
| `/` | Question list with filters and search (dashboard when logged in) | Everyone |
| `/questions/:id` | Question with its answers and an answer form | Everyone (answering requires login) |
| `/ask` | Ask a question | Logged in |
| `/login` | Log in | Everyone |
| `/signup` | Create an account | Everyone |
| `/profile` | View and edit your profile | Logged in |
| `*` | Not found | Everyone |

## Database

See [database.md](database.md).
