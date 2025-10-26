// Mock cookie helpers used by the slice to avoid document access in Node
jest.mock('../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(),
}));

import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../slices/loginSlice';

const testUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('тестирование слайса login', () => {

  // Мок localStorage
  beforeAll(() => {
    if (!(global as any).localStorage) {
      let store: Record<string, string> = {};
      const localStorageMock = {
        getItem: jest.fn((key: string) => (key in store ? store[key] : null)),
        setItem: jest.fn((key: string, value: string) => { store[key] = String(value); }),
        removeItem: jest.fn((key: string) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; }),
      } as unknown as Storage;
      Object.defineProperty(global, 'localStorage', { value: localStorageMock });
    }
  });

  afterEach(() => {
    // сбросить состояние моков между тестами
    (localStorage.clear as unknown as jest.Mock)?.mock?.calls !== undefined
      ? (localStorage.clear as unknown as jest.Mock)()
      : localStorage.clear();
    jest.resetAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    const store = configureStore({
      reducer: {
        login: loginReducer,
      },
    });
    const initialState = store.getState().login;
    expect(initialState).toEqual({
      user: null,
      isAuthChecked: false,
      errorText: ''
    });
  });

  it('должен устанавливать состояние при успешном логине', () => {
    const store = configureStore({
      reducer: {
        login: loginReducer,
      },
    });

    store.dispatch({
      type: 'login/login/fulfilled',
      payload: { user: testUser, accessToken: 'acc', refreshToken: 'ref' },
    });
    const state = store.getState().login;
    expect(state.user).toEqual(testUser);
    expect(state.errorText).toBe('');
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен устанавливать ошибку при неудачном логине', () => {
    const store = configureStore({
      reducer: {
        login: loginReducer,
      },
    });
    store.dispatch({
      type: 'login/login/rejected',
      error: { message: 'Invalid credentials' },
    });

    const state = store.getState().login;
    expect(state.user).toBeNull();
    expect(state.errorText).toBe('Invalid credentials');
    expect(state.isAuthChecked).toBe(true);
  });
});