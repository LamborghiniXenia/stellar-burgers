import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '@storage/hooks';
import { selectUser } from '@slices';

export const AppHeader: FC = () => {
  const user = useAppSelector(selectUser);
  return <AppHeaderUI userName={user?.name} />;
};
