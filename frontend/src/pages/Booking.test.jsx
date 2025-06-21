import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Booking from './Booking';

/* ---------- axios mock ---------- */
vi.mock('axios', () => {
  const instance = {
    get:  vi.fn(),
    post: vi.fn(() => Promise.resolve({ data: { success: true } })),
  };
  return { default: instance };
});
import axios from 'axios';

/* helper – render /booking/FL123 */
const renderWithRoute = () =>
  render(
    <MemoryRouter initialEntries={['/booking/FL123']}>
      <Routes>
        <Route path="/booking/:flight_number" element={<Booking />} />
      </Routes>
    </MemoryRouter>
  );

const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
beforeEach(() => vi.clearAllMocks());

describe('Booking Page', () => {
  const mockFlight = {
    id: 1,
    flight_number: 'FL123',  // ← לשימוש ב-find()
    flightNumber:  'FL123',  // ← לשימוש ב-UI
    departure: 'Paris',
    destination: 'Rome',
    departureTime: '2025-07-01T09:00:00Z',
    arrivalTime:   '2025-07-01T12:00:00Z',
    price: 150,
  };

  it('displays flight details after data loads', async () => {
    axios.get.mockResolvedValueOnce({ data: [mockFlight] });

    renderWithRoute();

    /* מחכים שתוצג הכותרת עם מספר הטיסה */
    expect(await screen.findByText(/fl123/i)).toBeInTheDocument();
    expect(screen.getByText(/paris/i)).toBeInTheDocument();
    expect(screen.getByText(/rome/i)).toBeInTheDocument();
  });

  it('submits booking successfully', async () => {
    axios.get.mockResolvedValueOnce({ data: [mockFlight] });

    renderWithRoute();

    fireEvent.change(await screen.findByPlaceholderText(/full name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(await screen.findByPlaceholderText(/email address/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.click(screen.getByText(/confirm booking/i));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/bookings$/),
        {
          passenger_name:  'John Doe',
          passenger_email: 'john@example.com',
          flight_number:   'FL123',
        }
      )
    );

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringMatching(/booking successful/i)
    );
  });
});
