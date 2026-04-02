# Movie Watchlist Client

A full-stack movie watchlist application where users can search movies via TMDB, manage a personal watchlist, and leave reviews with ratings. This repository contains the **React frontend**.

## Quick Start

```bash
cd my-app
npm install
npm run dev
```
### 1. Clone the repository

```bash
git clone  https://github.com/bahag-patelr/movie-watchlist-client
```
The app runs at `http://localhost:5173`. Requires the [backend API](https://github.com/bahag-reedm/watchlist-backend) running on `http://localhost:3000`.

## Features

- **Authentication** — Register, login, logout with JWT stored in localStorage
- **Movie Search** — Search TMDB for movies and add to your watchlist
- **Watchlist CRUD** — View, toggle watched/unwatched, and remove movies
- **Reviews** — Add comments and ratings (1–10) on movies
- **Protected Routes** — Dashboard, search, and movie detail require login

## Tech Stack

React 19 · React Router 7 · Axios · Tailwind CSS 4 · Headless UI · Heroicons · Vite 8

## Documentation

See [my-app/README.md](my-app/README.md) for detailed setup instructions, project structure, and route documentation.

## Team Members
Rishikesh Patel
Max Reed
