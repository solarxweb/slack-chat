/* eslint-disable no-param-reassign */
/* eslint-disable quotes */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const initialState = {
  currentChannel: '1',
  ...channelsAdapter.getInitialState(),
};

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    removeChannel: (state, { payload }) => {
      const { id } = payload;
      if (state.entities[id]) {
        if (state.currentChannel === id) {
          state.currentChannel = '1';
        }
        channelsAdapter.removeOne(state, id);
      }
    },
    setCurrentChannel(state, { payload }) {
      state.currentChannel = payload;
    },
    updateChannelName(state, action) {
      const { id, name } = action.payload;
      const channel = state.entities[id];
      if (channel) {
        channel.name = name;
      }
    },
  },
});

export const {
  setCurrentChannel,
  removeChannel,
  updateChannelName,
  addChannel,
  addChannels,
} = channelSlice.actions;

// Экспорт селекторов
export const selectors = channelsAdapter.getSelectors(
  (state) => state.channels,
);

export default channelSlice.reducer;
