import { useEffect, useState } from 'react';
import axios from 'axios';

function PersonalArea() {
  const [userBooking, setUserBooking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Safely get user email from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setUserBooking([]);
          setLoading(false);
          return;
        }
        const user = JSON.parse(userStr);
        const userEmail = user?.email;
        if (!userEmail) {
          setUserBooking([]);
          setLoading(false);
          return;
        }

        // Use the correct endpoint for by-email
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings/by-email/${userEmail}`
        );
        setUserBooking(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setUserBooking([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!userBooking || userBooking.length === 0)
    return <p className="text-center mt-10">No bookings flight found.</p>;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      <div className="grid gap-4">
        {userBooking.map((booking) => (
          <div key={booking.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
            <div className='text-black'>
              <div className="font-semibold">{booking.flight_number}</div>
              <div>{booking.passenger_name} ({booking.passenger_email})</div>
              <div>Booked on: {new Date(booking.booking_date).toLocaleString()}</div>
              <div>Tickets: {booking.ticket_sold}</div>
            </div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleCancel(booking.id)}
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PersonalArea;
