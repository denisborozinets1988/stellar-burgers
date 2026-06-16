import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

interface IUserState {
  user: TUser | null;
}

const initialState: IUserState = {
  user: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (sliceState) => sliceState.user
  }
});

export const { selectUser } = userSlice.selectors;
export default userSlice.reducer;
