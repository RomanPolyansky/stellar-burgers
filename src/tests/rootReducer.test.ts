import { rootReducer } from '../services/store';

describe('тестирование редьюсера rootReducer', () => {
  it('возвращает корректный initialState при state = undefined и UNKNOWN_ACTION', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' } as any);

    // Ожидаем точные initialState каждого среза
    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
      },
      burgerConstructor: {
        bun: null,
        ingredients: [],
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: true,
      },
      order: {
        openOrder: null,
        isLoading: false,
        profileOrders: [],
        newOrder: null,
        orderRequest: false,
      },
      login: {
        user: null,
        isAuthChecked: false,
        errorText: '',
      },
    });
  });
});