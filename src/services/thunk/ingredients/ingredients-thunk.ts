import { getIngredientsApi } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { INGREDIENTS_SLICE_NAME } from "@utils/constants";

export const getIngredients = createAsyncThunk(
    `${INGREDIENTS_SLICE_NAME}`,
    async () => {
      return await getIngredientsApi();
  }
)
