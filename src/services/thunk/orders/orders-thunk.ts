import { getOrdersApi } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ORDERS_SLICE_NAME } from "@utils/constants";

export const getOrders = createAsyncThunk(
    `${ORDERS_SLICE_NAME}/getOrders`,
    async () => {
      return await getOrdersApi();
  }
)
