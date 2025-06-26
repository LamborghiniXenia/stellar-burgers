import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestStatus, TIngredient } from "@utils-types"
import { INGREDIENTS_SLICE_NAME } from "@utils/constants";
import { getIngredients } from "@thunk";

interface IngredientsState {
    ingredients: TIngredient[];
    status: RequestStatus;    
}

export const initialState: IngredientsState = {
    ingredients: [],
    status: RequestStatus.Idle,
}

export const ingredientsSlice = createSlice({
    name: INGREDIENTS_SLICE_NAME,
    initialState,
    reducers:{},
    selectors:{
        selectIngredients: state => state.ingredients,
        selectIngredientsIsLoading: state => state.status === RequestStatus.Loading
    },
    extraReducers: (builder) => {
        builder
            .addCase(getIngredients.pending, (state) => {
                state.status = RequestStatus.Loading;
            })
            .addCase(getIngredients.rejected, (state, action) => {
                state.status = RequestStatus.Failed;
                state.ingredients = []
            })
            .addCase(getIngredients.fulfilled, (state, action: PayloadAction<TIngredient[]>) => {
                state.status = RequestStatus.Success;
                state.ingredients = action.payload;
            })
    }
}) 

export const { selectIngredients, selectIngredientsIsLoading } = ingredientsSlice.selectors
