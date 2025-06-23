import { describe, expect, test } from '@jest/globals';
import { setUserCheck, userSlice, initialState } from './user-slice';
import {
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser
} from '@thunk';
import { configureStore } from '@reduxjs/toolkit';
import { RequestStatus } from '@utils/types';
import { USER_SLICE_NAME } from '@utils/constants';

describe('[user-slice]', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRegisterUser = {
    email: 'test@ya.ru',
    name: 'Жак',
    password: '12345'
  };
  const mockUser = {
    email: 'test@ya.ru',
    name: 'Жак'
  };
  const authResponse = {
    success: true,
    refreshToken: '',
    accessToken: '',
    user: mockUser
  };
  const userResponse = {
    success: true,
    user: mockUser
  };
  const updateUserData = {
    email: 'zhak@ya.ru'
  };
  const updateData = {
    email: 'zhak@ya.ru',
    name: 'Жак'
  };

  describe('тесты синхронных экшенов: reducers', () => {
    describe('[setUserCheck] проверка изменения состояния UserCheck', () => {
      test('проверка статуса (true)', () => {
        const state = { ...initialState, userCheck: true };
        const newState = userSlice.reducer(state, setUserCheck());
        expect(newState.userCheck).toBe(true);
      });
      test('проверка статуса (false)', () => {
        const state = initialState;
        const newState = userSlice.reducer(state, setUserCheck());
        expect(newState.userCheck).toBe(true);
      });
    });
  });

  describe('тесты асинхронных экшенов: extraReducers', () => {
    test('[registerUser] регистрация пользователя. Проверка обрабатки состояния "fulfilled"', async () => {
      const state = {
        ...initialState,
        user: mockUser,
        status: RequestStatus.Success
      };
      const newState = userSlice.reducer(
        {
          ...initialState,
          status: RequestStatus.Loading,
          user: null
        },
        registerUser.fulfilled(authResponse, '', mockRegisterUser)
      );
      expect(newState).toEqual(state);
    });
    test('[getUser] получение данных о пользователе. Проверка обрабатки состояния "fulfilled"', () => {
      const state = {
        ...initialState,
        user: mockUser,
        status: RequestStatus.Success
      };
      const newState = userSlice.reducer(
        {
          ...initialState,
          status: RequestStatus.Loading,
          user: null
        },
        getUser.fulfilled(userResponse, '', undefined)
      );
      expect(newState).toEqual(state);
    });
    test('[loginUser] авторизация пользователя. Проверка обрабатки состояния "fulfilled"', () => {
      const state = {
        ...initialState,
        user: mockUser,
        status: RequestStatus.Success
      };

      const loginUserData = {
        email: 'test@ya.ru',
        password: '12345'
      };
      const newState = userSlice.reducer(
        {
          ...initialState,
          status: RequestStatus.Loading,
          user: null
        },
        loginUser.fulfilled(authResponse, '', loginUserData)
      );
      expect(newState).toEqual(state);
    });
    test('[logoutUser] выход пользователя из системы. Проверка обрабатки состояния "fulfilled"', () => {
      const state = {
        ...initialState,
        user: null,
        status: RequestStatus.Success
      };
      const newState = userSlice.reducer(
        {
          ...initialState,
          status: RequestStatus.Loading,
          user: mockUser
        },
        logoutUser.fulfilled(undefined, '')
      );
      expect(newState).toEqual(state);
    });
    test('[updateUser] обновление данных пользователя. Проверка обрабатки состояния "fulfilled"', () => {
      const state = {
        ...initialState,
        user: updateData,
        status: RequestStatus.Success
      };
      const userUpdateResponse = {
        success: true,
        user: updateData
      };
      const newState = userSlice.reducer(
        {
          ...initialState,
          status: RequestStatus.Loading,
          user: mockUser
        },
        updateUser.fulfilled(userUpdateResponse, '', updateUserData)
      );
      expect(newState).toEqual(state);
    });
    test('[forgotPassword] восстановление пароля. Проверка обрабатки состояния "fulfilled"', () => {
      const state = {
        ...initialState,
        user: null,
        status: RequestStatus.Success,
        forgotPasswordStatus: RequestStatus.Success
      };
      const forgotPasswordRequestData = {
        email: 'test@ya.ru'
      };
      const forgotPasswordApiResponse = {
        success: true
      };
      const newState = userSlice.reducer(
        {
          ...initialState,
          status: RequestStatus.Loading,
          forgotPasswordStatus: RequestStatus.Loading,
          user: null
        },
        forgotPassword.fulfilled(
          forgotPasswordApiResponse,
          '',
          forgotPasswordRequestData
        )
      );
      expect(newState).toEqual(state);
    });
    test('[resetPassword] сброс пароля. Проверка обрабатки состояния "fulfilled"', () => {
      const state = {
        ...initialState,
        user: null,
        status: RequestStatus.Success,
        resetPasswordStatus: RequestStatus.Success
      };
      const resetPasswordRequestData = {
        password: 'qwerty',
        token: 'some_reset_token_from_email'
      };
      const resetPasswordApiResponse = {
        success: true
      };
      const newState = userSlice.reducer(
        {
          ...initialState,
          status: RequestStatus.Loading,
          resetPasswordStatus: RequestStatus.Loading,
          user: null
        },
        resetPassword.fulfilled(
          resetPasswordApiResponse,
          '',
          resetPasswordRequestData
        )
      );
      expect(newState).toEqual(state);
    });
    test('[isActionPending] тест для общих pending матчеров. Проверка обработки состояния "pending"', () => {
      const mockPendingAction = {
        type: `${USER_SLICE_NAME}/someAsyncThunk/pending`,
        meta: { requestId: 'test-id', arg: undefined }
      };
      const startingState = {
        ...initialState,
        status: RequestStatus.Idle
      };
      const newState = userSlice.reducer(startingState, mockPendingAction);
      expect(newState.status).toEqual(RequestStatus.Loading);
    });
    test('[isActionRejected] тест для общих rejected матчеров. Проверка обработки состояния "rejected"', () => {
      const mockRejectedAction = {
        type: `${USER_SLICE_NAME}/someThunkAction/rejected`,
        meta: {
          requestId: 'test-id',
          arg: undefined,
          aborted: false,
          condition: false
        }
      };
      const startingState = {
        ...initialState,
        status: RequestStatus.Loading
      };
      const newState = userSlice.reducer(startingState, mockRejectedAction);
      expect(newState.status).toEqual(RequestStatus.Failed);
    });
  });
});
