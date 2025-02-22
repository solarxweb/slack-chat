/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isOpen: false,
    type: null,
    extra: null,
  },
  reducers: {
    setOpen: (state, { payload }) => {
      const { type, extra } = payload;
      console.log(type, extra)
      state.type = type;
      state.isOpen = true;
      state.extra = extra;
    },
    setClose: (state) => {
      state.type = null;
      state.isOpen = false;
      state.extra = null;
    },
  },
});

export const { setOpen, setClose } = modalSlice.actions;
export default modalSlice.reducer;
