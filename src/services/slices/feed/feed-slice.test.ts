import { expect, test } from '@jest/globals';
import { feedSlice, initialState } from './feed-slice';
import { RequestStatus } from '@utils/types';
import { getFeed } from '@thunk';

describe('[feed-slice]', () => {
  test('getFeed.fulfilled: проверка обновления orders, total, totalToday', () => {
    const orders = [
      {
        _id: '1',
        status: 'pending',
        name: 'Заказ 1',
        createdAt: '2025-06-21',
        updatedAt: '2025-06-21',
        number: 1,
        ingredients: ['ingredient1', 'ingredient2']
      }
    ];
    const total = 1;
    const totalToday = 1;

    const feedResponse = {
      success: true,
      orders,
      total,
      totalToday
    };

    const state = {
      orders,
      total,
      totalToday,
      status: RequestStatus.Success
    };

    const newState = feedSlice.reducer(
      {
        ...initialState,
        status: RequestStatus.Loading
      },
      getFeed.fulfilled(feedResponse, '')
    );

    expect(newState).toEqual(state);
  });
  test('getFeed.pending: проверка обновления orders, total, totalToday', () => {
    const state = feedSlice.reducer(
      {
        ...initialState,
        orders: [],
        total: 12,
        totalToday: 122,
        status: RequestStatus.Idle
      },
      getFeed.pending('')
    );

    expect(state.status).toEqual(RequestStatus.Loading);
    expect(state.orders.length).toEqual(0);
    expect(state.total).toEqual(12);
    expect(state.totalToday).toEqual(122);
  });
  test('getFeed.rejected: проверка обновления orders, total, totalToday', () => {
    const error = new Error ('test error')
    const state = feedSlice.reducer(
      {
        ...initialState,
        orders: [],
        total: 50,
        totalToday: 2,
        status: RequestStatus.Loading,
      },
      getFeed.rejected(error, '', undefined)
    );
    expect(state.status).toEqual(RequestStatus.Failed);
    expect(state.orders).toEqual([]);
    expect(state.total).toEqual(0);
    expect(state.totalToday).toEqual(0);
  });
});
