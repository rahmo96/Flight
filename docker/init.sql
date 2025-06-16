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

INSERT INTO flights (flight_number, departure, destination, departure_time, arrival_time, price)
VALUES
  ('AF456', 'Paris', 'Rome', '2025-07-03T09:00:00', '2025-07-03T11:00:00', 150),
  ('LH789', 'Berlin', 'Amsterdam', '2025-07-04T14:30:00', '2025-07-04T16:00:00', 130),
  ('EK210', 'Dubai', 'Tel Aviv', '2025-07-05T06:45:00', '2025-07-05T08:15:00', 200),
  ('DL321', 'New York', 'Los Angeles', '2025-07-06T12:00:00', '2025-07-06T15:30:00', 300),
  ('AZ654', 'Rome', 'Milan', '2025-07-07T17:00:00', '2025-07-07T18:00:00', 80),
  ('TK987', 'Istanbul', 'Athens', '2025-07-08T10:15:00', '2025-07-08T11:45:00', 110),
  ('EL321', 'Tel Aviv', 'Barcelona', '2025-07-09T05:00:00', '2025-07-09T09:00:00', 250),
  ('AA741', 'Chicago', 'Toronto', '2025-07-10T13:00:00', '2025-07-10T15:00:00', 180),
  ('QF003', 'Sydney', 'Melbourne', '2025-07-11T07:30:00', '2025-07-11T09:00:00', 140),
  ('IB987', 'Madrid', 'Lisbon', '2025-07-12T16:00:00', '2025-07-12T17:15:00', 125);

