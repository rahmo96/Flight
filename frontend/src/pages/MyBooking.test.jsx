import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyBookings from './MyBookings';
import axios from 'axios';
import { test, vi } from 'vitest';

// mock axios
vi.mock('axios');

describe('MyBookings', () => {
  const user = { email: 'test@example.com' };

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(user));
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('Present bookings if exist', async () => {
    // Mock useParams and useNavigate
    axios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          flight_number: 'FL123',
          passenger_name: 'Almog',
          passenger_email: 'Almog@test.com',
          booking_date: '2024-01-01T10:00:00Z',
          ticket_sold: 2
        }
      ]
    });

    render(
        <BrowserRouter>
            <MyBookings />
        </BrowserRouter>
        );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/FL123/)).toBeInTheDocument();
      expect(screen.getByText(/Almog/)).toBeInTheDocument();
      expect(screen.getByText(/Tickets: 2/)).toBeInTheDocument();
    });
  });

  test('Display a message if there are not bookings', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render( <BrowserRouter>
            <MyBookings />
        </BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText(/No bookings flight found/i)).toBeInTheDocument();
    });
  });

  test('There is no server contact if the client is not connected', async () => {
    localStorage.removeItem('user');

    render( <BrowserRouter>
            <MyBookings />
        </BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText(/No bookings flight found/i)).toBeInTheDocument();
    });

    expect(axios.get).not.toHaveBeenCalled();
  });

  test('Cancel Booking', async () => {
    const booking = {
      id: 42,
      flight_number: 'FL123',
      passenger_name: 'Ben',
      passenger_email: 'ben@test.com',
      booking_date: '2024-05-15T12:00:00Z',
      ticket_sold: 1
    };

    //First display
    axios.get.mockResolvedValueOnce({ data: [booking] });
    // Cancel booking
    axios.delete.mockResolvedValueOnce({ status: 200 });
    // Display after booking have been cancelled
    axios.get.mockResolvedValueOnce({ data: [] });

    render( <BrowserRouter>
            <MyBookings />
        </BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText(/FL123/)).toBeInTheDocument();
    });

    const cancelBtn = screen.getByText(/Cancel/i);
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining(`/api/bookings/${booking.id}`)
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/No bookings flight found/i)).toBeInTheDocument();
    });
  });
});
