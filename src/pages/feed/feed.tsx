import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { selectFeedOrders } from '@slices';
import { AppDispatch } from '@store';
import { useAppDispatch, useAppSelector } from '@storage/hooks';
import { getFeed } from '@thunk';
import { TOrder } from '@utils/types';

export const Feed: FC = () => {
  const orders: TOrder[] = useAppSelector(selectFeedOrders);
  const dispatch: AppDispatch = useAppDispatch();

  useEffect(() => {
    if (!orders.length) {
      dispatch(getFeed());
    }
  }, [dispatch, orders.length]);

  if (!orders.length) {
    return <Preloader />;
  }
  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeed())} />;
};
