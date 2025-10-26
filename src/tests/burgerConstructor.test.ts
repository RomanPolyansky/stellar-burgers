import { configureStore } from "@reduxjs/toolkit";
import burgerConstructorSlice from "..//slices/burgerConstructorSlice";

const sampleData = {
  bun: null,
  ingredients: [
    {
      _id: '1',
      name: 'Test-Bun',
      type: 'bun',
      price: 50,
      sortingId: 'bun-1'
    },
    {
      _id: '2',
      name: 'Test-Main',
      type: 'main',
      price: 30,
      sortingId: 'main-1'
    },
    {
      _id: '3',
      name: 'Test-Sauce',
      type: 'sauce',
      price: 20,
      sortingId: 'sauce-1'
    }
  ]
};

const testStore = () =>
  configureStore({
    reducer: {
      burgerConstructor: burgerConstructorSlice,
    }
  });

describe('тестирование слайса burgerConstructor', function() {
  it('должен возвращать начальное состояние', () => {
    const store = testStore();

    const initialState = store.getState().burgerConstructor;

    expect(initialState).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('обработка экшена добавления ингредиента', () => {
    const store = testStore();

    store.dispatch({
      type: 'burgerConstructor/addIngredient',
      payload: sampleData.ingredients[1]
    });

    const state = store.getState().burgerConstructor;

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(sampleData.ingredients[1]);
  });

  it('обработка экшена добавления булки', () => {
    const store = testStore();

    store.dispatch({
      type: 'burgerConstructor/addBun',
      payload: sampleData.ingredients[0]
    });

    const state = store.getState().burgerConstructor;

    expect(state.bun).toEqual(sampleData.ingredients[0]);
  });

  it('обработка экшена удаления ингредиента', () => {
    const store = testStore();

    store.dispatch({
      type: 'burgerConstructor/addIngredient',
      payload: sampleData.ingredients[1]
    });

    const state = store.getState().burgerConstructor;

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(sampleData.ingredients[1]);

    store.dispatch({
      type: 'burgerConstructor/removeIngredient',
      payload: sampleData.ingredients[1].sortingId
    });

    const newState = store.getState().burgerConstructor;

    expect(newState.ingredients).toHaveLength(0);
  });

  it('обработка экшена изменения порядка ингредиентов в начинке', () => {
    const store = testStore();

    store.dispatch({
      type: 'burgerConstructor/addIngredient',
      payload: sampleData.ingredients[1]
    });

    store.dispatch({
      type: 'burgerConstructor/addIngredient',
      payload: sampleData.ingredients[2]
    });

    let state = store.getState().burgerConstructor;
    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toEqual(sampleData.ingredients[1]);
    expect(state.ingredients[1]).toEqual(sampleData.ingredients[2]);

    store.dispatch({
      type: 'burgerConstructor/moveIngredientUpInList',
      payload: sampleData.ingredients[2].sortingId
    });

    state = store.getState().burgerConstructor;
    expect(state.ingredients[0]).toEqual(sampleData.ingredients[2]);
    expect(state.ingredients[1]).toEqual(sampleData.ingredients[1]);

    store.dispatch({
      type: 'burgerConstructor/moveIngredientDownInList',
      payload: sampleData.ingredients[2].sortingId
    });
    state = store.getState().burgerConstructor;
    expect(state.ingredients[0]).toEqual(sampleData.ingredients[1]);
    expect(state.ingredients[1]).toEqual(sampleData.ingredients[2]);
  });

});