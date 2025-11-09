// src/pages/Booking.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import Booking from './Booking';

// 🟢 Mock axios
vi.mock('axios');

// 🟢 Mock useParams ו-useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ flight_number: 'FL123' }),
    useNavigate: () => vi.fn(),
  };
});

describe('Booking component', () => {
  const mockFlight = {
    flight_number: 'FL123',
    flightNumber: 'FL123', // לכותרת
    departure: 'New York',
    destination: 'London',
    departure_time: '2023-10-15T10:00:00Z',
    arrival_time: '2023-10-15T22:00:00Z',
    price: 450,
    available_seats: 45,
  };

  beforeEach(() => {
    // סטאב ל-axios
    axios.get.mockResolvedValue({ data: [mockFlight] });
    axios.post.mockResolvedValue({ data: { id: 1 } });

    // שים מייל ב-localStorage (כמו באפליקציה)
    localStorage.setItem('user', JSON.stringify({ email: 'john@example.com' }));

    // Stub ל-alert
    window.alert = vi.fn();
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('renders flight details and booking form', async () => {
    render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>,
    );

    // מסך טעינה
    expect(screen.getByText('Loading flight info...')).toBeInTheDocument();

    // אחרי שה-flight נטען
    await waitFor(() => {
      expect(screen.getByText(/Booking Flight: FL123/i)).toBeInTheDocument();

      // בגלל תגיות <strong> הטקסט מתפצל – נשתמש בבדיקת textContent
      expect(
        screen.getByText((_, el) => el?.textContent === 'From: New York'),
      ).toBeInTheDocument();

      expect(
        screen.getByText((_, el) => el?.textContent === 'To: London'),
      ).toBeInTheDocument();

      expect(
        screen.getByText((_, el) => el?.textContent === 'Price per seat: $450'),
      ).toBeInTheDocument();
    });

    // שדה שם + כפתור אישור קיימים
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Confirm Booking')).toBeInTheDocument();

    // שדה אימייל מוצג כ-disabled עם value מהמקומי
    const emailInput = screen.getByDisplayValue('john@example.com');
    expect(emailInput).toBeDisabled();
  });

  test('updates total price when changing seats', async () => {
    render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>,
    );

    // Total הראשוני
    await waitFor(() => {
      expect(screen.getByText('Total: $450.00')).toBeInTheDocument();
    });

    // שינוי כמות
    const seatsInput = screen.getByRole('spinbutton');
    fireEvent.change(seatsInput, { target: { value: '3' } });

    expect(screen.getByText('Total: $1350.00')).toBeInTheDocument();
  });

  test('submits booking successfully', async () => {
    render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>,
    );

    // ודא שהטופס נטען
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    });

    // רק שם – אין צורך לשנות אימייל
    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'John Doe' },
    });

    fireEvent.click(screen.getByText('Confirm Booking'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        passenger_name: 'John Doe',
        passenger_email: 'john@example.com', // מהמקומי
        flight_number: 'FL123',
        ticket_sold: 1,
      });
      expect(window.alert).toHaveBeenCalledWith('✅ Booking successful!');
    });
  });
});
