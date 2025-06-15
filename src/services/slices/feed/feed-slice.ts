import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TFeedsResponse } from "@api"
import { RequestStatus, TOrder } from "@utils-types"
import { FEED_SLICE_NAME } from "@utils/constants";
import { getFeed } from "@thunk";

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: RequestStatus;  
}

const initialState: FeedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    status: RequestStatus.Idle,
}

export const feedSlice = createSlice({
    name: FEED_SLICE_NAME,
    initialState,
    reducers:{},
    selectors:{
        selectFeedOrders: state => state.orders,
        selectFeedTotal: state => state.total,
        selectFeedTotalToday: state => state.totalToday,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFeed.pending, (state) => {
                state.status = RequestStatus.Loading;
            })
            .addCase(getFeed.rejected, (state, action) => {
                state.status = RequestStatus.Failed;
                state.orders = [];
                state.total = 0;
                state.totalToday = 0;
            })
            .addCase(getFeed.fulfilled, (state, action: PayloadAction<TFeedsResponse>) => {
                state.status = RequestStatus.Success;
                state.orders = action.payload.orders;
                state.total = action.payload.total;
                state.totalToday = action.payload.totalToday;
            })
    }
}) 

export const  { selectFeedOrders, selectFeedTotal, selectFeedTotalToday } = feedSlice.selectors;
