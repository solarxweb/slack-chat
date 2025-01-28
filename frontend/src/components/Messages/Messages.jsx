import "./Messages.css";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from '../../socket';
import { addMessage } from "../../store/messagesSlice";
import { selectors as messageSelector } from "../../store/messagesSlice";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';

const Messages = () => {
  const { t } = useTranslation();
  const noticeError = () => toast.warning(t('errSendMessageNetwork'))
  const dispatch = useDispatch();
  
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const channelsState = useSelector((state) => state.channels);
  const currentChannelId = useSelector((state) => state.channels.currentChannel);
  const messages = useSelector(messageSelector.selectAll);
  const currentMessages = messages.filter((msg) => msg.channelId === currentChannelId);
  
  const inputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const channel = channelsState.entities[currentChannelId];
  const channelName = channel ? channel.name : 'Unknown Channel';
  
  const loadMessages = async () => {
    try {
      const { data } = await axios.get(`/api/v1/messages?channelId=${currentChannelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      data.forEach(msg => dispatch(addMessage(msg)));
    } catch (error) {
      console.error("Ошибка при загрузке сообщений:", error.response || error.message);
    }
  };

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
  },);


  useEffect(() => {
    const handleNewMessage = (payload) => {
      dispatch(addMessage(payload));
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [dispatch]);

  const handleChange = (e) => setMessage(e.target.value);

  const handleSendMessage = async (e) => {
    if (!message || loading) return;

    const cleanedMessage = leoProfanity.clean(message);
    const newMessage = { body: cleanedMessage, channelId: currentChannelId, username };
    
    if (e.key === 'Enter' || (e.type === 'click' && e.button === 0)) {
      try {
        setLoading(true);
        const { data } = await axios.post("/api/v1/messages", newMessage, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        dispatch(addMessage(data));

        socket.on('newMessage', data);  // Используйте emit для передачи сообщения на сервер

        setMessage('');
      } catch (error) {
        console.warn(error.message);
        noticeError();
      } finally {
        setLoading(false);
        inputRef.current.focus()
      }
    }
  };

  return (
    <div className="chat-messages messages">
      <div className="messages-header header">
        <h3 className="messages-header__title">{channelName}</h3>
        <div className="messages-header__counter">{currentMessages.length} сообщений</div>
      </div>
      <div className="messages-box">
        {currentMessages.length === 0 ? <p>Нет сообщений</p> : 
          currentMessages.map((msg) => (
            <div key={msg.id} className="message">
              <b>{msg.username}:</b> {msg.body}
            </div>
          ))
        }
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
          aria-label="Введите сообщение"
        />
        <button
          type="button"
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