import { expect, test } from '@jest/globals';
import { initialState, ordersSlice } from './orders-slice';
import { getOrders } from '@thunk';
import { RequestStatus } from '@utils/types';

const mockOrders = [
  {
    _id: '1',
    status: 'done',
    name: '23',
    createdAt: 'сегодня',
    updatedAt: 'сегодня',
    number: 12,
    ingredients: ['', '']
  },
  {
    _id: '2',
    status: 'done',
    name: '24',
    createdAt: 'сегодня',
    updatedAt: 'сегодня',
    number: 14,
    ingredients: ['', '']
  }
];

const mockFeedsResponse = {
  success: true,
  orders: mockOrders,
  total: mockOrders.length,
  totalToday: 1
};

describe('[orders-slice]', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('тесты асинхронных экшенов: extraReducers', () => {
    test('[getOrders]: получение информации о заказах. Проверка обрабатки состояния "fulfilled"', () => {
      const state = {
        orders: mockOrders,
        status: RequestStatus.Success
      };

      const newState = ordersSlice.reducer(
        {
          ...initialState,
          status: RequestStatus.Loading
        },
        getOrders.fulfilled(mockFeedsResponse, '')
      );
      expect(newState).toEqual(state);
    });

    test('[getOrders]: получение информации о заказах. Проверка обрабатки состояния "pending"', () => {
      const state = ordersSlice.reducer(
        {
          ...initialState,
          orders: mockOrders,
          status: RequestStatus.Idle
        },
        getOrders.pending('')
      );

      expect(state.status).toEqual(RequestStatus.Loading);
      expect(state.orders.length).toEqual(2);
    });
    test('[getOrders]: получение информации о заказах. Проверка обрабатки состояния "rejected"', () => {
      const error = new Error('test error');
      const state = ordersSlice.reducer(
        {
          ...initialState,
          orders: mockOrders,
          status: RequestStatus.Loading
        },
        getOrders.rejected(error, '', undefined)
      );
      expect(state.status).toEqual(RequestStatus.Failed);
      expect(state.orders).toEqual([]);
    });
  });
});
