import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type IngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectBuns: (state) => state.ingredients.filter((x) => x.type === 'bun'),
    selectMains: (state) => state.ingredients.filter((x) => x.type === 'main'),
    selectSauces: (state) =>
      state.ingredients.filter((x) => x.type === 'sauce'),
    selectAllIngredients: (state) => state.ingredients,
    selectIsLoading: (state) => state.isLoading,
    selectIngredientById: (state, id) =>
      state.ingredients.find((ingredient) => ingredient._id === id)
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const {
  selectBuns,
  selectMains,
  selectSauces,
  selectAllIngredients,
  selectIsLoading,
  selectIngredientById
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
