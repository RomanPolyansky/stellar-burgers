import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true
};

export const getFeedOrders = createAsyncThunk(
  'feed/getFeedOrders',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectIsLoading: (state) => state.isLoading
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeedOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(getFeedOrders.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const {
  selectFeedOrders,
  selectTotal,
  selectTotalToday,
  selectIsLoading
} = feedSlice.selectors;

export default feedSlice.reducer;
