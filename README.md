# eRevision 📚

A full-stack revision notes app that lets students organize study material by subject, with quick-access notes, tagging, and search — built for fast last-minute exam revision.

**Live demo:** _add your deployed link here_
**Video walkthrough:** _optional, add a Loom/YouTube link here_

---

## Features

- 🔐 **Authentication** — JWT-based signup/login, protected routes on the frontend
- 📁 **Subjects** — create, rename, and delete subjects; each tracks its own note count
- 📝 **Notes** — create, edit, delete notes within a subject; expandable note cards
- ⭐ **Favorites** — pin important notes to the top of a subject
- ↕️ **Sorting** — view notes newest-first or oldest-first
- 🏷️ **Tags** — tag notes and filter by tag within a subject
- 🔍 **Search** — filter subjects by name from the navbar
- 📊 **Dashboard** — profile page with subject/note/favorite counts
- 🔔 **Toast notifications & custom confirm dialogs** — no browser `alert()`/`confirm()` popups
- 🚫 **404 page** — for unmatched routes
- 🎨 **Consistent design system** — centralized color palette via Tailwind CSS v4 theme tokens
- ⚡ **Loading & empty states** — no blank screens while data is in flight

## Tech Stack

**Frontend**
- React  + React Router 
- Tailwind CSS 
- Vite

**Backend**
- Node.js + Express 
- MongoDB + Mongoose
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing

## Architecture

```
eRevision/
├── Frontend/                # React + Vite SPA
│   └── src/
│       ├── component/       # Page + UI components
│       ├── context/         # Global state (NotesContext + NotesState provider)
│       └── App.jsx          # Route definitions
│
└── Backend/                 # Express REST API
    ├── models/               # Mongoose schemas (User, Subject, Notes)
    ├── route/                 # Route handlers (auth, notes)
    ├── middleware/            # JWT auth middleware
    └── index.js               # App entry point
```

**Data model:**
- A `User` has many `Subject`s
- A `Subject` has many `Notes`
- Deleting a subject cascades and deletes its notes

**Auth flow:**
1. User signs up / logs in → backend issues a signed JWT containing the user ID
2. Token is stored in `localStorage` and sent as a custom `authToken` header on every authenticated request
3. Backend middleware (`fetchUser`) verifies the token and attaches `req.user` before route handlers run

## Getting Started

### Prerequisites
- Node.js 
- A MongoDB connection string (local or Atlas)

### Backend setup
```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:
```
MongoUrl=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret_string
```

```bash
node index.js
```
Server runs on `http://localhost:8000`.

### Frontend setup
```bash
cd Frontend
npm install
npm run dev
```
App runs on `http://localhost:5173` (default Vite port).

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/eRevision/signup` | No | Create a new user |
| POST | `/eRevision/login` | No | Log in, returns JWT |
| GET | `/eRevision/getNotes` | Yes | List all subjects (with note counts) |
| GET | `/eRevision/getNotes/:id` | Yes | Get notes for one subject |
| POST | `/eRevision/createNotes` | Yes | Create a subject + first note |
| POST | `/eRevision/addNote/:subjectId` | Yes | Add a note to an existing subject |
| POST | `/eRevision/updateNotes/:id` | Yes | Edit a note |
| POST | `/eRevision/updateSubject/:id` | Yes | Rename a subject |
| DELETE | `/eRevision/deleteNotes/:id` | Yes | Delete a note |
| DELETE | `/eRevision/deleteSubject/:id` | Yes | Delete a subject and its notes |
| POST | `/eRevision/toggleFavorite/:id` | Yes | Pin/unpin a note as favorite |
| GET | `/eRevision/me` | Yes | Get current user's profile + stats (subject/note/favorite counts) |

## Design Decisions

- **Context API over Redux** — the app's state (subjects, notes, auth) is simple enough that Context + a single provider avoids unnecessary boilerplate.
- **Cascading deletes handled server-side** — deleting a subject also deletes its notes in the same request, keeping the database consistent without relying on the frontend to make two calls.

## Possible Future Improvements

- Rich text / markdown support for note descriptions
- Note favoriting and sort by recency (requires timestamps on the schema)
- Full-text search across note content, not just subject names
- Move JWT from localStorage to an httpOnly cookie to reduce XSS exposure
- Automated tests (Jest/Vitest + Supertest for the API)

## Screenshots

_Add 2–3 screenshots here: Home page, a subject's notes expanded, and the create-note form._

---

Built by Harish Singh
