import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock your page components
vi.mock('./pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}));

vi.mock('./pages/Flights', () => ({
  default: () => <div data-testid="flights-page">Flights Page</div>
}));

vi.mock('./pages/Booking', () => ({
  default: () => <div data-testid="booking-page">Booking Page</div>
}));

describe('App Component Routing', () => {
  it('renders home page at root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
  
  it('renders flights page at /flights route', () => {
    render(
      <MemoryRouter initialEntries={['/flights']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('flights-page')).toBeInTheDocument();
  });
  
  it('renders booking page at /booking/:flight_number route', () => {
    render(
      <MemoryRouter initialEntries={['/booking/FL123']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('booking-page')).toBeInTheDocument();
  });
});
