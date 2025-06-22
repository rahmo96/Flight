// src/pages/Home.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Home from './Home';

// Mock Layout
vi.mock('../components/Layout', () => ({
  default: ({ children }) => <div data-testid="layout-mock">{children}</div>,
}));

// Define mockNavigate outside to track it
const mockNavigate = vi.fn();

// Mock react-router-dom including useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Home component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders search form and popular destinations', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Find Your Perfect Flight')).toBeInTheDocument();
    expect(screen.getByLabelText('Departure')).toBeInTheDocument();
    expect(screen.getByLabelText('Destination')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Passengers')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search flights/i })).toBeInTheDocument();
    expect(screen.getByText('Popular Destinations')).toBeInTheDocument();
  });

  test('form inputs update on change and navigation happens on submit', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const departureInput = screen.getByLabelText('Departure');
    const destinationInput = screen.getByLabelText('Destination');
    const dateInput = screen.getByLabelText('Date');
    const passengersInput = screen.getByLabelText('Passengers');

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateStr = futureDate.toISOString().split('T')[0];

    fireEvent.change(departureInput, { target: { value: 'New York' } });
    fireEvent.change(destinationInput, { target: { value: 'London' } });
    fireEvent.change(dateInput, { target: { value: dateStr } });
    fireEvent.change(passengersInput, { target: { value: '2' } });

    expect(departureInput.value).toBe('New York');
    expect(destinationInput.value).toBe('London');
    expect(dateInput.value).toBe(dateStr);
    expect(passengersInput.value).toBe('2');

    fireEvent.click(screen.getByRole('button', { name: /search flights/i }));

    expect(mockNavigate).toHaveBeenCalledWith(
      `/flights?departure=New York&destination=London&date=${dateStr}&passengers=2`
    );
  });

  test('clicking a popular destination triggers navigation', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const cityCard = screen.getByText('Paris');
    fireEvent.click(cityCard);

    expect(mockNavigate).toHaveBeenCalledWith('/flights?destination=Paris');
  });
});
