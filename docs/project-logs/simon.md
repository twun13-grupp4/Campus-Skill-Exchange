# Project log Simon Rignell

## Week 1 - 5 September

- Made the first changes in the README in the new Repo

## Week 3 - 14-20 September

- Created the MVD project skeleton with seperate `client/` and `server/`folders

## Week 4 - 21-27 September

- Set ut the Express server (`server.js`)
- Added the first question controller and route, only returning mock data (`GET /api/questions`)
- Added an endpoint for creating questions (`POST /api/questions`), still no databas
- Created Assigntment 1 checklist issue
- Fixed the missing route for question detal page (`/questions/:id`)
- Created "Ask a question" pade with mock
- Added a 404 page for worng URLs
- Reviewed and merged tematated PR:s

## Week 6 5-11 October

- Added `.DS_Store`to `.gitignore``
- Created issues for login/registration and for MongoDB text search

## Week 7 - 12-18 October

- Connected the question controller to MongoDB: list, get and create a question
- Added endpoint for getting the answers to a question (`GET /api/questions/:id/answers`)
- Added `initDB.js`, a script that seeds the database with testusers, questions and answers
- Added user registration and login with JWT, with hashed passwords and `.env.example`for the rest of the group
- Added a `requireAuth`middleware so only logged-in users can create questions and hte author is taken from the token instead of request body
- Formatted my backend filens with Prettier
- Added Axios and a shared API modue `client/src/api/`that saves the token and adds it to every request automaticly
- Connected the "Ask a question form to the backend, with course picker loaded from API
- Updated the Ask page after oskars `Authcontext` to (`useAuth`)
- Added endpoint for posting answers (`POST /api/questions/:id/answers`) with a new `answerService`
- Created issues for JWT setup, the auth middlewate, the ask form and posting answers

## Next steps

- Add uppvoted on answers and let them count towards the user-rating
- Let the question-author mark an answer as the solution
- Buil the backend for notifications
- Prepade demo
