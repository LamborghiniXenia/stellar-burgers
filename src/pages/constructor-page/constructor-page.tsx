import { AppDispatch } from '@store';
import { useEffect } from 'react';
import styles from './constructor-page.module.css';
import { useAppDispatch, useAppSelector } from '@storage/hooks'

import { BurgerIngredients, BurgerConstructor } from '@components';

import { Preloader } from '@ui';
import { FC } from 'react';
import { selectIngredients, selectIngredientsIsLoading } from '@slices';
import { getIngredients } from '@thunk';

export const ConstructorPage: FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  
  const ingredients = useAppSelector(selectIngredients);
  const isIngredientsLoading  = useAppSelector(selectIngredientsIsLoading);

  useEffect(() => {
    if (!ingredients.length && !isIngredientsLoading ) {
		dispatch(getIngredients());}
	}, [dispatch, ingredients.length, isIngredientsLoading ]);
  
  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain} >
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`} 
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`} >
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
