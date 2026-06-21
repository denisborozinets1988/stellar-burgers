import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface TFeedsState {
  orders: TOrder[];
  isRequested: boolean;
  error: string | null;
}

const initialState: TFeedsState = {
  orders: [],
  isRequested: false,
  error: null
};

export const getFeeds = createAsyncThunk(
  'orders',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    selectFeed: (sliceState) => sliceState.orders,
    selectFeedIsRequested: (sliceState) => sliceState.isRequested,
    selectFeedError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.orders = [];
        state.isRequested = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.orders = [];
        state.isRequested = false;
        state.error = 'Ой, что-то пошло не так...';
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.isRequested = false;
        state.error = null;
      });
  }
});

export const { selectFeed, selectFeedIsRequested, selectFeedError } =
  feedSlice.selectors;
export default feedSlice.reducer;
