// src/services/api.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

/* 1) mock axios קודם */
vi.mock('axios', () => {
  const instance = { get: vi.fn(), post: vi.fn() };
  const create   = vi.fn(() => instance);
  return { default: { create, ...instance } };
});

/* 2) נייבא axios (המוק) */
import axios from 'axios';

let api; // יוחזר דינמית בכל טסט

beforeEach(async () => {
  vi.resetAllMocks();          // מאפס ספירות
  // טוען מחדש את api.js => מפעיל axios.create שוב
  api = (await import('./api')).default;
});

describe('API Service', () => {
  it('configures axios with the correct base URL', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.stringContaining('/api'),
      })
    );
  });

  it('makes GET requests correctly', async () => {
    axios.get.mockResolvedValue({ data: { success: true } });

    await api.get('/flights');

    expect(axios.get).toHaveBeenCalledWith('/flights');
  });

  it('makes POST requests correctly', async () => {
    axios.post.mockResolvedValue({ data: { id: 1 } });

    const body = { name: 'Test' };
    await api.post('/bookings', body);

    expect(axios.post).toHaveBeenCalledWith('/bookings', body);
  });
});
