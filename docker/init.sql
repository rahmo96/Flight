CREATE TABLE IF NOT EXISTS flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(20) UNIQUE NOT NULL,
    departure VARCHAR(50),
    destination VARCHAR(50),
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP,
    price FLOAT
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    flight_id INTEGER REFERENCES flights(id),
    passenger_name VARCHAR(100),
    passenger_email VARCHAR(100),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
