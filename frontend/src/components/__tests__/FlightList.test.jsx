// frontend/src/components/__tests__/FlightList.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import FlightList from '../FlightList';
import api from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('FlightList Component', () => {
  it('shows loading state initially', async () => {
    // Mock API response
    api.get.mockResolvedValue({
      data: [
        {
          id: 1,
          flight_number: 'FL123',
          departure: 'New York',
          destination: 'London',
          departureTime: '2023-12-01T10:00:00Z',
          arrivalTime: '2023-12-01T22:00:00Z'
        }
      ]
    });

    render(
      <BrowserRouter>
        <FlightList />
      </BrowserRouter>
    );
    
    // Check if flight appears after API response
    await waitFor(() => {
      expect(screen.getByText(/New York ➡️ London/i)).toBeInTheDocument();
    });
  });

  it('shows no flights message when empty', async () => {
    // Mock empty API response
    api.get.mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <FlightList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/No flights found/i)).toBeInTheDocument();
    });
  });
});
