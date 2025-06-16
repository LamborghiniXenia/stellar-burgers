import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { AppDispatch } from '@store';
import { selectUser } from '@slices';
import { useAppDispatch, useAppSelector } from '@storage/hooks'
import { updateUser } from '@thunk';
export const Profile: FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch: AppDispatch = useAppDispatch();


  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
 
    const updatedData: { name?: string; email?: string; password?: string } = {};
    if (formValue.name !== (user?.name || '')) {
      updatedData.name = formValue.name;
    }
    if (formValue.email !== (user?.email || '')) {
      updatedData.email = formValue.email;
    }
    if (formValue.password) { 
      updatedData.password = formValue.password;
    }

    if (Object.keys(updatedData).length > 0) {
      dispatch(updateUser(updatedData)); 
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );

};
