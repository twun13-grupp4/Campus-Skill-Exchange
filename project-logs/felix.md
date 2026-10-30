# Project Log – Felix Gudmundsson

## Week 4 – 21–27 September
- Added mock question data and question cards to the homepage.
- Built the question detail page UI.

## Week 6 – 5–11 October
- Designed and built the category filter UI (school/program/course dropdowns), initially running on mock data.

## Week 7 – 12–13 October
- Connected the login page to the real authentication API (JWT-based login, with real error messages instead of the old demo alert).
- Connected the question detail page to the backend, including fetching and displaying its answers.
- Connected the homepage's question list to the backend, replacing the mock question data.
- Replaced the category filter's mock data with the real `/api/schools`, `/api/programs`, and `/api/courses` endpoints, and wired school/course filtering into the real question list.
- Wired up program-based filtering (building on Albin's course–program linking work), so picking a program narrows the course list and the question results too.
- Built a "My profile" page showing the logged-in user's real name, role, program, school, and email, and linked it from the dashboard navbar (profile menu + sidebar).
- Fixed several CI/lint failures along the way, including an invalid synchronous-setState-in-effect pattern and a couple of naming typos.

## Next steps
- Expand the User model with bio/skills fields and expose rating + join date, then build those into the profile page (left out for now since the backend doesn't have them).
- Add an "Edit profile" flow once an update endpoint exists.
- Add endpoints for a user's own questions/answers and stats, so the profile page can show real activity instead of nothing.
