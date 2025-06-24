import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PersonalArea() {
    const [userBooking, setUserBooking] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            const userStr = localStorage.getItem("user");
            if (!userStr) return;

            const user = JSON.parse(userStr);
            
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/${user.email}`);
                setUserBooking(res.data);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            }
        };

        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/${id}`);
            setUserBooking((prev) => prev.filter((booking) => booking.id !== id));
        } catch (err) {
            console.error("Error cancelling booking:", err);
        }
    };

    if (!userBooking || userBooking.length === 0)
        return <p className="text-center mt-10">No bookings flight found.</p>;

    return (
        
            <table className="table-auto w-full mt-10 border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100"
                        key = {flight.id}>
                        <th>ID</th>
                        <th>Flight Number</th>
                        <th>Passenger Name</th>
                        <th>Passenger Email</th>
                        <th>Booking Date</th>
                        <th>User ID</th>
                        <th>Ticket Sold</th>
                        <th>Cancel Booking</th>
                    </tr>
                </thead>
                <tbody>
                    {userBooking.map((flight) => (
                        <tr key={flight.id}>
                            <td>{flight.id}</td>
                            <td>{flight.flight_number}</td>
                            <td>{flight.passenger_name}</td>
                            <td>{flight.passenger_email}</td>
                            <td>{flight.booking_date}</td>
                            <td>{flight.user_id}</td>
                            <td>{flight.ticket_sold}</td>
                            <td>
                                <button
                                    onClick={() => handleCancel(flight.id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Cancel Flight
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
       
    );
}

export default PersonalArea;
