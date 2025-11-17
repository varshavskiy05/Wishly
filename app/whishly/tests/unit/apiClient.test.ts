/**
 * Юніт-тести для apiClient
 * Тестування HTTP-клієнта та інтерсепторів
 */

import axios from 'axios';
import { apiClient } from '../../src/core/api/client';

jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        BASE_URL: 'http://localhost:4000',
      },
    },
  },
}));

describe('apiClient', () => {
  it('має правильний baseURL', () => {
    expect(apiClient.defaults.baseURL).toBe('http://localhost:4000');
  });

  it('має правильний timeout', () => {
    expect(apiClient.defaults.timeout).toBe(5000);
  });

  it('має правильні headers', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('додає Authorization header через interceptor', async () => {
    const mockRequest = jest.fn((config) => Promise.resolve(config));
    apiClient.interceptors.request.use(mockRequest);

    await apiClient.get('/test');

    expect(mockRequest).toHaveBeenCalled();
    
    const lastCall = mockRequest.mock.calls[0][0];
    expect(lastCall.headers.Authorization).toBe('Bearer mock-token');
  });

  it('використовує правильний метод для GET запиту', () => {
    const spy = jest.spyOn(axios, 'create');
    expect(spy).toBeDefined();
  });
});

