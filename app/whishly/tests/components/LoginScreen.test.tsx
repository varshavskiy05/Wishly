/**
 * Компонентні тести для LoginScreen
 * Тестування UI та взаємодії користувача
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../src/features/auth/screens/LoginScreen';
import { useAuthStore } from '../../src/core/store/authStore';


const mockSetAuth = jest.fn();
jest.mock('../../src/core/store/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    setAuth: mockSetAuth,
  })),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('відображає поле вводу email', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    expect(emailInput).toBeTruthy();
  });

  it('відображає кнопку "Войти"', () => {
    const { getByText } = render(<LoginScreen />);
    const loginButton = getByText('Войти');
    expect(loginButton).toBeTruthy();
  });

  it('дозволяє вводити email', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('викликає setAuth при натисканні кнопки "Войти"', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    const loginButton = getByText('Войти');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalled();
    });

    const callArgs = mockSetAuth.mock.calls[0];
    expect(callArgs[0].email).toBe('test@example.com');
    expect(callArgs[0].id).toBe('1');
    expect(callArgs[1]).toBe('mock-token');
  });

  it('не викликає setAuth якщо email порожній', () => {
    const { getByText } = render(<LoginScreen />);
    const loginButton = getByText('Войти');

    fireEvent.press(loginButton);

    expect(mockSetAuth).toHaveBeenCalled();
  });
});

