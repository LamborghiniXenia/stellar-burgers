import { combineSlices } from '@reduxjs/toolkit';
import { burgerConstructorSlice, feedSlice, ingredientsSlice, orderSlice, ordersSlice, userSlice } from '../services/slices';
import { initialState as constructorInitialState } from '../services/slices/burger-constructor/burger-constructor-slice';
import { initialState as feedInitialState } from '../services/slices/feed/feed-slice';
import { initialState as ingredientsInitialState } from '../services/slices/ingredients/ingredients-slice';
import { initialState as orderInitialState } from '../services/slices/order/order-slice';
import { initialState as ordersInitialState } from '../services/slices/orders/orders-slice';
import { initialState as userInitialState } from '../services/slices/user/user-slice';

const rootReducer = combineSlices({
  [userSlice.name]: userSlice.reducer,
  [burgerConstructorSlice.name]: burgerConstructorSlice.reducer,
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [ordersSlice.name]: ordersSlice.reducer,
  [feedSlice.name]: feedSlice.reducer
});

describe('rootReducer', () => {
  test('Проверяют правильную инициализацию rootReducer с undefined состоянием и экшеном, который не обрабатывается ни одним редьюсером', () => {
    const newState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const expectedState = {
      [userSlice.name]: userInitialState,
      [burgerConstructorSlice.name]: constructorInitialState,
      [ingredientsSlice.name]: ingredientsInitialState,
      [orderSlice.name]: orderInitialState,
      [ordersSlice.name]: ordersInitialState,
      [feedSlice.name]: feedInitialState,
    };
    expect(newState).toEqual(expectedState);
  });
});
