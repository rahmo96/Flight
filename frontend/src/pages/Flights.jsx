import { useLocation } from 'react-router-dom';
import FlightList from '../components/FlightList'; 


const useQuery = () => new URLSearchParams(useLocation().search);

const Flights = () => {
  const query = useQuery();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">
        Flights from {query.get('departure')} to {query.get('destination')}
      </h1>
      <FlightList />
    </div>
  );
};

export default Flights;
