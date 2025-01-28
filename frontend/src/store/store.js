import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import messagesReducer from './messagesSlice.js'
import channelsReducer from './channelSlice.js';


const store = configureStore({
  reducer: {
    messages: messagesReducer,
    auth: authReducer,
    channels: channelsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
});

export default store;