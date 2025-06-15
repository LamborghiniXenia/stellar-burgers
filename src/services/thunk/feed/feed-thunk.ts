import { getFeedsApi } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FEED_SLICE_NAME } from "@utils/constants";

export const getFeed = createAsyncThunk(
    `${FEED_SLICE_NAME}`,
    async () => {
      return await getFeedsApi();
  }
)
