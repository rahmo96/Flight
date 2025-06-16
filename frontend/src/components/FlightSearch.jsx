import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FlightSearch = () => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const searchFlights = () => {
    navigate(`/flights?departure=${departure}&destination=${destination}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Departure"
        className="border p-2"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
      />
      <input
        type="text"
        placeholder="Destination"
        className="border p-2"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2" onClick={searchFlights}>
        Search Flights
      </button>
    </div>
  );
};

export default FlightSearch;
