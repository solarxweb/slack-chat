import "./Channels.css";
import Messages from "../Messages/Messages";
import ModalCreatingChannel from "./Modal/ModalCreateChannel.jsx";
import DropdownElement from "./Modal/DropDownList.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addChannel,
  addChannels,
  setCurrentChannel,
  removeChannel,
} from "../../store/channelSlice.js";
import { selectors as channelSelectors } from "../../store/channelSlice.js";
import axios from "axios";
import socket from "../../socket.js";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Channels = () => {
  const { t } = useTranslation();
  const redir = useNavigate();
  const noticeError = () => toast(t('errNetwork'));

  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const channels = useSelector(channelSelectors.selectAll);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get('/api/v1/channels', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        dispatch(addChannels(response.data));
      } catch (error) {
        if (error.status === 401) redir('/login');
        if (error.status === 500) noticeError();
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

  const createChannel = (newChannel) => {
    dispatch(addChannel(newChannel));
    handlePickChannel(newChannel.id);
    setShow(false);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-channels channels">
        <div className="channels-header header">
          <h3 className="channels-header__title">{t('channels')}</h3>
          <button
            type="button"
            className="channels-create__btn"
            onClick={() => setShow(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="grey"
              width={20}
              height={20}
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
            </svg>
          </button>
        </div>
        <ul className="channels-list">
          {channels.map((channel) => (
            <li className="channel-list__item item" key={channel.id}>
              <button
                className="channel-btn"
                type="button"
                onClick={() => handlePickChannel(channel.id)}
              >
                # {channel.name}
              </button>
              {channel.removable && <DropdownElement id={channel.id} />}
            </li>
          ))}
        </ul>
      </div>
      <Messages />
      <ModalCreatingChannel
        show={show}
        onHide={() => setShow(false)}
        createChannel={createChannel}
        token={token}
      />
    </div>
  );
};

export default Channels;