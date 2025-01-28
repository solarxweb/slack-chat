const BASE_URL = '/api/v1'

export const API_ROUTES = {
  messages: {
    list: () => `${BASE_URL}/messages`,
    listByChannel: (id) => `${BASE_URL}/messages?channelId=${id}`,
  },
  channels: {
    list: () => `${BASE_URL}/channels`,
    channelById: (id) => `${BASE_URL}/channels/${id}`,

  },
  login: () => `${BASE_URL}/login`,
  signup: () => `${BASE_URL}/signup`,
}