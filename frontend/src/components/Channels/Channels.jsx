import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Channels.css';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import Messages from '../Messages/Messages';
import DropdownElement from './Modal/DropDownList.jsx';
import {
  addChannel,
  addChannels,
  setCurrentChannel,
  removeChannel,
  selectors as channelSelectors,
} from '../../store/channelSlice.js';
import { setOpen } from '../../store/modalSlice.js';
import socket from '../../socket.js';
import API_ROUTES from '../../api/index.js';

const Channels = () => {
  const { t } = useTranslation();
  const redir = useNavigate();
  const noticeError = () => toast(t('errNetwork'));

  const dispatch = useDispatch();
  const [showLoading, setShowLoading] = useState(true);

  const currentId = useSelector((state) => state.channels.currentChannel);
  const channels = useSelector(channelSelectors.selectAll);
  const token = localStorage.getItem('token');

  const lastChannelItemRef = useRef(null);

  const scrollToLastChannelItem = () => {
    if (lastChannelItemRef.current) {
      lastChannelItemRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToLastChannelItem();
  }, [channels]);

  useEffect(() => {
    if (!token) redir('/login');
    const fetchChannels = async () => {
      try {
        const response = await axios.get(API_ROUTES.channels.list(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setShowLoading(false);
        dispatch(addChannels(response.data));
      } catch (error) {
        if (error.status === 401) redir('/login');
        if (error.status === 500) noticeError();
        setShowLoading(true);
      }
    };
    fetchChannels();

    // удаление канала сокет
    socket.on('removeChannel', (payload) => {
      dispatch(removeChannel(payload));
    });

    socket.on('newChannel', (payload) => {
      dispatch(addChannel(payload));
    });
  });

  const handlePickChannel = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  return (
    showLoading ? (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: 200, color: 'white' }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : (
      <div className="chat-wrapper">
        <div className="chat-channels channels">
          <div className="channels-header header">
            <h3 className="channels-header__title">{t('channels')}</h3>
            <button
              type="button"
              className="channels-create__btn"
              onClick={() => dispatch(setOpen({ type: 'create' }))}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="grey"
                width={20}
                height={20}
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
              </svg>
              <span className="sr-only">+</span>
            </button>
          </div>
          <ul className="channels-list">
            {channels.map((channel, index) => (
              <li className="channel-list__item item" key={channel.id} ref={index === channels.length - 1 ? lastChannelItemRef : null}>
                <button
                  className={cn('w-100 rounded-0 text-start text-truncate btn', {
                    'btn-secondary': currentId === channel.id,
                  })}
                  type="button"
                  onClick={() => handlePickChannel(channel.id)}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </button>
                {channel.removable && <DropdownElement id={channel.id} />}
              </li>
            ))}
          </ul>
        </div>
        <Messages />
      </div>
    )
  );
};

export default Channels;
