import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

export type LoginState = {
  user: TUser | null;
  isAuthChecked: boolean;
  errorText: string;
};

const initialState: LoginState = {
  user: null,
  isAuthChecked: false,
  errorText: ''
};

export const getUserInfo = createAsyncThunk('login/authCheck', async () => {
  if (getCookie('accessToken')) {
    return getUserApi();
  } else {
    return Promise.reject('No access token');
  }
});

export const logout = createAsyncThunk(
  'login/logout',
  async () => await logoutApi()
);

export const login = createAsyncThunk(
  'login/login',
  async (loginData: TLoginData) => await loginUserApi(loginData)
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  selectors: {
    selectIsLoggedIn: (state) => !!state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUser: (state) => state.user,
    selectErrorText: (state) => state.errorText
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.isAuthChecked = false;
        state.errorText = '';
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.errorText = '';
      })
      .addCase(getUserInfo.rejected, (state) => {
        state.isAuthChecked = true;
        state.user = null;
        state.errorText = 'Unable to fetch user information';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      })
      .addCase(logout.rejected, (state) => {
        state.errorText = 'Logout failed';
      })
      .addCase(login.pending, (state) => {
        state.isAuthChecked = false;
        state.errorText = '';
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            accessToken: string;
            refreshToken: string;
            user: TUser;
          }>
        ) => {
          state.user = action.payload.user;
          state.isAuthChecked = true;
          localStorage.setItem('refreshToken', action.payload.refreshToken);
          setCookie('accessToken', action.payload.accessToken);
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.errorText = action.error.message? action.error.message : 'Login failed';
        state.isAuthChecked = true;
        state.user = null;
      });
  }
});

export const {
  selectErrorText,
  selectIsLoggedIn,
  selectUser,
  selectIsAuthChecked
} = loginSlice.selectors;

export default loginSlice.reducer;
