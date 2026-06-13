import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TIngredient } from '@utils-types';

interface IIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: true,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    ingredients(state) {
      state.ingredients;
    }
  },
  selectors: {
    selectIngredients: (sliceState) => sliceState.ingredients,
    selectIsLoading: (sliceState) => sliceState.isLoading,
    selectError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ingredients = action.payload;
    });
    builder.addCase(fetchIngredients.rejected, (state) => {
      state.isLoading = false;
      state.error = 'Ой, что-то пошло не так...';
    });
  }
});

export const { selectIngredients, selectIsLoading, selectError } =
  ingredientsSlice.selectors;

export const { ingredients } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
