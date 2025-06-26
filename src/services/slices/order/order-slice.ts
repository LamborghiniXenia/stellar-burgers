import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '@utils-types';
import { ORDER_SLICE_NAME } from '@utils/constants';
import { createOrder, getOrder } from '@thunk';
import { isActionPending, isActionRejected } from '@utils/redux';

type OrderState = {
  orderByNumber: TOrder | null;
  currentOrder: TOrder | null;
  orderRequest: boolean;
  orderRequestError: string | null;
  orderModalData: TOrder | null;
  status: RequestStatus;
};

export const initialState: OrderState = {
  orderByNumber: null, //загрузка заказа по номеру - хранится объект с заказом
  currentOrder: null,
  orderRequest: false, // для генерации модального окна - запрос на создание заказа
  orderRequestError: null,
  orderModalData: null,
  status: RequestStatus.Idle, //для загрузки заказа по номеру - хранится статус этого запроса
};

export const orderSlice = createSlice({
  name: ORDER_SLICE_NAME,
  initialState,
  reducers: {
    resetOrderModalData(state) {
      state.orderModalData = null;
      state.orderRequestError = null;
      state.currentOrder = null;
      state.status = RequestStatus.Idle
    }
  },
  selectors: {
    selectOrderRequest: state => state.orderRequest,
    selectOrderModalData: state => state.orderModalData,
    selectOrder: state => state.orderByNumber,
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.currentOrder = action.payload;
          state.orderModalData = action.payload;
          state.status = RequestStatus.Success;
        }
      )
      .addCase(getOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.status = RequestStatus.Success;
        state.orderRequest = false;
        state.orderByNumber = action.payload;
      })
      .addMatcher(isActionPending(ORDER_SLICE_NAME), (state) => {
        state.orderRequest = true;
        state.status = RequestStatus.Loading;
      })
      .addMatcher(isActionRejected(ORDER_SLICE_NAME), (state) => {
        state.orderRequest = false;
        state.status = RequestStatus.Failed;
      });
  }
});

export const { selectOrderRequest, selectOrderModalData, selectOrder } = orderSlice.selectors;
export const { resetOrderModalData } = orderSlice.actions;


