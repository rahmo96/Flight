import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from '../components/Layout';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/flights?departure=${departure}&destination=${destination}&date=${date}&passengers=${passengers}`);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-blue-500 to-blue-700 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Find Your Perfect Flight</h1>
          <p className="text-xl mb-8">Discover amazing destinations at the best prices</p>
        </div>
      </div>

      <div className="container mx-auto -mt-10">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-700 mb-2">Departure</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="City or airport"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-700 mb-2">Destination</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="City or airport"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-700 mb-2">Passengers</label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full p-3 border border-gray-300 rounded"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                required
              />
            </div>
            <div className="flex items-end w-full md:w-auto">
              <button
                type="submit"
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
              >
                Search Flights
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">✈️</div>
            <h3 className="text-xl font-bold mb-2">Worldwide Destinations</h3>
            <p className="text-gray-600">Explore hundreds of destinations around the globe with our extensive flight network.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">Best Price Guarantee</h3>
            <p className="text-gray-600">We offer competitive prices on flights to ensure you get the best deal possible.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
            <p className="text-gray-600">Book with confidence knowing your personal and payment details are secure.</p>
          </div>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Popular Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {['New York', 'London', 'Tokyo', 'Paris'].map(city => (
              <div 
                key={city} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setDestination(city);
                  navigate(`/flights?destination=${city}`);
                }}
              >
                <div className="h-40 bg-gray-300"></div>
                <div className="p-4">
                  <h3 className="font-bold">{city}</h3>
                  <p className="text-sm text-gray-600">Explore flights</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
