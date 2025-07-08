---
# Flight Booking System Documentation

## Table of Contents
1. [Project Structure and Design](#project-structure-and-design)
2. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
3. [Docker and Environment Configuration](#docker-and-environment-configuration)
4. [Deployment Steps and How to Scale the Application](#deployment-steps-and-how-to-scale-the-application)
5. [Additional Recommendations](#additional-recommendations)
6. [References](#references)

---
## Project Structure and Design
The project is organized as a monorepo with separate frontend and backend applications, orchestrated via Docker Compose.
```
Flight/
├── backend/           # Express API server
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers (business logic)
│   ├── models/        # Sequelize models (ORM definitions)
│   ├── routes/        # API route definitions
│   ├── tests/         # Jest test suites
│   ├── server.js      # Express app entry point
│   └── package.json   # Backend dependencies and scripts
│
├── frontend/          # React client application
│   ├── public/        # Static files
│   ├── src/           # React source code
│   │   ├── components/# Shared UI components
│   │   ├── pages/     # Page-level components
│   │   ├── services/  # API abstraction
│   │   └── App.jsx    # Main app component
│   ├── tailwind.config.js # Tailwind CSS config
│   ├── vite.config.js     # Vite build config
│   └── package.json      # Frontend dependencies and scripts
│
├── docker-compose.yml # Multi-service Docker configuration
└── README.md          # Project overview and instructions
```
### Backend Design
- **Express.js** REST API with routes for flights, bookings, and users.
- **Sequelize** ORM for PostgreSQL (production/dev) and SQLite (testing).
- **Controllers** handle business logic ([bookingsController.js](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/backend/controllers/bookingsController.js), [flightsController.js](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/backend/controllers/flightsController.js), [usersController.js](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/backend/controllers/usersController.js)).
- **Models** define schema ([flight.js](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/backend/models/flight.js), [booking.js](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/backend/models/booking.js), [user.js](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/backend/models/user.js)).
- **Testing** with Jest ([tests/](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/backend/tests/)).
### Frontend Design
- **React 19** SPA with React Router for navigation.
- **Axios** for API calls ([api.js](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/frontend/api.js)).
- **Tailwind CSS** for styling.
- **Testing** with Vitest and Testing Library ([src/pages/Home.test.jsx](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/frontend/src/pages/Home.test.jsx), etc.).
---
## CI/CD Pipeline Setup
> **Note:** The current repository does not include a CI/CD configuration file (e.g., GitHub Actions, GitLab CI, etc.). Below is a recommended setup using GitHub Actions.
### Example: GitHub Actions Workflow
Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: flight_app_test
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install backend dependencies
        run: |
          cd backend
          npm install

      - name: Run backend tests
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/flight_app_test
        run: |
          cd backend
          npm test

      - name: Install frontend dependencies
        run: |
          cd frontend
          npm install

      - name: Run frontend tests
        run: |
          cd frontend
          npm test
```
**What this does:**
- Checks out code, sets up Node.js, and spins up a PostgreSQL service.
- Installs dependencies and runs tests for both backend and frontend.
---
## Docker and Environment Configuration
### Docker Compose
The project uses [docker-compose.yml](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/docker-compose.yml) to orchestrate services:
- **frontend**: React app served on port 5173.
- **backend**: Express API served on port 5000.
- **Environment variables** are passed to containers for configuration.
#### Example Environment Variables
- **Backend**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `PORT`: API server port (default: 5000)
- **Frontend**:
  - `VITE_API_URL` or `VITE_BACKEND_URL`: Backend API base URL
#### Local `.env` Example
**backend/.env**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/flight_app_dev
PORT=5000
```
**frontend/.env**
```
VITE_BACKEND_URL=http://localhost:5000
```
---
## Deployment Steps and How to Scale the Application
### 1. Deploy with Docker Compose
**Production deployment:**
```sh
docker-compose up -d --build
```
- This builds and starts both frontend and backend containers.
- The backend connects to the PostgreSQL database using the `DATABASE_URL` provided.
### 2. Manual Deployment
- Start the backend:
```sh
cd backend
npm install
npm run start
```
- Start the frontend:
```sh
cd frontend
npm install
npm run build
npm run preview
```
### 3. Scaling the Application
#### Backend Scaling
- **Stateless API**: The backend is stateless (except for DB), so you can run multiple backend containers behind a load balancer (e.g., Nginx, AWS ELB).
- **Database**: Use a managed PostgreSQL service for high availability and scaling.
- **Environment**: Ensure all backend instances use the same `DATABASE_URL`.
#### Frontend Scaling
- **Static Build**: The frontend is a static site after `npm run build`. Serve it via any CDN or static hosting (e.g., Vercel, Netlify, S3 + CloudFront).
- **Horizontal Scaling**: Deploy multiple frontend containers or instances behind a CDN/load balancer.
#### Database Scaling
- Use managed PostgreSQL with read replicas for heavy read workloads.
- For high availability, enable automated backups and failover.
#### Environment Variables
- Use secrets management (e.g., GitHub Secrets, AWS Secrets Manager) for sensitive data in production.
---
## Additional Recommendations
- **Monitoring**: Use tools like Prometheus, Grafana, or cloud-native monitoring for health checks and metrics.
- **Logging**: Aggregate logs using ELK stack or cloud logging services.
- **Security**: Use HTTPS, secure environment variables, and consider adding authentication (JWT, OAuth) for production.
---
## References
- [backend/config/config.js](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/backend/config/config.js)
- [docker-compose.yml](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/docker-compose.yml)
- [frontend/README.md](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/frontend/README.md)
- [backend/README.md](file:///C:/Users/raha1/%D7%9E%D7%A1%D7%9E%D7%9B%D7%99%D7%9D/VS%20Code/Flight/README.md)
