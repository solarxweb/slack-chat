import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
// import axios from 'axios';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState({
  loading: false,
  error: null,
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    resetChatState: () => initialState,
    addMessage: (state, { payload }) => {
      messagesAdapter.addOne(state, payload);
    },
    removeMessage: messagesAdapter.removeOne,
  },
});

export const { resetChatState, addMessage, removeMessage } = messagesSlice.actions;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
