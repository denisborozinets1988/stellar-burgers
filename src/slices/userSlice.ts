import { loginUserApi, registerUserApi, TRegisterData } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

interface TUserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  isRequested: boolean;
  error: string | null;
}

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  isRequested: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
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
      })
      .addCase(loginUser.rejected, (state) => {
        state.data = null;
        state.isRequested = false;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.error = 'Ой, что-то пошло не так...';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isRequested = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
      })

      .addCase(registerUser.pending, (state) => {
        state.data = null;
        state.isRequested = true;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state) => {
        state.data = null;
        state.isRequested = false;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.error = 'Ой, что-то пошло не так...';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isRequested = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
      });
  }
});

export const { selectUser, selectUserIsRequested, selectUserError } =
  userSlice.selectors;
export default userSlice.reducer;
