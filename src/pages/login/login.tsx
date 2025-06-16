import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { AppDispatch } from '@store';
import { useAppDispatch, useAppSelector } from '@storage/hooks';
import { loginUser } from '@thunk';
import { selectUserStatus } from '@slices';
import { RequestStatus } from '@utils/types';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const userStatus = useAppSelector(selectUserStatus);
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isSubmitting = userStatus === RequestStatus.Loading;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const from = location.state?.from?.pathname || '/';
    navigate(from);
    if (isSubmitting) {
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
