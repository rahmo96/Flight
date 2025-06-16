import { useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';


const Booking = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Book Flight #{id}</h1>
      <BookingForm flightId={id} />
    </div>
  );
};

export default Booking;
