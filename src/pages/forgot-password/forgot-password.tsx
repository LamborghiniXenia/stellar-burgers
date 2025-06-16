import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '@storage/hooks';
import { AppDispatch } from '@store';
import { forgotPassword } from '@thunk';
import { selectForgotPasswordStatus } from '@slices';
import { RequestStatus } from '@utils/types';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const dispatch: AppDispatch = useAppDispatch()
  const navigate = useNavigate();

  const forgotPasswordStatus = useAppSelector(selectForgotPasswordStatus)
  
  const isSubmitting = forgotPasswordStatus === RequestStatus.Loading;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return; 
    }
    setError(null);
    dispatch(forgotPassword({ email }))
    .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((error) => setError(error));
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
