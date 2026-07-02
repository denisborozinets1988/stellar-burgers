import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import { removeConstructorItemsAll } from './constructorSlice';
import { useEffect } from 'react';

interface TOrderState {
  order: TOrder | null;
  isRequested: boolean;
  error: string | null;
  orderSuccess: boolean;
}

const initialState: TOrderState = {
  order: null,
  isRequested: false,
  error: null,
  orderSuccess: false
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
    selectOrder: (sliceState) => sliceState.order,
    selectOrderSuccess: (sliceState) => sliceState.orderSuccess
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.order = null;
        state.isRequested = true;
        state.orderSuccess = false;
        state.error = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.order = null;
        state.isRequested = false;
        state.orderSuccess = false;
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
        state.orderSuccess = true;
        state.error = null;
      });
  }
});

export const {
  selectOrderIsRequested,
  selectOrderError,
  selectOrder,
  selectOrderSuccess
} = orderCurrentSlice.selectors;
export const { removeOrder } = orderCurrentSlice.actions;
export default orderCurrentSlice.reducer;
