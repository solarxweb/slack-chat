import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import API_ROUTES from '../../../api';
import { setClose } from '../../../store/modalSlice';
import { addChannel, setCurrentChannel } from '../../../store/channelSlice';

const CreateChannel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const notifySuccess = () => toast.success(t('noticeChannelCreated'));
  const notifyError = () => toast.warning(t('errCreateChannelNetwork'));

  const channelsList = useSelector((state) => state.channels.entities);
  const existingNames = Object.values(channelsList).map((el) => el.name);
  const inputRef = useRef(null);
  const { type } = useSelector((state) => state.modal);

  useEffect(() => {
    leoProfanity.loadDictionary('en');
  }, []);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, t('errRegistrationUsernameLength'))
      .max(20, t('errRegistrationUsernameLength'))
      .required(t('errCreateChannelEmpty'))
      .notOneOf(existingNames, t('errRenameChannelDouble')),
  });
  const token = localStorage.getItem('token');

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!token) return;

      const filteredName = leoProfanity.clean(values.name);
      const isProfane = filteredName !== values.name;

      const channelNameToSend = isProfane ? '*'.repeat(values.name.length) : filteredName;

      try {
        const response = await axios.post(
          API_ROUTES.channels.list(),
          { name: channelNameToSend },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        dispatch(addChannel(response.data));
        dispatch(setCurrentChannel(response.data.id));
        formik.resetForm();
        notifySuccess();
      } catch (error) {
        console.warn(error.message);
        notifyError();
      } finally {
        setSubmitting(false);
        dispatch(setClose());
      }
    },
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleClose = () => {
    formik.resetForm();
    dispatch(setClose());
  };

  return (
    <Modal centered show={type === 'create'} onHide={() => dispatch(setClose())}>
      <Modal.Header closeButton>
        <Modal.Title>{t('createChannelHeader')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="mb-3" onSubmit={formik.handleSubmit}>
          <label className="visually-hidden" htmlFor="name">{t('channelName')}</label>
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            aria-label="name"
          />
          {formik.errors.name ? <span className="bg-warning">{formik.errors.name}</span> : null}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('close')}
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          {t('submitCreateChannelBtn')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateChannel;
