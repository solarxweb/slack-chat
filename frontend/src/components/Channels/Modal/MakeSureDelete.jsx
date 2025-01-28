import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { removeChannel, setCurrentChannel } from "../../../store/channelSlice";
import axios from "axios";
import socket from "../../../socket";
import { toast } from 'react-toastify';
import { API_ROUTES } from "../../../api";

// eslint-disable-next-line react/prop-types
const MakeSure = ({ show, onHide, id }) => {
  const { t } = useTranslation();
  const notifySuccess = () => toast.success(t('noticeChannelRemoved'));
  const notifyError = () => toast.warning(t('errChannelRemoveNetwork'))
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const currentChannelId = useSelector((state) => state.channels.currentChannel);

  const handleRemoveChannel = async () => {
    try {
      const response = await axios.delete(API_ROUTES.channels.channelById(currentChannelId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.statusText === 'OK') {
        dispatch(removeChannel({ id }));
        if (currentChannelId === id) {
          dispatch(setCurrentChannel('1')); 
        }
        socket.on("removeChannel", { id });
        notifySuccess()
      } else {
        console.error(`${t.errRemoveChannel} ${response.status}`);
      }
    } catch (error) {
      notifyError()
      console.error(`${t.errRemoveChannel} -`, error);
    }
  };
    
  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Подтверждение удаления</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Вы уверены, что хотите удалить этот канал?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button variant="danger" onClick={handleRemoveChannel}>
          Удалить канал
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MakeSure;