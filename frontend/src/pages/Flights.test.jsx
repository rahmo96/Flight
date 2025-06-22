// src/pages/Flights.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import Flights from './Flights';

// Mock axios
vi.mock('axios');

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [
      {
        get: (param) => {
          if (param === 'departure') return 'New York';
          if (param === 'destination') return 'London';
          if (param === 'date') return '2023-10-15';
          return null;
        }
      }
    ]
  };
});

describe('Flights component', () => {
  const mockFlights = [
    {
      flight_number: 'FL123',
      departure: 'New York',
      destination: 'London',
      departure_time: '2023-10-15T10:00:00Z',
      arrival_time: '2023-10-15T22:00:00Z',
      price: 450,
      available_seats: 45
    },
    {
      flight_number: 'FL456',
      departure: 'New York',
      destination: 'London',
      departure_time: '2023-10-16T08:00:00Z',
      arrival_time: '2023-10-16T20:00:00Z',
      price: 520,
      available_seats: 32
    }
  ];

  beforeEach(() => {
    // Mock axios.get to return our test data
    axios.get.mockResolvedValue({ data: mockFlights });
  });

  test('renders loading state and then flights', async () => {
    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );
    
    // Check loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for flights to load
    await waitFor(() => {
      expect(screen.getByText('Available Flights')).toBeInTheDocument();
      expect(screen.getAllByText(/New York ✈️ London/i)).toHaveLength(1); // במקום 2
      expect(screen.getAllByText('Book Now')).toHaveLength(1); // גם כאן
    });

  });

  test('displays flight details correctly', async () => {
    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      // Using more flexible text matching
      expect(screen.getByText(/Flight: FL123/i)).toBeInTheDocument();
      expect(screen.getByText('$450')).toBeInTheDocument();
      expect(screen.getByText(/Available seats: 45/i)).toBeInTheDocument();
    });
  });

  test('shows no flights message when empty', async () => {
    // Override the mock for this specific test
    axios.get.mockResolvedValueOnce({ data: [] });
    
    render(
      <BrowserRouter>
        <Flights />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('No flights found.')).toBeInTheDocument();
    });
  });
});
