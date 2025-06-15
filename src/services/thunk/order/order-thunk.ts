import { getOrderByNumberApi, orderBurgerApi } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ORDER_SLICE_NAME } from "@utils/constants";


export const createOrder = createAsyncThunk(
  `${ORDER_SLICE_NAME}/createOrder`,
  async (ingredientsIds: string[]) => { 
    return (await orderBurgerApi(ingredientsIds)).order; 
  }
);

export const getOrder = createAsyncThunk(
    `${ORDER_SLICE_NAME}/getOrder`,
    async (orderNumber: number) => {
      return (await getOrderByNumberApi(orderNumber)).orders[0];
    })
