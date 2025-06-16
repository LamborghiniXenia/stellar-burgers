import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { addIngredient } from '@slices';
import { AppDispatch } from '@store';
import { useAppDispatch } from '@storage/hooks'

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch: AppDispatch = useAppDispatch();

    const handleAdd = () => {dispatch(addIngredient(ingredient))};

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
