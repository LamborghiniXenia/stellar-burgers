import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { AppDispatch } from '@store';
import { useAppDispatch } from '@storage/hooks'
import { moveIngredient, removeIngredient } from '@slices';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch: AppDispatch = useAppDispatch()
    const handleMoveDown = () => {if (index < totalItems - 1) {
        dispatch(moveIngredient({ from: index, to: index + 1 }));
      }};

    const handleMoveUp = () => {if (index > 0) {
        dispatch(moveIngredient({ from: index, to: index - 1 }));
      }};

    const handleClose = () => {dispatch(removeIngredient(ingredient.uniqueId))};

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
