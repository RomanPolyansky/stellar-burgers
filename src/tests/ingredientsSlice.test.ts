import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer, {
  selectAllIngredients,
  selectBuns,
  selectMains,
  selectSauces,
  selectIsLoading,
  getIngredients,
} from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

const sampleIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Test Bun 1',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: 'bun-1.png',
    image_large: 'bun-1-large.png',
    image_mobile: 'bun-1-mobile.png'
  },
  {
    _id: 'main-1',
    name: 'Test Main 1',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 30,
    calories: 300,
    price: 200,
    image: 'main-1.png',
    image_large: 'main-1-large.png',
    image_mobile: 'main-1-mobile.png'
  },
  {
    _id: 'sauce-1',
    name: 'Test Sauce 1',
    type: 'sauce',
    proteins: 2,
    fat: 1,
    carbohydrates: 5,
    calories: 50,
    price: 20,
    image: 'sauce-1.png',
    image_large: 'sauce-1-large.png',
    image_mobile: 'sauce-1-mobile.png'
  }
];

const testStore = () =>
  configureStore({
    reducer: {
      ingredients: ingredientsReducer,
    },
  });

describe('тестирование слайса ingredients', () => {
  it('должен возвращать начальное состояние', () => {
    const store = testStore();
    const initialState = store.getState().ingredients;

    expect(initialState).toEqual({
      ingredients: [],
      isLoading: false,
    });
  });

  it('обработка pending: isLoading = true', () => {
    const store = testStore();

    store.dispatch({ type: 'ingredients/getIngredients/pending' });

    const state = store.getState().ingredients;
    expect(state.isLoading).toBe(true);
    expect(state.ingredients).toHaveLength(0);
  });

  it('обработка async getIngredients', async () => {
    const store = testStore();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: sampleIngredients
      })
    }) as jest.Mock;

    await store.dispatch(getIngredients());

    const state = store.getState().ingredients;

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toHaveLength(sampleIngredients.length);
    expect(state.ingredients).toEqual(sampleIngredients);
  });

  it('обработка rejected: isLoading = false', async () => {
    const store = testStore();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        data: []
      })
    }) as jest.Mock;
    
    await store.dispatch(getIngredients());
    const state = store.getState().ingredients;
    
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toHaveLength(0);
  });

  it('селекторы: выборки по типам', () => {
    const store = testStore();

    // preload state via fulfilled
    store.dispatch({
      type: 'ingredients/getIngredients/fulfilled',
      payload: sampleIngredients,
    });

    const rootState = store.getState();

    expect(selectAllIngredients(rootState)).toHaveLength(3);
    expect(selectBuns(rootState)).toHaveLength(1);
    expect(selectMains(rootState)).toHaveLength(1);
    expect(selectSauces(rootState)).toHaveLength(1);
    expect(selectIsLoading(rootState)).toBe(false);
  });
  
});
