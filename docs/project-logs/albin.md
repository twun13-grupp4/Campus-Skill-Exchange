# Project Log – Albin Törnberg

Main areas: the Model layer (Mongoose schemas, database and services), plus setting up and running the GitHub repo (CI, templates, rules, issues, reviews). Oskar created the repo and gave us all admin rights. After that I set up and managed most of the repo.

## Week 2 – 7–13 September

- Added `.gitattributes` to keep line endings the same across the group's OSes.

## Week 3 – 14–20 September

- Wrote a project planning draft for the group: the purpose, the entities, the feature list and a proposed split of the work by MVC layer (Model: Albin, View: Felix and Oskar, Controller: Simon).
- Proposed our way of working: an issue for each feature, one PR for each issue, small PRs and a clean `main`.
- Set up the `main` ruleset after the repo was moved to the `twun13-grupp4` org. It requires a PR with 1 approval and a passing CI check, and it blocks force-push and deleting the branch.
- Added the barebones CI workflow (GitHub Actions) plus PR and issue templates, based on my `general-template` repo (#1). Added a CI badge to the README.
- Reviewed and approved the MVC skeleton (#2).

## Week 4 – 21–27 September

- Added the basic folder structure to `server/` (#4).
- Wrote the first Mongoose schemas for User, Question and Answer, and fixed `.gitignore` and `package.json` (#5).
- Wrote the setup and run instructions in the README and fixed the CI badge link (#6, #29).
- Replaced oxlint with ESLint in the client, added ESLint to the server, and made CI lint both sides (#27).
- UI cleanup: switched the homepage cards from Stack to Grid, and replaced hardcoded navbar colors with theme variables (#31).
- Renamed `Answer.content` to `description` so it matches Question (#33).
- Added a Prettier config and format-on-save, and formatted most of the existing files (#34).
- Opened #35 to confirm which React Router version the course requires.
- Reviewed and merged #28, #30 and #32.

## Week 6 – 5–11 October

- Wrote our planned features as GitHub issues (#36–#44): search, filtering, upvotes, rating, ranking, best answer and notifications.
- Set up the MongoDB Atlas database and connected the backend to it. Added password hashing in the User model, a Notification model and the fields for planned features, and updated the README (#45, #51).
- Opened #56 to get the team's input on how courses are stored (plain text or a separate collection) and what the question API returns.
- Reviewed and approved #46, #49, #50 and #53, and resolved a merge conflict between the category filter and the search bar in #49. Reopened #38, because the filter was only UI so far.

## Week 7 – 12–18 October

- Changed the database structure to School, Program and Course collections with lookup endpoints, a school service, and a new seed in `initDB.js` (#67). This closed #56 from the week before.
- Added a service layer for questions: references to course, school and author, filtering and a shared response shape. The question controller now uses it, and the client API comments match (#68).
- Added filtering by program (#85), and linked courses to programs (#76).
- Made programs shared between schools. This fixed the duplicate programs in the filter (#89, #91).
- Worked together on the search PR (#87): added regex search so it also matches parts of words, then merged it.
- Opened #64 (Assignment 2 checklist), #93 (homepage reachable on two URLs) and #95 (cleanup before hand-in). Commented on #59 with a command to generate the JWT secret.
- Reviewed and approved #69, #70, #74, #81, #82, #83, #90, #92 and #96, and merged #69 and #82. Closed #37, #43, #47 and #48 with summaries of which PRs did the work.
- Demonstration 2 (15 Oct): helped write the shared speaker notes and presented the MVC overview, the token check (`requireAuth`) and the database schema.

## Week 8 – 19–25 October

- Started on ad spots for the homepage and question page (`AdCard`, `AdRail`, house ads). This is mostly an experiment on a local branch and might not be pushed.
