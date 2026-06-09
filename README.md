# Iceberg X OS

Iceberg X OS is the internal operating platform for the **Iceberg X** R&D internship and innovation programme. It serves as the lightweight management system of record for Cubes, missions, demo days, feedback, badges, progression, and programme history—replacing the separate use of Jira, Notion, and Google Sheets.

Important: This app does **NOT** replace Slack (communication) or GitHub/GitLab (code and pull requests). It connects those layers into the program's operations.

---

## Tech Stack

- **Backend**: Node.js with Express and TypeScript
- **Frontend**: React + Vite + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **AI Support**: OpenAI API (graceful mock mode included for local testing)

---

## ⚡ Quick Start: Run Everything in Docker (Recommended)

This is the easiest way to launch the application. Both the frontend and backend are served from a single port (`5001`), completely bypassing any CORS preflight restrictions.

### 1. Start the Containers
Ensure Docker Desktop is running. In the project root, run:
```bash
docker-compose up --build -d
```
This will:
- Spin up the PostgreSQL database container.
- Build the React frontend and compile the Express backend.
- Wait for the database to become online.
- Apply database migrations and seed the initial data.
- Start the server on port `5001`.

### 2. Access the Application
Open [http://localhost:5001](http://localhost:5001) in your browser.

---

## 🛠️ Manual Setup (Alternative for Local Development)

If you wish to run the frontend Vite dev server (with hot reloading) and the backend Express server separately:

### 1. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```text
DATABASE_URL="postgresql://iceberg:iceberg_password@localhost:5432/iceberg_x_db?schema=public"
JWT_SECRET="super_secret_jwt_key_iceberg_x"
OPENAI_API_KEY="your_openai_api_key_here"
APP_URL="http://localhost:5173"
NODE_ENV="development"
PORT=5001
```

### 2. Install Dependencies
Run the command below in the workspace root:
```bash
npm run install-all
```

### 3. Start PostgreSQL Database
```bash
docker-compose up postgres -d
```

### 4. Run Migrations & Seed Data
```bash
npm run db:migrate
npm run db:seed
```

### 5. Launch Development Servers
```bash
npm run dev
```
Open the Vite dev server at [http://localhost:5173](http://localhost:5173). The API client will automatically proxy requests to port `5001`.

---

## Default Login Credentials

All seeded users use the password: `password123`

- **Admin User**: `admin@iceberg.com`
- **Mentor 1**: `mentor1@iceberg.com` (Assigned to Cube 1, 3, 5)
- **Mentor 2**: `mentor2@iceberg.com` (Assigned to Cube 2, 4)
- **Cubes**: `cube1@iceberg.com` to `cube5@iceberg.com`

---

## Explanation of User Roles & Permissions

1. **Admin**:
   - Complete program overview.
   - User creation and Cube Profile generation.
   - Allocating assigned mentors.
   - Managing badges definitions and awarding badges.
   - Setting final mission decisions (Promote to backlog, archive, keep as internal tool).
2. **Mentor**:
   - Manage assigned Cubes and review their daily/weekly updates.
   - Set R&D mission status and add team assignments.
   - Score Demo presentations (1 to 5 stars on 9 metrics).
   - Write strengths, weaknesses, private notes, and trigger AI drafts.
3. **Cube**:
   - Submit daily/weekly updates.
   - Register Demo submissions (with the mandatory **"What could we have done better?"** self-reflection).
   - View assigned mission team members, roles, earned badges, and public mentor feedback.
   - *Security: Cubes cannot access private mentor notes or edit scorecard details.*

---

## Core Concept Workflows

### R&D Missions
Missions start in the **Idea Pool** and progress through stages: **Selected** ➔ **Researching** ➔ **Building Demo** ➔ **Demo Ready** ➔ **Reviewed** ➔ **Promoted to Backlog** / **Archived**.

### Demo Days & Reflections
Cubes present their progress during Demo Days. Before presenting, they submit a Demo Showcase containing:
- What was built and learned.
- **"What could we have done better?"**: A mandatory reflection component that fosters a culture of constant engineering improvement.
- Links to repository, PR, and Loom walk-through.

Mentors grade the presentation on 9 metrics (Tech, Research, Demo, Ownership, Communication, Leadership, Product thinking, Reliability, Reflection) and recommend next steps (e.g. Consider for Senior Cube).

### AI Helpers
Four AI assistants are available to help:
- **Mission Summary**: Summarizes description, updates, demos, and reviews into a Markdown draft.
- **Cube Progress**: Assesses updates, scores, and badges to draft progression reviews.
- **Reflection Helper**: Cleans up and structures Cube reflection submissions.
- **Mentor Review Drafter**: Writes professional reviews based on scorecard values.

*Note: All AI outputs are presented as editable drafts in the UI, allowing review before saving.*

---

## Railway Deployment

Deploying this monorepo to Railway is straightforward:

1. **Database**: Add the **Railway PostgreSQL** plugin to your project.
2. **Web Application**:
   - Root Directory: `.`
   - Build Command: `npm run build`
   - Start Command: `sh -c "node backend/dist/wait-db.js && npx prisma migrate deploy && npx prisma db seed && node backend/dist/index.js"`
   - Environment Variables:
     - `DATABASE_URL`: (linked from Postgres plugin)
     - `JWT_SECRET`: (generate a secure string)
     - `OPENAI_API_KEY`: (your OpenAI developer key)
     - `APP_URL`: (the domain URL of your frontend service)
     - `NODE_ENV`: `production`
     - `PORT`: `5001`
