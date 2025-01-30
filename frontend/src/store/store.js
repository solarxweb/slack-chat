/* eslint-disable quotes */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import messagesReducer from './messagesSlice';
import channelsReducer from './channelSlice';

const store = configureStore({
  reducer: {
    messages: messagesReducer,
    auth: authReducer,
    channels: channelsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
