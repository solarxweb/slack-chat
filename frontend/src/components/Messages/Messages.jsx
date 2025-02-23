import './Messages.css';
import axios from 'axios';
import {
  useEffect, useState, useRef, useMemo, useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import {
  addMessage,
  selectors as messageSelector,
} from '../../store/messagesSlice';
import socket from '../../socket';
import API_ROUTES from '../../api';

const Messages = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const channelsState = useSelector((state) => state.channels);
  const currentChannelId = useSelector(
    (state) => state.channels.currentChannel,
  );
  const messages = useSelector(messageSelector.selectAll);
  const currentMessages = messages.filter(
    (msg) => msg.channelId === currentChannelId,
  );

  const inputRef = useRef(null);
  const lastMessageRef = useRef(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const channel = channelsState.entities[currentChannelId];
  const channelName = channel ? channel.name : 'Unknown Channel';

  const messageCount = useMemo(() => {
    const count = currentMessages.length;

    const getEndOfMessage = (n) => {
      const lastTwo = n % 100;
      const lastOne = n % 10;

      if (lastTwo >= 11 && lastTwo <= 14) return 'many_messages';
      if (lastOne === 1) return 'one_message';
      if (lastOne >= 2 && lastOne <= 4) return 'few_messages';
      return 'many_messages';
    };

    return t(`messageCounter.${getEndOfMessage(count)}`, { count });
  }, [currentMessages, t]);

  const scrollToLastMsg = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        API_ROUTES.messages.listByChannel(currentChannelId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      data.forEach((msg) => dispatch(addMessage(msg)));
      scrollToLastMsg();
    } catch (error) {
      if (error.response?.status === 500) toast.warning(t('errNetwork'));
    } finally {
      setLoading(false);
    }
  }, [currentChannelId, token, dispatch]);

  useEffect(() => {
    leoProfanity.loadDictionary('ru');
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentChannelId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    const timer = setTimeout(scrollToLastMsg, 150);
    return () => clearTimeout(timer);
  }, [currentMessages]);

  const handleNewMessage = (payload) => {
    dispatch(addMessage(payload));
  };

  useEffect(() => {
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  });

  const handleChange = (e) => setMessage(e.target.value);

  const handleSendMessage = async () => {
    if (!message || loading) return;

    const cleanedMessage = leoProfanity.clean(message);
    const newMessage = {
      body: cleanedMessage,
      channelId: currentChannelId,
      username,
    };
    try {
      setLoading(true);
      const { data } = await axios.post(API_ROUTES.messages.list(), newMessage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(addMessage(data));
      setMessage('');
    } catch (error) {
      if (error.status === 500) toast.warning(t('errNetwork'));
    } finally {
      setLoading(false);
      inputRef.current.focus();
    }
  };

  return (
    <div className="chat-messages messages">
      <div className="messages-header header">
        <b className="messages-header__title">
          #
          {channelName}
        </b>
        <div className="messages-header__counter">{messageCount}</div>
      </div>
      <div className="messages-box">
        {currentMessages.map((msg, index) => (
          <div key={msg.id} className="message" ref={index === currentMessages.length - 1 ? lastMessageRef : null}>
            <b>{`${msg.username}:  `}</b>
            {msg.body}
          </div>
        ))}
      </div>
      <div className="messages-textblock py-3">
        <input
          ref={inputRef}
          type="text"
          name="body"
          id="message-input"
          placeholder="Введите сообщение..."
          value={message}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage(e);
          }}
          aria-label="Новое сообщение"
        />
        <button
          type="submit"
          className="btn btn-primary send-message__btn text-wrap myx-auto"
          onClick={handleSendMessage}
          disabled={!message || loading}
        >
          {loading ? 'Отправка...' : t('send')}
        </button>
      </div>
    </div>
  );
};

export default Messages;
