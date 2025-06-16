import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FlightSearch() {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/flights?departure=${departure}&destination=${destination}`);
  };

  return (
    <div className="p-4">
      <input placeholder="Departure" value={departure} onChange={(e) => setDeparture(e.target.value)} className="border p-2 m-2"/>
      <input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} className="border p-2 m-2"/>
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2">Search</button>
    </div>
  );
}

export default FlightSearch;
