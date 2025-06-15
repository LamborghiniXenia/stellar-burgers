import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TFeedsResponse } from '@api';
import { RequestStatus, TOrder } from '@utils-types';
import { ORDERS_SLICE_NAME } from '@utils/constants';
import { getOrders } from '@thunk';

type OrdersState = {
  orders: TOrder[];
  status: RequestStatus;
};

const initialState: OrdersState = {
  orders: [],
  status: RequestStatus.Idle
};

export const ordersSlice = createSlice({
  name: ORDERS_SLICE_NAME,
  initialState,
  reducers: {},
  selectors: {
    selectOrders: state => state.orders,
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getOrders.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.status = RequestStatus.Success;
          state.orders = action.payload.orders;
        }
      )
      .addCase(getOrders.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.status = RequestStatus.Failed;
        state.orders = [];
      });
  }
});
export const { selectOrders } = ordersSlice.selectors;


