let callCount = 0;
jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => {
      callCount++;
      return `mock-unique-id-${callCount}`;
    })
  };
});

import { expect, test } from '@jest/globals';
import {
  addIngredient,
  burgerConstructorSlice,
  clearConstructor,
  initialState,
  moveIngredient,
  removeIngredient
} from './burger-constructor-slice';
import { v4 as uuid4 } from 'uuid';

const mockIngredients = {
  bun: {
    _id: '444',
    name: 'Булька',
    type: 'bun',
    proteins: 23,
    fat: 1,
    carbohydrates: 45,
    calories: 56,
    price: 70,
    image: '',
    image_large: '',
    image_mobile: '',
    uniqueId: 'mock-unique-id'
  },
  ingredients: [
    {
      _id: '111',
      name: 'Филе рыбы',
      type: 'main',
      proteins: 23,
      fat: 34,
      carbohydrates: 45,
      calories: 56,
      price: 67,
      image: '',
      image_large: '',
      image_mobile: '',
      uniqueId: 'Филе рыбы 111'
    },
    {
      _id: '222',
      name: 'Помидор',
      type: 'main',
      proteins: 23,
      fat: 0,
      carbohydrates: 45,
      calories: 56,
      price: 90,
      image: '',
      image_large: '',
      image_mobile: '',
      uniqueId: 'Помидор 222'
    }
  ]
};

const sortedIngredients = {
  bun: null,
  ingredients: [
    {
      _id: '222',
      name: 'Помидор',
      type: 'main',
      proteins: 23,
      fat: 0,
      carbohydrates: 45,
      calories: 56,
      price: 90,
      image: '',
      image_large: '',
      image_mobile: '',
      uniqueId: 'Помидор 222'
    },
    {
      _id: '111',
      name: 'Филе рыбы',
      type: 'main',
      proteins: 23,
      fat: 34,
      carbohydrates: 45,
      calories: 56,
      price: 67,
      image: '',
      image_large: '',
      image_mobile: '',
      uniqueId: 'Филе рыбы 111'
    }
  ]
};

const afterRemovedIngredients = {
  bun: {
    _id: '444',
    name: 'Булька',
    type: 'bun',
    proteins: 23,
    fat: 1,
    carbohydrates: 45,
    calories: 56,
    price: 70,
    image: '',
    image_large: '',
    image_mobile: '',
    uniqueId: 'mock-unique-id'
  },
  ingredients: [
    {
      _id: '111',
      name: 'Филе рыбы',
      type: 'main',
      proteins: 23,
      fat: 34,
      carbohydrates: 45,
      calories: 56,
      price: 67,
      image: '',
      image_large: '',
      image_mobile: '',
      uniqueId: 'Филе рыбы 111'
    }
  ]
};

const mockBun = {
  _id: '444',
  name: 'Булька',
  type: 'bun',
  proteins: 23,
  fat: 1,
  carbohydrates: 45,
  calories: 56,
  price: 70,
  image: '',
  image_large: '',
  image_mobile: '',
  uniqueId: 'mock-unique-id'
};

const mockIngredient = {
  _id: '222',
  name: 'Помидор',
  type: 'main',
  proteins: 23,
  fat: 0,
  carbohydrates: 45,
  calories: 56,
  price: 90,
  image: '',
  image_large: '',
  image_mobile: '',
  uniqueId: 'mock-unique-id'
};

describe('[burgerConstructorSlice]', () => {
  afterEach(() => {
    jest.clearAllMocks();
    callCount = 0;
  });

  describe('тесты синхронных экшенов: reducers', () => {
    test('обработка экшена добавления ингредиента булка', () => {
      const action = addIngredient(mockBun);
      const newState = burgerConstructorSlice.reducer(initialState, action);
      expect(newState.bun).toEqual({
        ...mockBun,
        uniqueId: 'mock-unique-id-1'
      });
      expect(newState.ingredients).toEqual([]);
      expect(uuid4).toHaveBeenCalledTimes(1);
    });
    test('обработка экшена добавления ингредиента не булка', () => {
      const action = addIngredient(mockIngredient);
      const newState = burgerConstructorSlice.reducer(initialState, action);
      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toEqual([
        { ...mockIngredient, uniqueId: 'mock-unique-id-1' }
      ]);
      expect(uuid4).toHaveBeenCalledTimes(1);
    });
    test('обработка экшена удаления ингредиента', () => {
      const currentState = { ...initialState, ...mockIngredients };
      const newState = burgerConstructorSlice.reducer(
        currentState,
        removeIngredient('Помидор 222')
      );
      expect(newState).toEqual(afterRemovedIngredients);
    });
    test('обработка экшена изменения порядка ингредиентов в начинке: перемещение ингредиента вверх по списку', () => {
      const currentState = { ...initialState, ...mockIngredients };
      const newState = burgerConstructorSlice.reducer(
        currentState,
        moveIngredient({ from: 1, to: 0 })
      );
      expect(newState.ingredients).toEqual(sortedIngredients.ingredients);
    });
    test('обработка экшена изменения порядка ингредиентов в начинке: перемещение ингредиента вниз по списку', () => {
      const currentState = {
        ...initialState,
        ingredients: [...sortedIngredients.ingredients]
      };
      const newState = burgerConstructorSlice.reducer(
        currentState,
        moveIngredient({ from: 0, to: 1 })
      );
      expect(newState.ingredients).toEqual(mockIngredients.ingredients);
    });
    test('обработка экшена изменения порядка ингредиентов в начинке: перемещение ингредиента без смены позиции', () => {
      const currentState = { ...initialState, ...mockIngredients };
      const newState = burgerConstructorSlice.reducer(
        currentState,
        moveIngredient({ from: 1, to: 1 })
      );
      expect(newState.ingredients).toEqual(mockIngredients.ingredients);
    });
    test('обработка экшена отчистки конструктора', () => {
      const state = { ...initialState, ...mockIngredients };
      const newState = burgerConstructorSlice.reducer(
        state,
        clearConstructor()
      );
      expect(newState).toEqual(initialState);
    });
  });
});
