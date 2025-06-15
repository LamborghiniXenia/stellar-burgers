import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader, IngredientDetailsUI } from '@ui';
import { AppDispatch } from '@store';
import { selectIngredients } from '@slices';
import { useAppDispatch, useAppSelector } from '@storage/hooks';
import { getIngredients } from '@thunk';

interface IngredientDetailsProps {
  isModalContext?: boolean; 
}

export const IngredientDetails: FC<IngredientDetailsProps> = ({isModalContext}) => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useAppDispatch();

  const ingredients = useAppSelector(
    selectIngredients
  );

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(getIngredients());
    }
  }, [dispatch, ingredients.length]);

  const ingredientData = useMemo(() => {
    if (!id || ingredients.length === 0) {
      return null;
    }
    const foundIngredient = ingredients.find(
      (ingredient) => ingredient._id === id
    );
    return foundIngredient;
  }, [id, ingredients]);
  
  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} isModalContext={isModalContext}
   />;
};
