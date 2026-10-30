# Database

MongoDB (shared Atlas cluster) accessed through Mongoose. Every collection has `_id`, `createdAt` and `updatedAt` (Mongoose `timestamps`). `server/initDB.js` wipes and reseeds all collections (`npm run initdb -- --yes`).

![Database schema](campus-skill-exchange_schema.png)

## Relations

- A **school** offers many **programs**, and a program can be offered by many schools (`programs.schools`).
- A **course** belongs to one school and can be part of several programs (`courses.programs`).
- A **user** belongs to one school and one program at that school.
- A **question** belongs to a course and has an author. `school` is copied from the course so questions can be filtered by school directly.
- An **answer** belongs to a question and has an author.
- A **notification** is sent to a user (`recipient`) about an answer on one of their questions.

## Collections

### users

| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique, lowercase |
| password | String | required, bcrypt-hashed, never returned (`select: false`) |
| role | String | `student` (default), `teacher` or `moderator` |
| school | ObjectId → schools | required |
| program | ObjectId → programs | required, must be offered by `school` |
| rating | Number | default 0, reserved for upvote ratings |

### schools

| Field | Type | Notes |
|---|---|---|
| name | String | required, unique |

### programs

| Field | Type | Notes |
|---|---|---|
| name | String | required, unique (one shared entry per program) |
| schools | [ObjectId → schools] | schools that offer the program |

### courses

| Field | Type | Notes |
|---|---|---|
| name | String | required, unique per school |
| school | ObjectId → schools | required |
| programs | [ObjectId → programs] | programs the course is part of |

### questions

| Field | Type | Notes |
|---|---|---|
| title | String | required |
| description | String | required |
| course | ObjectId → courses | required |
| school | ObjectId → schools | required, copied from the course |
| author | ObjectId → users | required, taken from the JWT |
| status | String | `unanswered` (default) or `answered` |
| acceptedAnswer | ObjectId → answers | default `null`, reserved for accepted answers |

Index: `{ school, course, status }` for filtering.

### answers

| Field | Type | Notes |
|---|---|---|
| question | ObjectId → questions | required |
| description | String | required |
| author | ObjectId → users | required, taken from the JWT |
| upvotes | Number | default 0, reserved for upvotes |
| upvotedBy | [ObjectId → users] | reserved for upvotes |

### notifications

| Field | Type | Notes |
|---|---|---|
| recipient | ObjectId → users | required |
| type | String | `answer` (in use), `upvote`, `accepted` (reserved) |
| question | ObjectId → questions | required |
| answer | ObjectId → answers | required |
| read | Boolean | default `false` |

Index: `{ recipient, read, createdAt }` for listing a user's newest notifications.

## Deletes

Deleting a question also deletes its answers. Notifications pointing to a deleted question are hidden when listing notifications.
