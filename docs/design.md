# Design

MERN app: `client/` is a React (Vite) SPA with Material UI and React Router, and `server/` is an Express REST API with Mongoose on a shared MongoDB Atlas database. In production Express also serves the built client (see [Deploy](../README.md#deploy)).

## Architecture (MVC)

```
React pages/ + components/        View
  └─ client/src/api/* (Axios + JWT)
       │ HTTP /api/...
       ▼
routes/ → middleware/ → controllers/ → services/ → models/ → MongoDB
                        Controller                 Model
```

- **Models** (`server/models/`): Mongoose schemas and validation.
- **Services** (`server/services/`): queries and business rules.
- **Controllers** (`server/controllers/`): read the request, call services, send the response.
- **Middleware** (`server/middleware/`): `requireAuth` (JWT) and `requireOwnerOrModerator`.
- **Views** (`client/src/pages/`, `components/`): React components. They never touch the DOM directly and only get data through the API.

## Authentication

Register or log in returns a JWT (valid for 7 days). The client stores it and Axios sends it as `Authorization: Bearer <token>`. `requireAuth` verifies it and loads the user. On reload, the session is restored with `GET /api/users/me`.

## User roles

Roles are set in the database and can't be changed through the API.

| Action | Guest | Student / Teacher | Moderator |
|---|---|---|---|
| Browse, filter, search, read questions | ✓ | ✓ | ✓ |
| Ask, answer, edit own profile, get notifications | – | ✓ | ✓ |
| Delete own question/answer | – | ✓ | ✓ |
| Delete **any** question/answer | – | – | ✓ |

The server returns 401 when not logged in and 403 when not allowed. The client only shows delete buttons to users who may use them.

## Views

Every route is deep-linkable and survives a refresh.

| Route | View |
|---|---|
| `/` | Question list with filters and search |
| `/questions/:id` | Question, answers and answer form |
| `/ask` | Ask a question (login required) |
| `/login`, `/signup` | Log in / create account |
| `/profile` | View and edit profile (login required) |
| `*` | Not found |

See also: [Database](database.md), [User manual](user-manual.md).
