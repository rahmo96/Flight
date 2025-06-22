import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Home() {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    navigate(`/flights?departure=${departure}&destination=${destination}&date=${date}`);
    console.log("Hi");
  };

  return (
    <div className="min-h-screen bg-blue-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-semibold mb-6">Millions of cheap flights. One simple search.</h1>

      <div className="bg-white text-black w-full max-w-4xl rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="From"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          className="p-3 rounded border"
        />
        <input
          type="text"
          placeholder="To"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="p-3 rounded border"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-3 rounded border"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      <div className="flex gap-6 mt-10 text-center">
        <div className="bg-white text-blue-900 rounded-lg px-6 py-4 shadow-md cursor-pointer hover:bg-blue-100">
          ✈️ Flights
        </div>
        <div className="bg-white text-blue-900 rounded-lg px-6 py-4 shadow-md cursor-pointer hover:bg-blue-100">
          🏨 Hotels
        </div>
        <div className="bg-white text-blue-900 rounded-lg px-6 py-4 shadow-md cursor-pointer hover:bg-blue-100">
          🚗 Car rental
        </div>
      </div>
    </div>
  );
}

export default Home;
