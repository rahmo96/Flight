import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function FlightList() {
  const [flights, setFlights] = useState([]);
  const query = useQuery();

  useEffect(() => {
    const fetchFlights = async () => {
      const res = await api.get('/flights', {
        params: {
          departure: query.get('departure'),
          destination: query.get('destination'),
        },
      });
      setFlights(res.data);
    };
    fetchFlights();
  }, [query]);

  return (
    <div>
      {flights.map((flight) => (
        <div key={flight.id} className="border p-4 m-2">
          <h3>{flight.departure} ➡️ {flight.destination}</h3>
          <Link to={`/booking/${flight.id}`} className="text-blue-500">Book Now</Link>
        </div>
      ))}
    </div>
  );
}

export default FlightList;
