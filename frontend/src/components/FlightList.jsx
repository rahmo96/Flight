import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';

const useQuery = () => new URLSearchParams(useLocation().search);

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const query = useQuery();

  useEffect(() => {
    console.log("useeffect");
    const fetchFlights = async () => {
      try {
        const res = await api.get('/flights', {
          params: {
            departure: query.get('departure'),
            destination: query.get('destination'),
          },
        });
        console.log('Flights from API:', res.data);
        setFlights(res.data);
        console.log(flights.departureTime);
        console.log(flights.arrivalTime);
      console.log(flights.departureTime)
      console.log(flights.arrivalTime)
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };
    fetchFlights();
  }, [query]);  

  return (

    <div>
      {flights.length > 0 ? (
        flights.map((flight) => (
          <div key={flight.id} className="border p-2 my-2">
            <h3 className="font-semibold">
              {flight.departure} ➡️ {flight.destination}
            </h3>
            <p>
              Departure: {new Date(flight.departureTime).toLocaleString()}
              <br />
              Arrival: {new Date(flight.arrivalTime).toLocaleString()}
            </p>
          <Link
            className="text-blue-600"
            to={`/booking/${flight.flight_number}`}
          >
            Book this flight
          </Link>
          </div>
        ))
      ) : (
        <p>No flights found.</p>
      )}
    </div>
  );
};

export default FlightList;
