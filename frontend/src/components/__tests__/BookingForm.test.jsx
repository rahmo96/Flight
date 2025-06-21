import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookingForm from '../BookingForm';
import api from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('BookingForm Component', () => {
  const flight_number = 'FL123';
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('renders booking form correctly', () => {
    render(<BookingForm flight_number={flight_number} />);
    
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByText('Confirm Booking')).toBeInTheDocument();
  });
  
  it('updates input fields when user types', () => {
    render(<BookingForm flight_number={flight_number} />);
    
    const nameInput = screen.getByPlaceholderText('Name');
    const emailInput = screen.getByPlaceholderText('Email');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
  });
  
  it('shows success message after successful booking', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    
    render(<BookingForm flight_number={flight_number} />);
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Confirm Booking'));
    
    // Check API was called with correct data
    expect(api.post).toHaveBeenCalledWith('/bookings', {
      flight_number,
      passengerName: 'John Doe',
      passengerEmail: 'john@example.com',
    });
    
    // Check success message appears
    await waitFor(() => {
      expect(screen.getByText('Booking successful!')).toBeInTheDocument();
    });
  });
  
  it('shows error message when booking fails', async () => {
    api.post.mockRejectedValue(new Error('Booking failed'));
    
    render(<BookingForm flight_number={flight_number} />);
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByText('Confirm Booking'));
    
    // Check error message appears
    await waitFor(() => {
      expect(screen.getByText('Booking failed.')).toBeInTheDocument();
    });
  });
});
