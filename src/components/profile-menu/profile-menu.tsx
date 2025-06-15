import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { AppDispatch } from '@store';
import { logoutUser } from '@thunk'; 
import { useAppDispatch } from '@storage/hooks';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch: AppDispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return <ProfileMenuUI pathname={pathname} handleLogout={handleLogout}/>;
};
