import { configureStore } from '@reduxjs/toolkit';
import feedReducer, {
  selectFeedOrders,
  selectTotal,
  selectTotalToday,
  selectIsLoading,
  getFeedOrders,
} from '../slices/feedSlice';
import type { TOrder } from '@utils-types';

const sampleOrders: TOrder[] = [
  {
    _id: 'order-1',
    status: 'done',
    name: 'Test Order 1',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    number: 101,
    ingredients: ['bun-1', 'main-1', 'sauce-1'],
  },
  {
    _id: 'order-2',
    status: 'pending',
    name: 'Test Order 2',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    number: 102,
    ingredients: ['bun-1', 'main-1'],
  },
];

const testStore = () =>
  configureStore({
    reducer: {
      feed: feedReducer,
    },
  });

describe('тестирование слайса feed', () => {
  it('должен возвращать начальное состояние', () => {
    const store = testStore();
    const initialState = store.getState().feed;

    expect(initialState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: true,
    });
  });

  it('обработка pending: isLoading = true', () => {
    const store = testStore();

    store.dispatch({ type: 'feed/getFeedOrders/pending' });

    const state = store.getState().feed;
    expect(state.isLoading).toBe(true);
    expect(state.orders).toHaveLength(0);
  });

  it('обработка async getFeedOrders (fulfilled)', async () => {
    const store = testStore();

    // Mock fetch to satisfy checkResponse and getFeedsApi expectations
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        orders: sampleOrders,
        total: 200,
        totalToday: 20,
      }),
    }) as jest.Mock;

    await store.dispatch(getFeedOrders());

    const state = store.getState().feed;
    expect(state.isLoading).toBe(false);
    expect(state.orders).toHaveLength(sampleOrders.length);
    expect(state.orders).toEqual(sampleOrders);
    expect(state.total).toBe(200);
    expect(state.totalToday).toBe(20);
  });

  it('обработка rejected: isLoading = false', async () => {
    const store = testStore();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        orders: [],
        total: 0,
        totalToday: 0,
      }),
    }) as jest.Mock;

    await store.dispatch(getFeedOrders());

    const state = store.getState().feed;
    expect(state.isLoading).toBe(false);
    expect(state.orders).toHaveLength(0);
  });

  it('селекторы: список заказов, тоталы и загрузка', () => {
    const store = testStore();

    store.dispatch({
      type: 'feed/getFeedOrders/fulfilled',
      payload: { orders: sampleOrders, total: 500, totalToday: 50 },
    });

    const rootState = store.getState();

    expect(selectFeedOrders(rootState)).toEqual(sampleOrders);
    expect(selectTotal(rootState)).toBe(500);
    expect(selectTotalToday(rootState)).toBe(50);
    expect(selectIsLoading(rootState)).toBe(false);
  });
});
