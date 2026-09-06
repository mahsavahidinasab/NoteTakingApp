# Note Taking App

A simple note-taking web app built with Express, MongoDB, and EJS, with Google OAuth 2.0 for authentication.

## Features

- Sign in with Google (Passport.js + `passport-google-oauth20`)
- Create, view, edit, and delete personal notes
- Session persistence backed by MongoDB (`connect-mongo`)
- Server-rendered views with EJS

## Tech Stack

- Node.js / Express 5
- MongoDB / Mongoose
- Passport.js (Google OAuth 2.0 strategy)
- EJS templating
- express-session + connect-mongo

## Prerequisites

- Node.js
- A MongoDB database (local or hosted, e.g. MongoDB Atlas)
- A Google OAuth 2.0 client ID/secret ([Google Cloud Console](https://console.cloud.google.com/apis/credentials))

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the values:
   ```
   PORT=3000
   MONGODB_URI=your-mongodb-connection-string
   SESSION_SECRET=replace-with-a-long-random-string
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   ```
3. In the Google Cloud Console, add `GOOGLE_CALLBACK_URL` as an authorized redirect URI for your OAuth client.

## Running the App

```
npm start
```

This runs the server with `nodemon` on the port set in `.env` (default `3000`). Visit `http://localhost:3000`.

## Routes

| Method | Path                     | Description                          |
| ------ | ------------------------ | ------------------------------------- |
| GET    | `/`                      | Home page (redirects to `/notes` if logged in) |
| GET    | `/auth/google`           | Start Google OAuth login              |
| GET    | `/auth/google/callback`  | Google OAuth callback                 |
| GET    | `/logout`                | Log out                               |
| GET    | `/notes`                 | List all notes for the logged-in user |
| GET    | `/notes/new`             | New note form                         |
| POST   | `/notes`                 | Create a note                         |
| GET    | `/notes/:id`             | View a single note                    |
| GET    | `/notes/:id/edit`        | Edit note form                        |
| PUT    | `/notes/:id`             | Update a note                         |
| DELETE | `/notes/:id`             | Delete a note                         |

All `/notes` routes require authentication.

## Project Structure

```
config/         Passport (Google OAuth) configuration
controllers/    Route handler logic for notes
middleware/     Auth guard (ensureAuthenticated)
models/         Mongoose models (User, Note)
routes/         Express routers (auth, pages, notes)
views/          EJS templates
public/         Static assets (CSS)
server.js       App entry point
```
