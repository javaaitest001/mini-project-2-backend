# World Cup Watch

React + Spring Boot based World Cup dashboard for fixtures, standings, squads, and match watch reservations.

## Structure

```text
worldcup-project/
  frontend/   React + Vite
  backend/    Spring Boot
```

## First Version Scope

- Login/register with `USER` and `ADMIN` roles
- Home dashboard
- Group standings
- Match schedule
- Match detail
- Country squads
- My watch reservations
- World Cup preview simulator with strength-based outcomes
- Admin-ready REST structure for teams, matches, standings, players, and venues

## Backend

The backend is a Maven Spring Boot project. Maven is not installed in this machine shell right now, but Eclipse can import the `backend/pom.xml` as a Maven project.

Default profile uses H2 for quick development. For MySQL, create a database and run with the `mysql` profile.

```powershell
cd backend
mvn spring-boot:run
```

MySQL profile:

```powershell
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

Default seed accounts:

```text
admin@worldcup.local / admin1234
fan@worldcup.local / fan1234
```

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

If PowerShell blocks `npm`, use:

```powershell
npm.cmd install
npm.cmd run dev
```

The frontend uses `VITE_API_URL=http://localhost:8080/api` by default and falls back to local demo data if the backend is not running.

## Data Note

World Cup 2026 data is moving quickly during the tournament. The current seed is intentionally small and admin-editable; replace or extend it through admin APIs or `DataSeeder` as official data changes.
