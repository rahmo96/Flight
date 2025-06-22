# Flight Booking System

A full-stack application for flight search and booking management.

## Project Overview

This flight booking system provides a user-friendly interface to search for flights, view availability, and make reservations. The application handles seat capacity management, ensuring that flights are only displayed when seats are available.

## Features

- Flight search by departure location, destination, and date
- Real-time seat availability tracking
- Multiple ticket booking support
- Booking management (creation and cancellation)
- Automatic inventory management of available seats

## Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Testing**: Jest

### Frontend
- **Framework**: React 19
- **Routing**: React Router
- **API Client**: Axios
- **Styling**: Tailwind CSS
- **Testing**: Vitest

## Project Structure

```
Flight/
├── backend/           # Express API server
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── models/        # Sequelize models
│   └── routes/        # API routes
│
├── frontend/          # React client application
│   ├── public/        # Static files
│   └── src/           # React source code
│       ├── components/# Reusable components
│       ├── pages/     # Page components
│       └── services/  # API services
│
└── docker-compose.yml # Docker configuration
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- PostgreSQL database (or Docker)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Flight
   ```

2. Install dependencies:
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory with:
     ```
     DATABASE_URL=your_database_connection_string
     PORT=5000
     ```
   - Create a `.env` file in the frontend directory with:
     ```
     VITE_BACKEND_URL=http://localhost:5000
     ```

4. Start the application:
   ```
   # Start with Docker
   docker-compose up

   # Or start manually
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Flights
- `GET /api/flights` - Get all available flights
- `POST /api/flights` - Create a new flight

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create a new booking
- `DELETE /api/bookings/:id` - Delete a booking

## Database Schema

### Flights Table
- `flight_number` (Primary Key): Unique identifier for each flight
- `departure`: Departure city
- `destination`: Destination city
- `departure_time`: Scheduled departure time
- `arrival_time`: Scheduled arrival time
- `price`: Ticket price
- `capacity`: Total number of seats on the flight
- `available_seats`: Current number of available seats

### Bookings Table
- `id` (Primary Key): Unique identifier for each booking
- `flight_number` (Foreign Key): Reference to the flight
- `passenger_name`: Name of the passenger
- `passenger_email`: Email of the passenger
- `booking_date`: Date when the booking was made
- `ticket_sold`: Number of tickets sold in this booking

## Development

### Running Tests
```
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Deployment

The application can be deployed using Docker containers. The included `docker-compose.yml` file configures both the frontend and backend services.

To deploy:
```
docker-compose up -d
```

## License

This project is licensed under the MIT License.
