import { expect, test } from '@jest/globals';
import { ingredientsSlice, initialState } from './ingredients-slice';
import { RequestStatus, TIngredient } from '@utils/types';
import { getIngredients } from '@thunk';

const ingredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Пончик',
        type: 'mane',
        proteins: 2,
        fat: 1644,
        carbohydrates: 2,
        calories: 415,
        price: 31,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      {
        _id: '2',
        name: 'Круассан',
        type: 'mane',
        proteins: 2,
        fat: 1644,
        carbohydrates: 2,
        calories: 415,
        price: 31,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];

describe('[ingredients-slice]', () => {
  test('getIngredients.fulfilled: проверка обновления ingredients', () => {
    const ingredientsResponse = {
      success: true,
      ingredients
    };

    const state = {
      ingredients,
      status: RequestStatus.Success
    };

    const newState = ingredientsSlice.reducer(
      {
        ...initialState,
        status: RequestStatus.Loading
      },
      getIngredients.fulfilled(ingredients, '')
    );

    expect(newState).toEqual(state);
  });
  test('getIngredients.pending: проверка обновления ingredients', () => {
    const state = ingredientsSlice.reducer(
      {
        ...initialState,
        ingredients: ingredients,
        status: RequestStatus.Idle
      },
      getIngredients.pending('')
    );

    expect(state.status).toEqual(RequestStatus.Loading);
    expect(state.ingredients.length).toEqual(2);
  });
  test('getIngredients.rejected: проверка обновления ingredients', () => {
    const error = new Error('test error');
    const state = ingredientsSlice.reducer(
      {
        ...initialState,
        ingredients: ingredients,
        status: RequestStatus.Loading
      },
      getIngredients.rejected(error, '', undefined)
    );
    expect(state.status).toEqual(RequestStatus.Failed);
    expect(state.ingredients).toEqual([]);
  });
});
