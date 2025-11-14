// Setup file for Jest tests

// Mock Expo Winter runtime to avoid import errors
jest.mock('expo/src/winter/runtime.native', () => ({
  __esModule: true,
  default: {},
}), { virtual: true });

jest.mock('expo/src/winter/installGlobal', () => ({
  __esModule: true,
  default: {},
}), { virtual: true });

// Mock expo-constants before any imports
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        BASE_URL: 'http://localhost:4000',
      },
    },
  },
}));

jest.mock('expo-clipboard', () => ({
  __esModule: true,
  setStringAsync: jest.fn(() => Promise.resolve()),
  getStringAsync: jest.fn(() => Promise.resolve('')),
}));
