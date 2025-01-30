import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState({
  loading: false,
  error: null,
});

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (channelId, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get(`/api/v1/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

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

export const { resetChatState, addMessage, removeMessage } =
  messagesSlice.actions;
export const selectors = messagesAdapter.getSelectors(
  (state) => state.messages
);
export default messagesSlice.reducer;
