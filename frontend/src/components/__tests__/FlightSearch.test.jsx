// frontend/src/components/__tests__/FlightSearch.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import FlightSearch from '../FlightSearch';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe('FlightSearch Component', () => {
  it('renders input fields and search button', () => {
    render(
      <BrowserRouter>
        <FlightSearch />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText('Departure')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Destination')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search flights/i })).toBeInTheDocument();
  });

  it('updates input values when typed into', () => {
    render(
      <BrowserRouter>
        <FlightSearch />
      </BrowserRouter>
    );
    
    const departureInput = screen.getByPlaceholderText('Departure');
    const destinationInput = screen.getByPlaceholderText('Destination');
    
    fireEvent.change(departureInput, { target: { value: 'New York' } });
    fireEvent.change(destinationInput, { target: { value: 'London' } });
    
    expect(departureInput.value).toBe('New York');
    expect(destinationInput.value).toBe('London');
  });
});
