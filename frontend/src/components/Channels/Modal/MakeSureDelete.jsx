import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import API_ROUTES from '../../../api';
import { setClose } from '../../../store/modalSlice';
import { Spinner } from 'react-bootstrap';

const MakeSureDelete = ({ id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const token = localStorage.getItem('token');

  const { type, isOpen } = useSelector((state) => state.modal);

  const [loading, setLoading] = useState(false);

  const notifySuccess = () => toast.success(t('noticeChannelRemoved'));
  const notifyNetError = () => toast.warning(t('errChannelRemoveNetwork'));
  const notifyPermError = () => toast.warning(t('noticeInsufficientPermissions'));

  const closeModal = () => {
    setLoading(false)
    dispatch(setClose());
  };

  const handleRemoveChannel = () => {
    if (!token) return;

    setLoading(true);

    axios.delete(API_ROUTES.channels.channelById(id), {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    .then((response) => {
      if (response.status === 200) notifySuccess()
    })
    .catch((error) => {
      const handleErrCode = () => {
        switch (error.status) {
          case 401:
            return notifyPermError();
          case 500:
            return notifyNetError();
          default:
            console.log(error.status);
            return;
        }
      }
      handleErrCode(error)
    })
    .finally(() => {
      closeModal()
    })
  };

  return (
    <Modal centered show={isOpen && type === 'remove'} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('removeHeader')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('removeMakeSure')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          {t('decline')}
        </Button>
        <Button 
          variant="danger"  
          disabled={loading}
          onClick={handleRemoveChannel}
        >
          {loading ? <Spinner as="span" animation="border" size="sm" /> : t('remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MakeSureDelete;