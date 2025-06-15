import { deleteCookie, setCookie } from '@utils/cookie';
import {
  TRegisterData,
  registerUserApi,
  loginUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
} from '@api';
import { TLoginData, TUser } from '@utils-types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { USER_SLICE_NAME } from '@utils/constants';

//метод регистрации
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: TRegisterData, ) => {
    const data = await registerUserApi(userData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

// метод авторизации
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: TLoginData) => {
    const data = await loginUserApi(userData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

// метод проверки пользователя
export const getUser = createAsyncThunk(
  `${USER_SLICE_NAME}/getUser`,
  async () => {
    return await getUserApi();
  }
);

// метод выхода
export const logoutUser = createAsyncThunk(
  'auth/logout', async () => {
  await logoutApi()
  deleteCookie('accessToken'); 
  localStorage.removeItem('refreshToken');
  return;
});

// метод обновления данных пользователя
export const updateUser = createAsyncThunk(
  `auth/${USER_SLICE_NAME}`,
  async (user: Partial<TUser & { password?: string }>) => {
    return await updateUserApi(user);
  }
);

// метод восстановления пароля
export const forgotPassword = createAsyncThunk(
  'password-reset', 
  async (userData: { email: string }) => {
    return await forgotPasswordApi(userData)
  }
)

// метод сброса пароля
export const resetPassword = createAsyncThunk(
  '/password-reset/reset', 
  async (userData: { password: string; token: string }) => {
    const data = await resetPasswordApi(userData)
    return data
  }
)
