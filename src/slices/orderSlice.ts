import { getOrderByNumberApi, getOrdersApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrder } from "@utils-types";

type TOrderState = {
  openOrder: TOrder | null;
  profileOrders: TOrder[];
  isLoading: boolean;
}

const initialState: TOrderState = {
  openOrder: null,
  isLoading: false,
  profileOrders: []
};

export const getOrderById = createAsyncThunk(
  'order/getById',
  async (_id: number) => await getOrderByNumberApi(_id)
)

export const getProfileOrders = createAsyncThunk(
  'order/getProfileOrders',
  async () => await getOrdersApi()
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    selectOpenOrder: (state: TOrderState) => state.openOrder,
    selectIsLoading: (state: TOrderState) => state.isLoading,
    selectProfileOrders: (state: TOrderState) => state.profileOrders
  },
  reducers: {
    clearOpenOrder: (state, action) => {
      state.openOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.openOrder = action.payload.orders[0];
        state.isLoading = false;
      })
      .addCase(getOrderById.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getProfileOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.profileOrders = action.payload;
        state.isLoading = false;
      })
      .addCase(getProfileOrders.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const { clearOpenOrder } = orderSlice.actions;
export const { selectProfileOrders, selectOpenOrder, selectIsLoading } = orderSlice.selectors;

export default orderSlice.reducer;