import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type BurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    selectBun: (state: BurgerConstructorState) => state.bun,
    selectIngredients: (state: BurgerConstructorState) => state.ingredients,
    selectAllIngredients: (state: BurgerConstructorState) => [
      state.bun,
      ...state.ingredients,
      state.bun,
    ]
  },
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.sortingId !== action.payload
      );
    },
    moveIngredientUpInList: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (ingredient) => ingredient.sortingId === action.payload
      );
      if (index > 0) {
        const [movedIngredient] = state.ingredients.splice(index, 1);
        state.ingredients.splice(index - 1, 0, movedIngredient);
      }
    },
    moveIngredientDownInList: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (ingredient) => ingredient.sortingId === action.payload
      );
      if (index < state.ingredients.length - 1) {
        const [movedIngredient] = state.ingredients.splice(index, 1);
        state.ingredients.splice(index + 1, 0, movedIngredient);
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const { addBun, clearConstructor, addIngredient, removeIngredient, moveIngredientUpInList, moveIngredientDownInList } =
  burgerConstructorSlice.actions;

export const { selectBun, selectIngredients, selectAllIngredients } =
  burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
