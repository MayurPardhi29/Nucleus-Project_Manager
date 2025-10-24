# Nucleus Frontend

React + TypeScript + Vite + Material UI frontend for Nucleus (Jira-like) backend.

## Setup

1. Unzip project
2. Install dependencies:
```
npm install
```
3. Set environment variable in `.env` (optional):
```
VITE_API_BASE_URL=http://localhost:8080/api
```
4. Run:
```
npm run dev
```

## Notes
- This frontend expects the backend to return responses in the `{ status,message,data,timestamp }` envelope. Axios client unwraps the `data` automatically.
- This version uses **hard delete** endpoints (`DELETE /users/{id}`, `/projects/{id}`, `/issues/{id}`).
