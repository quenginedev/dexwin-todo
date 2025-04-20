# DexWin Todo App

A full-stack TypeScript Todo application with a React frontend and Express backend.

## Features

- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Real-time updates
- TypeScript support for both frontend and backend
- RESTful API

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Project Structure

```
dexwin-todo/
├── src/              # Frontend source files
├── server/           # Backend source files
├── public/           # Static assets
└── package.json      # Project dependencies
```

## Getting Started

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:5001`

### Frontend Setup

1. In a new terminal, navigate to the project root:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Runs the frontend in development mode
- `npm run build` - Builds the frontend for production
- `npm run preview` - Preview the production build locally

In the server directory:

- `npm start` - Starts the backend server
- `npm run dev` - Runs the backend in development mode with hot-reload

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Vite

- Backend:
  - Express.js
  - TypeScript
  - Morgan (logging)
  - CORS
