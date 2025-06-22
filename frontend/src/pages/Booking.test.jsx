import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import Booking from './Booking';

// Mock axios
vi.mock('axios');

// Mock useParams and useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ flight_number: 'FL123' }),
    useNavigate: () => vi.fn()
  };
});

describe('Booking component', () => {
  const mockFlight = {
    flight_number: 'FL123',
    flightNumber: 'FL123', // for display in title
    departure: 'New York',
    destination: 'London',
    departure_time: '2023-10-15T10:00:00Z',
    arrival_time: '2023-10-15T22:00:00Z',
    price: 450,
    available_seats: 45
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [mockFlight] });
    axios.post.mockResolvedValue({ data: { id: 1 } });

    window.alert = vi.fn();
  });

  test('renders flight details and booking form', async () => {
    render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading flight info...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Booking Flight: FL123/i)).toBeInTheDocument();
      
      // Using function matcher to handle <strong> tag splitting text
      expect(screen.getByText((_, el) => el?.textContent === 'From: New York')).toBeInTheDocument();
      expect(screen.getByText((_, el) => el?.textContent === 'To: London')).toBeInTheDocument();
      expect(screen.getByText((_, el) => el?.textContent === 'Price per seat: $450')).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Confirm Booking')).toBeInTheDocument();
  });

  test('updates total price when changing seats', async () => {
    render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Total: $450.00')).toBeInTheDocument();
    });

    const seatsInput = screen.getByRole('spinbutton');
    fireEvent.change(seatsInput, { target: { value: '3' } });

    expect(screen.getByText('Total: $1350.00')).toBeInTheDocument();
  });

  test('submits booking successfully', async () => {
    render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'John Doe' }
    });

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'john@example.com' }
    });

    fireEvent.click(screen.getByText('Confirm Booking'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        {
          passenger_name: 'John Doe',
          passenger_email: 'john@example.com',
          flight_number: 'FL123',
          ticket_sold: 1
        }
      );
      expect(window.alert).toHaveBeenCalledWith('✅ Booking successful!');
    });
  });
});
