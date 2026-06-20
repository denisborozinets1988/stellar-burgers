import { loginUserApi, registerUserApi, TRegisterData } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { json } from 'stream/consumers';

interface TUserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isSuccessRegistrarion: boolean;
  data: TUser | null;
  isRequested: boolean;
  error: string | null;
}

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  isSuccessRegistrarion: false,
  data: null,
  isRequested: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: Omit<TRegisterData, 'name'>) =>
    await loginUserApi({ email, password })
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: TRegisterData) =>
    await registerUserApi({ name, email, password })
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (sliceState) => sliceState.data,
    selectUserIsRequested: (sliceState) => sliceState.isRequested,
    selectIsSuccessRegistrarion: (sliceState) =>
      sliceState.isSuccessRegistrarion,
    selectUserError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.data = null;
        state.isRequested = true;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.error = null;
        state.isSuccessRegistrarion = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.data = null;
        state.isRequested = false;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        if (action.error.message === 'email or password are incorrect') {
          state.error = 'Неверный логин или пароль!';
        } else {
          state.error = 'Ой, что-то пошло не так...';
        }
        state.isSuccessRegistrarion = false;
        console.log(action);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isRequested = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
        state.isSuccessRegistrarion = false;
      })

      .addCase(registerUser.pending, (state) => {
        state.data = null;
        state.isRequested = true;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.error = null;
        state.isSuccessRegistrarion = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.data = null;
        state.isRequested = false;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        if (action.error.message === 'User already exists') {
          state.error = 'Данный пользователь уже зарегистрирован!';
        } else {
          state.error = 'Ой, что-то пошло не так...';
        }
        state.isSuccessRegistrarion = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRequested = false;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.error = null;
        state.isSuccessRegistrarion = true;
      });
  }
});

export const {
  selectUser,
  selectUserIsRequested,
  selectUserError,
  selectIsSuccessRegistrarion
} = userSlice.selectors;
export default userSlice.reducer;
