
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

function Flights() {
  console.log("🚀 Flight.jsx loaded");

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const departure = searchParams.get('departure');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/flights`);
        const filtered = res.data.filter((f) =>
          (!departure || f.departure.toLowerCase().includes(departure.toLowerCase())) &&
          (!destination || f.destination.toLowerCase().includes(destination.toLowerCase())) &&
          (!date || f.departure_time.startsWith(date))
        );
        setFlights(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching flights', err);
        setLoading(false);
      }
    };

    fetchFlights();
  }, [departure, destination, date]);

  const handleBooking = (flight) => {
    navigate(`/booking/${flight.flight_number}`);
  };

  return (
    <Layout>
      <div className="bg-[your-color] w-full py-10"> {/* Full-width container */}
      <div className="container mx-auto">
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col w-full">
      <h1 className="text-3xl font-bold text-center mb-4 md:mb-8 text-blue-900">Available Flights</h1>
      
      {loading ? (
        <div className="flex items-center justify-center flex-grow">
          <p className="text-xl">Loading...</p>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto">
          {flights.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {flights.map((f) => (
                <div key={f.flight_number} className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                  <div>
                    <div className="text-xl font-semibold text-blue-800">
                      {f.departure} ✈️ {f.destination}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(f.departure_time).toLocaleString()} → {new Date(f.arrival_time).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Flight: {f.flight_number}</div>
                    <div className="text-sm text-gray-500">Available seats: {f.available_seats}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600 mb-2">${f.price}</div>
                    <button
                      onClick={() => handleBooking(f)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-xl">No flights found.</p>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  </div>
  </Layout>);
}

export default Flights;

