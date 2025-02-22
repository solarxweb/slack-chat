/* eslint-disable react/prop-types */
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import * as yup from 'yup';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { setClose } from '../../../store/modalSlice';
import { updateChannelName, selectExistingChannelNames } from '../../../store/channelSlice';
import API_ROUTES from '../../../api';
import socket from '../../../socket';

const SwitchChannelName = ({ id }) => {
  const { t } = useTranslation();
  const notifySuccess = () => toast.success(t('noticeChannelRenamed'));
  const notifyError = () => toast.warning(t('errNetwork'));

  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  const { type, isOpen } = useSelector((state) => state.modal);
  const entities = useSelector((state) => state.channels.entities);
  const existingNames = useSelector(selectExistingChannelNames);
  
  const currentChannel = Object.values(entities).find((channel) => channel.id === id);
  
  if (!currentChannel) {
    return null;
  }

  const { name, id: curId } = currentChannel;

  const closeModal = () => {
    dispatch(setClose());
  };

  useEffect(() => {
    socket.on('renameChannel', (payload) => {
      dispatch(updateChannelName(payload));
    });
    return () => {
      socket.off('renameChannel');
    };
  }, [dispatch]);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, t('errRegistrationUsernameLength'))
      .max(20, t('errRegistrationUsernameLength'))
      .required(t('errRegistrationRequiredField'))
      .notOneOf(existingNames, t('errRenameChannelDouble')),
  });

  const formik = useFormik({
    initialValues: {
      name,
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      axios
        .patch(API_ROUTES.channels.channelById(curId), values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          dispatch(updateChannelName({ id: curId, name: values.name })); // Обновляем Redux с новыми данными
          notifySuccess();
        })
        .catch((error) => {
          if (error.response?.status === 500) {
            notifyError();
          }
        })
        .finally(() => {
          setSubmitting(false);
          closeModal();
        });
    },
  });

  return (
    <Modal show={isOpen && type === 'rename'} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('renameHeader')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="mb-3" onSubmit={formik.handleSubmit}>
          <label className="visually-hidden" htmlFor="name">
            {t('channelName')}
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            autoFocus
          />
          {formik.errors.name && <span className="bg-warning">{formik.errors.name}</span>}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          {t('close')}
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          {t('submitRenameBtn')}
          </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SwitchChannelName;