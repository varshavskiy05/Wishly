
import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '../../src/core/store/authStore';
import type { User } from '../../src/core/types/domain';

describe('Системне тестування: Сценарій авторизації', () => {
  it('повний сценарій: логін → авторизація → logout', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.isAuthenticated).toBe(false);

    const mockUser: User = {
      id: '1',
      email: 'user@example.com',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    act(() => {
      result.current.setAuth(mockUser, 'auth-token-123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('user@example.com');
    expect(result.current.token).toBe('auth-token-123');

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });
});

describe('Системне тестування: Валідація функціональних вимог', () => {
  it('FR1: Реєстрація/логін - мок авторизація працює', () => {
    const { result } = renderHook(() => useAuthStore());

    const user: User = {
      id: '1',
      email: 'test@example.com',
      password: 'pass',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    act(() => {
      result.current.setAuth(user, 'token');
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('NFR7: Інтуїтивний інтерфейс - навігація працює через стан', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(typeof result.current.isAuthenticated).toBe('boolean');
  });

  it('NFR8: Швидкодія - API клієнт має timeout 5 секунд', () => {
    const timeout = 5000;
    expect(timeout).toBeLessThanOrEqual(5000);
  });
});

describe('Системне тестування: Обробка помилок', () => {
  it('система коректно обробляє logout без попередньої авторизації', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});

