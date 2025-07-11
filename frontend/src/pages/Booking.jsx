import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

function Booking() {
  const { flight_number } = useParams();
  const navigate = useNavigate();

  // ⬇️ email של המשתמש המחובר
  const userEmail =
    JSON.parse(localStorage.getItem('user') || '{}')?.email || '';

  const [flight, setFlight] = useState(null);
  const [name, setName] = useState('');
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/flights`
        );
        const found = res.data.find(
          (f) => f.flight_number.toString() === flight_number
        );
        setFlight(found);
      } catch (err) {
        console.error('Failed to fetch flight', err);
      }
    };

    fetchFlight();
  }, [flight_number]);

  const handleBooking = async () => {
    if (!userEmail) {
      alert('🔒 You must be logged in to book.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bookings`, {
        passenger_name: name,
        passenger_email: userEmail,
        flight_number: flight.flight_number,
        ticket_sold: parseInt(seats, 10)
      });
      alert('✅ Booking successful!');
      navigate('/');
    } catch (err) {
      console.error('Booking error:', err);
      alert('❌ Booking failed.');
    }
  };

  if (!flight)
    return <p className="text-center mt-10">Loading flight info...</p>;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        <div className="bg-white rounded-lg shadow-md max-w-xl w-full p-6">
          <h1 className="text-2xl font-bold mb-4 text-blue-800">
            Booking Flight: {flight.flight_number}
          </h1>

          <div className="text-gray-600 mb-6">
            <div>
              <strong>From:</strong> {flight.departure}
            </div>
            <div>
              <strong>To:</strong> {flight.destination}
            </div>
            <div>
              <strong>Departure:</strong>{' '}
              {new Date(flight.departure_time).toLocaleString()}
            </div>
            <div>
              <strong>Arrival:</strong>{' '}
              {new Date(flight.arrival_time).toLocaleString()}
            </div>
            <div>
              <strong>Price per seat:</strong> ${flight.price}
            </div>
            <div>
              <strong>Available seats:</strong> {flight.available_seats}
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded"
            />

            {/* מוצג למידע בלבד – לא ניתן לערוך */}
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full p-3 border rounded bg-gray-100 text-gray-500"
            />

            <input
              type="number"
              min="1"
              max={flight.available_seats}
              value={seats}
              onChange={(e) =>
                setSeats(
                  Math.min(parseInt(e.target.value, 10) || 1, flight.available_seats)
                )
              }
              className="w-full p-3 border rounded"
            />

            <div className="text-right text-lg font-semibold text-green-700">
              Total: ${(seats * flight.price).toFixed(2)}
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Booking;
