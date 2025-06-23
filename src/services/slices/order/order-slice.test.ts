import { expect, test } from '@jest/globals';
import { initialState, orderSlice, resetOrderModalData } from './order-slice';
import { RequestStatus } from '@utils/types';
import { ORDER_SLICE_NAME } from '@utils/constants';
import { createOrder, getOrder } from '@thunk';

const mockOrder = {
  _id: '1',
  status: 'done',
  name: '23',
  createdAt: 'сегодня',
  updatedAt: 'сегодня',
  number: 12,
  ingredients: ['', '']
};

describe('[order-slice]', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('тесты синхронных экшенов: reducers', () => {
    test('[resetOrderModalData] сброс данных модального окна', () => {
      const state = {
        ...initialState,
        currentOrder: mockOrder,
        orderRequestError: '2',
        orderModalData: mockOrder,
        status: RequestStatus.Idle
      };
      const newState = orderSlice.reducer(state, resetOrderModalData());
      expect(newState).toEqual(initialState);
    });
  });

  describe('тесты асинхронных экшенов: extraReducers', () => {
    test('[createOrder]: создание заказа. Проверка обрабатки состояния "fulfilled"', () => {
      const state = {
        ...initialState,
        orderRequest: false,
        currentOrder: mockOrder,
        orderModalData: mockOrder,
        status: RequestStatus.Success
      };
      const newState = orderSlice.reducer(
        state,
        createOrder.fulfilled(mockOrder, '', ['', ''])
      );
      expect(newState).toEqual(state);
    });
    test('[getOrder]: получение данных о заказе. Проверка обрабатки состояния "fulfilled"', () => {
      const state = {
        ...initialState,
        status: RequestStatus.Success,
        orderRequest: false,
        orderByNumber: mockOrder
      };
      const newState = orderSlice.reducer(
        state,
        getOrder.fulfilled(mockOrder, '', 12345)
      );
      expect(newState).toEqual(state);
    });
    test('[isActionPending] тест для общих pending матчеров. Проверка обработки состояния "pending"', () => {
      const mockPendingAction = {
        type: `${ORDER_SLICE_NAME}/someAsyncThunk/pending`,
        meta: { requestId: 'test-id', arg: undefined }
      };
      const startingState = {
        ...initialState,
        status: RequestStatus.Idle
      };
      const newState = orderSlice.reducer(startingState, mockPendingAction);
      expect(newState.status).toEqual(RequestStatus.Loading);
    });
    test('[isActionRejected] тест для общих rejected матчеров. Проверка обработки состояния "rejected"', () => {
      const mockRejectedAction = {
        type: `${ORDER_SLICE_NAME}/someThunkAction/rejected`,
        meta: {
          requestId: 'test-id',
          arg: undefined,
          aborted: false,
          condition: false
        }
      };
      const startingState = {
        ...initialState,
        status: RequestStatus.Loading
      };
      const newState = orderSlice.reducer(startingState, mockRejectedAction);
      expect(newState.status).toEqual(RequestStatus.Failed);
    });
  });
});
