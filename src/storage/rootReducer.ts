import { combineSlices } from '@reduxjs/toolkit';
import {
  userSlice,
  burgerConstructorSlice,
  ordersSlice,
  feedSlice,
  ingredientsSlice,
  orderSlice
} from '@slices';

const rootReducer = combineSlices({
  [userSlice.name]: userSlice.reducer,
  [burgerConstructorSlice.name]: burgerConstructorSlice.reducer,
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [ordersSlice.name]: ordersSlice.reducer,
  [feedSlice.name]: feedSlice.reducer
});

export default rootReducer;
