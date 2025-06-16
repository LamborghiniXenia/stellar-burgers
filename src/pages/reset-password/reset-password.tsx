import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '@thunk';
import { ResetPasswordUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '@storage/hooks';
import { AppDispatch } from '@store';
import { selectResetPasswordStatus } from '@slices';
import { RequestStatus } from '@utils/types';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const resetPasswordStatus = useAppSelector(selectResetPasswordStatus);

  const isSubmitting = resetPasswordStatus === RequestStatus.Loading;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isSubmitting) {
      return; 
    }
    setError(null);
    dispatch(resetPassword({password, token}))
    .unwrap()
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((error) => setError(error));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate, dispatch]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
