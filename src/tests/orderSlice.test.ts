import { configureStore } from '@reduxjs/toolkit';
import orderReducer, { orderBurger } from '../slices/orderSlice';
import type { TOrder } from '@utils-types';
import * as api from '@api';
import { orderBurgerApi } from '@api';

const newOrder: TOrder = {
  _id: 'o-3',
  status: 'done',
  name: 'Order 3',
  createdAt: '2025-01-03T00:00:00.000Z',
  updatedAt: '2025-01-03T00:00:00.000Z',
  number: 1003,
  ingredients: ['bun-1', 'main-1', 'sauce-1']
};

const newOrderResponse = {
  order: newOrder
};
// export type TOrder = {
//   _id: string;
//   status: string;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
//   number: number;
//   ingredients: string[];
// };

const testStore = () =>
  configureStore({
    reducer: {
      order: orderReducer
    }
  });

describe('тестирование слайса order', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('должен возвращать начальное состояние', () => {
    const store = testStore();
    const initialState = store.getState().order;

    expect(initialState).toEqual({
      openOrder: null,
      isLoading: false,
      profileOrders: [],
      newOrder: null,
      orderRequest: false
    });
  });

  it('orderBurger: pending/fulfilled/rejected', async () => {
    const store = testStore();

    // pending
    store.dispatch({ type: 'order/orderBurger/pending' });
    expect(store.getState().order.orderRequest).toBe(true);

    // fulfilled (payload has order)
    store.dispatch({
      type: 'order/orderBurger/fulfilled',
      payload: { order: newOrder }
    });
    let state = store.getState().order;
    expect(state.orderRequest).toBe(false);
    expect(state.newOrder).toEqual(newOrder);

    // rejected
    store.dispatch({ type: 'order/orderBurger/rejected' });
    state = store.getState().order;
    expect(state.orderRequest).toBe(false);
  });

  it('fulfilled', async () => {
    const store = testStore();

    store.dispatch({
      type: 'order/orderBurger/fulfilled',
      payload: { order: newOrder }
    });

    const state = store.getState().order;
    expect(state.orderRequest).toBe(false);
    expect(state.newOrder).toEqual(newOrder);
  });
});
