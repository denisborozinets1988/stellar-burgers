import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface TOrderState {
  order: TOrder | null;
  isRequested: boolean;
  error: string | null;
}

const initialState: TOrderState = {
  order: null,
  isRequested: false,
  error: null
};

export const orderBurger = createAsyncThunk(
  'orderCurrent',
  async (ingredients: string[]) => await orderBurgerApi(ingredients)
);

const orderCurrentSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    removeOrder: (state) => {
      state.order = null;
    }
  },
  selectors: {
    selectOrderIsRequested: (sliceState) => sliceState.isRequested,
    selectOrderError: (sliceState) => sliceState.error,
    selectOrder: (sliceState) => sliceState.order
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.order = null;
        state.isRequested = true;
        state.error = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.order = null;
        state.isRequested = false;
        state.error = 'Ой, что-то пошло не так...';
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        const newOrder = action.payload.order;
        state.order = {
          _id: newOrder._id,
          status: newOrder.status,
          name: newOrder.name,
          createdAt: newOrder.createdAt,
          updatedAt: newOrder.updatedAt,
          number: newOrder.number,
          ingredients: action.meta.arg
        };
        state.isRequested = false;
        state.error = null;
      });
  }
});

export const { selectOrderIsRequested, selectOrderError, selectOrder } =
  orderCurrentSlice.selectors;
export const { removeOrder } = orderCurrentSlice.actions;
export default orderCurrentSlice.reducer;
