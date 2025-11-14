/**
 * Юніт-тести для authStore
 * Тестування управління станом авторизації
 */

import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '../../src/core/store/authStore';
import type { User } from '../../src/core/types/domain';

describe('authStore', () => {
  beforeEach(() => {
    // Скидаємо стан перед кожним тестом
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  it('має початковий стан: user = null, token = null, isAuthenticated = false', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('setAuth встановлює user, token та isAuthenticated = true', () => {
    const { result } = renderHook(() => useAuthStore());

    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockToken = 'test-token-123';

    act(() => {
      result.current.setAuth(mockUser, mockToken);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logout скидає user, token та isAuthenticated = false', () => {
    const { result } = renderHook(() => useAuthStore());

    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Спочатку встановлюємо авторизацію
    act(() => {
      result.current.setAuth(mockUser, 'test-token');
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Потім виконуємо logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('setAuth оновлює існуючий стан', () => {
    const { result } = renderHook(() => useAuthStore());

    const firstUser: User = {
      id: '1',
      email: 'first@example.com',
      password: 'pass1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const secondUser: User = {
      id: '2',
      email: 'second@example.com',
      password: 'pass2',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    act(() => {
      result.current.setAuth(firstUser, 'token1');
    });

    expect(result.current.user?.id).toBe('1');

    act(() => {
      result.current.setAuth(secondUser, 'token2');
    });

    expect(result.current.user?.id).toBe('2');
    expect(result.current.token).toBe('token2');
  });
});

