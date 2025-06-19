import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/flights`);
        const found = res.data.find((f) => f.id.toString() === id);
        setFlight(found);
      } catch (err) {
        console.error('Failed to fetch flight', err);
      }
    };

    fetchFlight();
  }, [id]);

  const handleBooking = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bookings`, {
        passenger_name: name,
        passenger_email: email,
        flight_number: flight.flightNumber,
      });
      alert('✅ Booking successful!');
      navigate('/');
    } catch (err) {
      console.error('Booking error:', err);
      alert('❌ Booking failed.');
    }
  };

  if (!flight) return <p className="text-center mt-10">Loading flight info...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-md max-w-xl w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-800">Booking Flight: {flight.flightNumber}</h1>

        <div className="text-gray-600 mb-6">
          <div><strong>From:</strong> {flight.departure}</div>
          <div><strong>To:</strong> {flight.destination}</div>
          <div><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</div>
          <div><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}</div>
          <div><strong>Price per seat:</strong> ${flight.price}</div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="number"
            min="1"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
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
  );
}

export default Booking;
