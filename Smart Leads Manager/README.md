# Smart Leads Manager

A comprehensive full-stack application for managing leads, built with the MERN stack (MongoDB, Express, React, Node.js) along with TypeScript.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Zustand, React Query, React Router DOM, React Hook Form
- **Backend**: Node.js, Express, TypeScript, Mongoose, Zod
- **Database**: MongoDB
- **Infrastructure**: Docker, Docker Compose

## Prerequisites

- Node.js v20+
- MongoDB (if running locally without Docker)
- Docker & Docker Compose (for containerized setup)

## Setup & Run Locally (Without Docker)

1. **Clone the repository** and navigate to the project root.
2. **Start the Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
3. **Start the Client** (in a new terminal):
   ```bash
   cd client
   npm install
   npm run dev
   ```
4. Access the frontend at `http://localhost:5173`.

## Setup & Run Locally (With Docker)

1. **Start the containers**:
   ```bash
   docker-compose up --build
   ```
2. Access the frontend at `http://localhost:5173` and the API at `http://localhost:5000`.

## Environment Variables

### Backend (`/server/.env`)

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `PORT` | API Server port | `5000` |
| `NODE_ENV` | Application environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smartleads` |
| `JWT_SECRET` | Secret key for signing JWTs | `super_secret_key` |
| `JWT_EXPIRES_IN` | Expiration time for JWTs | `1d` |
| `CLIENT_URL` | Allowed origin for CORS | `http://localhost:5173` |

### Frontend (`/client/.env`)

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

## API Documentation

| Method | Endpoint | Auth Required | Description |
| ------ | -------- | ------------- | ----------- |
| POST | `/api/v1/auth/register` | No | Register a new user |
| POST | `/api/v1/auth/login` | No | Login and receive a JWT |
| GET | `/api/v1/auth/me` | Yes | Get the current logged-in user |
| GET | `/api/v1/leads` | Yes | Get paginated list of leads |
| POST | `/api/v1/leads` | Yes | Create a new lead |
| GET | `/api/v1/leads/:id` | Yes | Get a single lead by ID |
| PUT | `/api/v1/leads/:id` | Yes | Update lead details or status |
| DELETE | `/api/v1/leads/:id` | Yes | Delete a lead |

## Folder Structure

```
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # UI, Layout, and Feature components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Top-level route components
│   │   ├── services/       # API integration
│   │   ├── store/          # Zustand global state
│   │   ├── types/          # TypeScript interfaces/types
│   │   └── utils/          # Helper functions
│   └── Dockerfile          # Frontend container config
├── server/                 # Backend Node.js Application
│   ├── src/
│   │   ├── config/         # Environment & DB configurations
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Express middlewares (Auth, Error)
│   │   ├── models/         # Mongoose schemas
│   │   ├── repositories/   # DB data access logic
│   │   ├── routes/         # Express routers
│   │   ├── services/       # Core business logic
│   │   ├── types/          # TypeScript interfaces/types
│   │   └── utils/          # Shared utilities (Errors, Responses)
│   └── Dockerfile          # Backend container config
├── docker-compose.yml      # Multi-container orchestration
└── README.md               # Project documentation
```

## Git Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools and libraries
