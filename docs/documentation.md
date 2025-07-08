# ✈️ Flight Booking System – Documentation
## 📚 Table of Contents
1. [Project Structure and Design](null)
2. [CI/CD Pipeline Setup](null)
3. [Docker and Environment Configuration](null)
4. [Deployment Steps and Scaling](null)
## Project Structure and Design
The Flight Booking System is a full-stack web application built using a modern JavaScript stack with a clear separation of concerns between frontend and backend.
### Overall Architecture
```
Flight/
├── backend/           # Express API server
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── models/        # Sequelize models
│   ├── routes/        # API routes
│   └── tests/         # Backend tests
│
├── frontend/          # React client application
│   ├── public/        # Static files
│   └── src/           # React source code
│       ├── components/# Reusable components
│       ├── pages/     # Page components
│       ├── services/  # API services
│       └── test/      # Frontend tests
│
├── docker-compose.yml # Docker configuration
└── README.md          # Project documentation
```
### Backend Architecture
The backend is built with Express.js and uses Sequelize ORM for database operations.
#### Key Components:
5. **Models**:
  - [Flight Model](https://github.com/rahmo96/Flight/blob/main/backend/models/flight.js) - Defines flight schema with properties like flight_number, departure, destination, etc.
  - [Booking Model](https://github.com/rahmo96/Flight/blob/main/backend/models/booking.js) - Manages booking data with references to flights
  - [User Model](https://github.com/rahmo96/Flight/blob/main/backend/models/user.js) - Handles user authentication data
6. **Controllers**:
  - [Flights Controller](https://github.com/rahmo96/Flight/blob/main/backend/controllers/flightsController.js) - Manages flight-related operations
  - [Bookings Controller](https://github.com/rahmo96/Flight/blob/main/backend/controllers/bookingsController.js) - Handles booking creation, retrieval, and cancellation
  - [Users Controller](https://github.com/rahmo96/Flight/blob/main/backend/controllers/usersController.js) - Manages authentication
7. **Routes**:
  - [Flights Routes](https://github.com/rahmo96/Flight/blob/main/backend/routes/flights.js)
  - [Bookings Routes](https://github.com/rahmo96/Flight/blob/main/backend/routes/bookings.js)
  - [Users Routes](https://github.com/rahmo96/Flight/blob/main/backend/routes/users.js)
8. **Server Configuration**: [server.js](https://github.com/rahmo96/Flight/blob/main/backend/server.js) - Main Express application
#### Database Schema:
- **Flights Table**:
  - Primary Key: `flight_number`
  - Fields: departure, destination, departure_time, arrival_time, price, capacity, available_seats
- **Bookings Table**:
  - Primary Key: `id`
  - Foreign Key: `flight_number` (references flights)
  - Fields: passenger_name, passenger_email, booking_date, ticket_sold
- **Users Table**:
  - Primary Key: `id`
  - Fields: username, email, password_hash, first_name, last_name, created_at, last_login, is_active
### Frontend Architecture
The frontend is built with React using Vite as the build tool.
#### Key Components:
9. **Pages**:
  - [Home](https://github.com/rahmo96/Flight/blob/main/frontend/src/pages/Home.jsx) - Landing page with search form
  - [Flights](https://github.com/rahmo96/Flight/blob/main/frontend/src/pages/Flights.jsx) - Lists available flights
  - [Booking](https://github.com/rahmo96/Flight/blob/main/frontend/src/pages/Booking.jsx) - Booking form for selected flight
  - [MyBookings](https://github.com/rahmo96/Flight/blob/main/frontend/src/pages/MyBookings.jsx) - User's booking history
10. **Testing**: The project uses Vitest and React Testing Library for frontend tests:
  - [Home Tests](https://github.com/rahmo96/Flight/blob/main/frontend/src/pages/Home.test.jsx)
  - [Flights Tests](https://github.com/rahmo96/Flight/blob/main/frontend/src/pages/Flights.test.jsx)
  - [Booking Tests](https://github.com/rahmo96/Flight/blob/main/frontend/src/pages/Booking.test.jsx)
  - [MyBookings Tests](https://github.com/rahmo96/Flight/blob/main/frontend/src/pages/MyBooking.test.jsx)
11. **Services**: API service layer for communication with the backend
12. **Routing**: Managed via React Router in [App.jsx](https://github.com/rahmo96/Flight/blob/main/frontend/src/App.jsx)
## CI/CD Pipeline Setup
The CI/CD pipeline is implemented using GitHub Actions to automate testing, building, and deployment processes.
### GitHub Actions Workflow
Create a file `.github/workflows/ci.yml`:
```yaml
name: Flight Booking System CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
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
          cache: 'npm'
          cache-dependency-path: |
            backend/package-lock.json
            frontend/package-lock.json

      - name: Install backend dependencies
        run: cd backend && npm ci

      - name: Run backend tests
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/flight_app_test
          NODE_ENV: test
        run: cd backend && npm test

      - name: Install frontend dependencies
        run: cd frontend && npm ci

      - name: Run frontend tests
        run: cd frontend && npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_TOKEN }}
      
      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: yourusername/flight-backend:latest
      
      - name: Build and push frontend
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          tags: yourusername/flight-frontend:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /opt/flight-app
            docker-compose pull
            docker-compose up -d
```
### CI/CD Pipeline Flow:
13. **Testing Stage**:
  - Sets up PostgreSQL for backend tests
  - Runs backend tests using Jest
  - Runs frontend tests using Vitest
14. **Build Stage**:
  - Builds Docker images for frontend and backend
  - Pushes images to Docker Hub
15. **Deploy Stage**:
  - SSHs into production server
  - Pulls latest Docker images
  - Updates the running containers
## Docker and Environment Configuration
The application is containerized using Docker, with separate containers for the frontend, backend, and database.
### Docker Compose Configuration
The [docker-compose.yml](https://github.com/rahmo96/Flight/blob/main/docker-compose.yml) file defines the application services:
```yaml
version: "3.9"
services:
  # Frontend service
  frontend:
    container_name: flight-frontend
    build:
      context: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:5000
    volumes:
      - ./frontend:/usr/src/app
      - /usr/src/app/node_modules

  # Backend service
  backend:
    container_name: flight-backend
    build:
      context: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/flight_app
    volumes:
      - ./backend:/usr/src/app
      - /usr/src/app/node_modules
      
  # Database service (add if not using external DB)
  db:
    image: postgres:15
    container_name: flight-postgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=flight_app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```
### Environment Variables
#### Backend Configuration
The backend environment is configured through environment variables defined in `.env`:
```
# Database connection string
DATABASE_URL=postgresql://postgres:password@db:5432/flight_app

# Server port
PORT=5000

# Node environment (development, test, production)
NODE_ENV=development
```
Database configuration in [config.js](https://github.com/rahmo96/Flight/blob/main/backend/config/config.js) supports different environments with appropriate settings for each.
#### Frontend Configuration
Frontend environment variables are defined in `.env`:
```
# Backend API URL
VITE_API_URL=http://localhost:5000
```
### Dockerfile Examples
#### Backend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```
#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# Development mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# For production build use:
# RUN npm run build
# FROM nginx:alpine
# COPY --from=build /usr/src/app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
```
## Deployment Steps and Scaling
### Deployment Options
#### 1. Docker-based Deployment
For simple deployments, use Docker Compose on a single server:
```sh
# Clone repository
git clone https://github.com/yourusername/flight-booking.git
cd flight-booking

# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit environment variables
nano backend/.env
nano frontend/.env

# Start the application
docker-compose up -d
```
#### 2. Kubernetes Deployment (for scaling)
For production environments with scaling requirements, use Kubernetes:
16. Create Kubernetes deployment files:
17. **backend-deployment.yaml**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flight-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: flight-backend
  template:
    metadata:
      labels:
        app: flight-backend
    spec:
      containers:
      - name: flight-backend
        image: yourusername/flight-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: flight-secrets
              key: database-url
        - name: NODE_ENV
          value: production
```
18. **frontend-deployment.yaml**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flight-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: flight-frontend
  template:
    metadata:
      labels:
        app: flight-frontend
    spec:
      containers:
      - name: flight-frontend
        image: yourusername/flight-frontend:latest
        ports:
        - containerPort: 80
```
19. Create service files for networking:
20. **backend-service.yaml**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: flight-backend-service
spec:
  selector:
    app: flight-backend
  ports:
  - port: 5000
    targetPort: 5000
```
21. **frontend-service.yaml**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: flight-frontend-service
spec:
  selector:
    app: flight-frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```
22. Apply the Kubernetes manifests:
```sh
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-service.yaml
```
### Scaling Strategies
#### Backend Scaling
23. **Horizontal Scaling**: Increase the number of backend instances to handle more traffic:
```sh
# For Docker Compose
docker-compose up -d --scale backend=3
   
# For Kubernetes
kubectl scale deployment flight-backend --replicas=5
```
24. **Database Scaling**:
  - Use a managed PostgreSQL service with read replicas
  - Implement connection pooling
  - Consider database sharding for very large deployments
#### Frontend Scaling
25. **Static Content Delivery**:
  - Build the frontend as static files
  - Serve through a CDN like Cloudflare or AWS CloudFront
26. **Regional Deployment**:
  - Deploy frontend instances in multiple geographic regions
  - Use a global load balancer to route users to the nearest instance
### Monitoring and Maintenance
27. **Health Checks**:
  - Implement `/health` endpoints in the backend
  - Configure Kubernetes liveness and readiness probes
28. **Logging**:
  - Integrate with ELK Stack (Elasticsearch, Logstash, Kibana) or similar
  - Centralize logs for easier debugging
29. **Performance Monitoring**:
  - Use tools like Prometheus and Grafana
  - Monitor response times, error rates, and resource usage
30. **Backup Strategies**:
  - Regular database backups
  - Store backups in a separate geographic region
  - Test restoration procedures periodically
By following these documentation guidelines, you'll have a comprehensive understanding of the Flight Booking System's architecture, deployment options, and scaling strategies.
