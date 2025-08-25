import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrder } from "@utils-types";

type TOrderState = {
  openOrder: TOrder | null;
  profileOrders: TOrder[];
  isLoading: boolean;
  orderRequest: boolean;
  newOrder: TOrder | null;
}

const initialState: TOrderState = {
  openOrder: null,
  isLoading: false,
  profileOrders: [],
  newOrder: null,
  orderRequest: false
};

export const getOrderById = createAsyncThunk(
  'order/getById',
  async (_id: number) => await getOrderByNumberApi(_id)
)

export const getProfileOrders = createAsyncThunk(
  'order/getProfileOrders',
  async () => await getOrdersApi()
);

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (ingredients: string[]) => await orderBurgerApi(ingredients)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    selectOpenOrder: (state: TOrderState) => state.openOrder,
    selectIsLoading: (state: TOrderState) => state.isLoading,
    selectProfileOrders: (state: TOrderState) => state.profileOrders,
    selectNewOrder: (state: TOrderState) => state.newOrder,
    selectOrderRequest: (state: TOrderState) => state.orderRequest
  },
  reducers: {
    clearOpenOrder: (state, action) => {
      state.openOrder = null;
    },
    clearOrder: (state) => {
      state.newOrder = null;
      state.orderRequest = false;
    }
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
      })
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.newOrder = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const { clearOpenOrder, clearOrder } = orderSlice.actions;
export const { selectProfileOrders, 
  selectOpenOrder, selectIsLoading, 
  selectNewOrder, selectOrderRequest } = orderSlice.selectors;

export default orderSlice.reducer;