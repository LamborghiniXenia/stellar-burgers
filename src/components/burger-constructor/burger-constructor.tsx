import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { AppDispatch } from '@store';
import { selectOrderRequest, selectOrderModalData, selectUser, selectConstructorBun, selectConstructorIngredients, clearConstructor, resetOrderModalData } from '@slices';
import { useAppSelector, useAppDispatch } from '@storage/hooks';
import { createOrder } from '@thunk';
import { useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const orderRequest = useAppSelector(selectOrderRequest);
  const orderModalData = useAppSelector(
    selectOrderModalData
  );
  const user = useAppSelector(selectUser);
  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(
    selectConstructorIngredients
  );

  const onOrderClick = () => {
    if (orderRequest) {
      return;
    }

    if (!bun || orderRequest) {console.warn("Cannot place order: bun or ingredients are missing.");
    return;}

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds: string[] = [
      bun._id,
      ...ingredients.map((ing) => ing._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then((data) => {
        dispatch(clearConstructor());
})
      .catch((error) => {
        console.error('Ошибка оформления заказа:', error);
      });
  };

  const closeOrderModal = () => {
    dispatch(resetOrderModalData());
    navigate(-1);
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [ bun, ingredients ]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
