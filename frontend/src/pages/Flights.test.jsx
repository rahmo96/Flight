import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Flights from './Flights';

/* ---------- axios mock ---------- */
vi.mock('axios', () => {
  const instance = { get: vi.fn() };
  return { default: instance };
});
import axios from 'axios';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Flights Page', () => {
  it('shows loading then flights list', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          flightNumber: 'FL123',          // ←  שדה שה-UI מציג
          departure: 'London',
          destination: 'Paris',
          departureTime: '2025-07-01T08:00:00Z',
          arrivalTime: '2025-07-01T10:15:00Z',
          price: 99,
        },
        {
          id: 2,
          flightNumber: 'FL999',
          departure: 'Berlin',
          destination: 'Rome',
          departureTime: '2025-07-02T14:00:00Z',
          arrivalTime: '2025-07-02T17:30:00Z',
          price: 120,
        },
      ],
    });

    render(
      <MemoryRouter>
        <Flights />
      </MemoryRouter>
    );

    /* ממתינים שהכרטיס הראשון יופיע */
    await waitFor(() => expect(screen.getByText(/fl123/i)).toBeInTheDocument());

    /* גם השני */
    expect(screen.getByText(/fl999/i)).toBeInTheDocument();
  });

  it('shows “No flights found” when API returns empty list', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <Flights />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/no flights found/i)).toBeInTheDocument()
    );
  });
});
