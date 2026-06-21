import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TFeedCounts = {
  total: number;
  totalToday: number;
};

interface TFeedsState {
  orders: TOrder[];
  counts: TFeedCounts;
  isRequested: boolean;
  error: string | null;
}

const counts: TFeedCounts = {
  total: 0,
  totalToday: 0
};

const initialState: TFeedsState = {
  orders: [],
  isRequested: false,
  counts: counts,
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
    selectFeedCounts: (sliceState) => sliceState.counts,
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
        state.counts.total = action.payload.total;
        state.counts.totalToday = action.payload.totalToday;
        state.isRequested = false;
        state.error = null;
      });
  }
});

export const {
  selectFeed,
  selectFeedCounts,
  selectFeedIsRequested,
  selectFeedError
} = feedSlice.selectors;
export default feedSlice.reducer;
