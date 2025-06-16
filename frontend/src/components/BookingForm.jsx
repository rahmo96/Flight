import { useState } from 'react';
import api from '../services/api';

const BookingForm = ({ flightId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const submitBooking = async () => {
    try {
      await api.post('/bookings', {
        flightId,
        passengerName: name,
        passengerEmail: email,
      });
      setStatus('Booking successful!');
    } catch (err) {
      setStatus('Booking failed.');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Name"
        className="border p-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="bg-green-500 text-white p-2" onClick={submitBooking}>
        Confirm Booking
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default BookingForm;
