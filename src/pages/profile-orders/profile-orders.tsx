import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { AppDispatch } from '@store';
import { useAppDispatch, useAppSelector } from '@storage/hooks'
import { selectOrders } from '@slices';
import { getOrders } from '@thunk';

export const ProfileOrders: FC = () => {
const dispatch: AppDispatch = useAppDispatch();

  const orders: TOrder[] = useAppSelector(selectOrders);

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(getOrders())
    }
  }, [dispatch, orders.length])
  return <ProfileOrdersUI orders={orders} />;
};
