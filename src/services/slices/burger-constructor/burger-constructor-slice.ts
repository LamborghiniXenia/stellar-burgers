import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit"
import { TConstructorIngredient, TIngredient } from "@utils-types";
import { BURGERCONSTRUCTOR_SLICE_NAME } from "@utils/constants";
import { v4 as uuid4 } from 'uuid';

interface BurgerConstructorState {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];   
}

const initialState: BurgerConstructorState = {
    bun: null,
    ingredients: [],
}

export const burgerConstructorSlice = createSlice({
    name: BURGERCONSTRUCTOR_SLICE_NAME,
    initialState,
    reducers:{
      addIngredient: {
          reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
            if (action.payload.type === 'bun') {
              state.bun = action.payload as TConstructorIngredient;
            } else {
              state.ingredients.push(action.payload as TConstructorIngredient);
            }
          },
          prepare: (ingredient: TIngredient) => {
            return { payload: { ...ingredient, uniqueId: uuid4() } as TConstructorIngredient };
          }
      },
      removeIngredient: (state, action: PayloadAction<string>) => {
        const idToRemove = action.payload;
        state.ingredients = state.ingredients.filter(
          (ingredient) => ingredient.uniqueId !== idToRemove
        );
      },
      moveIngredient: (state, action: PayloadAction<{ from: number; to: number }>) => {
        const { from, to } = action.payload;
        const newIngredients = [...state.ingredients];
        const [movedIngredient] = newIngredients.splice(from, 1);
        newIngredients.splice(to, 0, movedIngredient);
        state.ingredients = newIngredients;
      },
      clearConstructor: (state) => {
        state.bun = null;
        state.ingredients = [];
      }
    },
    selectors:{
        selectConstructorBun: state => state.bun,
        selectConstructorIngredients: state => state.ingredients,
    },
}) 

export const { selectConstructorBun, selectConstructorIngredients} = burgerConstructorSlice.selectors
export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } = burgerConstructorSlice.actions;
