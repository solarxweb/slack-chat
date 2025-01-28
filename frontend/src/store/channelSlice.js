import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const channelsAdapter = createEntityAdapter();

const initialState = {
  currentChannel: '1',
  ...channelsAdapter.getInitialState()
};

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    // Добавление множества каналов
    addChannels: channelsAdapter.addMany,
    // Добавление одного канала
    addChannel: channelsAdapter.addOne,
    // Удаление канала
    removeChannel: (state, { payload }) => {
      const { id } = payload;
      if (state.entities[id]) {
        if (state.currentChannel === id) {
          state.currentChannel = '1';  // Установка текущего канала
        }
        channelsAdapter.removeOne(state, id);
      }
    },
    // Установка текущего канала
    setCurrentChannel(state, { payload }) {
      state.currentChannel = payload;
    },
    // Обновление имени канала
    updateChannelName(state, action) {
      const { id, name } = action.payload;
      const channel = state.entities[id];
      if (channel) {
        channel.name = name;
      }
    },
  },
});

// Экспортируем действия из среза
export const {
  setCurrentChannel,
  removeChannel,
  updateChannelName,
  addChannel,
  addChannels
} = channelSlice.actions;

// Экспорт селекторов
export const selectors = channelsAdapter.getSelectors(state => state.channels);

export default channelSlice.reducer;