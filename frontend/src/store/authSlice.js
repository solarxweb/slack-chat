/* eslint-disable quotes */
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: '',
    token: '',
  },
  reducers: {
    setUserData: (state, { payload }) => {
      const { token, username } = payload;
      state.token = token;
      state.username = username;
    },
    clearUserData: (state) => {
      state.username = null;
      state.token = null;
    },
  },
});

export const { setUserData, clearUserData } = authSlice.actions;

// Селекторы
export const selectUsername = (state) => state.auth.username;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
