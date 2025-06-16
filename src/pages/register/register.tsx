import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUser } from '@thunk';
import { AppDispatch } from '@store';
import { useAppDispatch, useAppSelector } from '@storage/hooks';
import { selectUserStatus } from '@slices';
import { RequestStatus } from '@utils/types';

export const Register: FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const userStatus = useAppSelector(selectUserStatus);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isSubmitting = userStatus === RequestStatus.Loading;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
