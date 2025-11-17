jest.mock('expo/src/winter/runtime.native', () => ({
  __esModule: true,
  default: {},
}), { virtual: true });

jest.mock('expo/src/winter/installGlobal', () => ({
  __esModule: true,
  default: {},
}), { virtual: true });

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
