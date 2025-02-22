/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isOpen: false,
    type: null,
  },
  reducers: {
    setOpen: (state, { payload }) => {
      state.type = payload.type;
      state.isOpen = true;
    },
    setClose: (state) => {
      state.type = null;
      state.isOpen = false;
    },
  },
});

export const { setOpen, setClose } = modalSlice.actions;
export default modalSlice.reducer;
