import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type BurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TIngredient[];
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
    selectIngredients: (state: BurgerConstructorState) => state.ingredients
  },
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const addedIngredient = action.payload;
      if (addedIngredient.type === 'bun') {
        state.bun = addedIngredient;
        return;
      }
      state.ingredients.push(addedIngredient);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient._id !== action.payload
      );
    }
  }
});

export const { addIngredient, removeIngredient } =
  burgerConstructorSlice.actions;

export const { selectBun, selectIngredients } =
  burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
