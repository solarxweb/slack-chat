import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import './LoginForm.css';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import API_ROUTES from '../../api';
import { setUserData } from '../../store/authSlice';

const LoginForm = () => {
  const { t } = useTranslation();
  const noticeError = () => toast.warning(t('errNetwork'));

  const redir = useNavigate();
  const dispatch = useDispatch();
  const [authError, setAuthError] = useState(false);

  const validationSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setAuthError(false);
      try {
        const { data: user } = await axios.post(API_ROUTES.login(), values);
        localStorage.setItem('username', user.username);
        localStorage.setItem('token', user.token);
        dispatch(setUserData(user));
        redir('/');
      } catch (error) {
        if (error.response?.status === 401) {
          redir('/login');
          setAuthError(true);
        } else if (error.response?.status === 500) {
          noticeError();
        }
      }
    },
  });

  return (
    <div className="auth-wrapper">
      <form onSubmit={formik.handleSubmit} className="auth-form">
        <div className="auth-fields">
          <div className="auth-title">
            <h1>{t('enter')}</h1>
          </div>
          <div className="form-floating">
            <input
              id="username"
              placeholder={t('loginName')}
              required
              className="input-field form-control"
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
            <label className="label-form" htmlFor="username">
              {t('loginName')}
            </label>
          </div>
          <div className="form-floating">
            <input
              id="password"
              placeholder={t('loginPassword')}
              required
              className="input-field form-control"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <label className="label-form" htmlFor="password">
              {t('loginPassword')}
            </label>
          </div>
          {authError && <div className="error-message">{t('errLogin')}</div>}
          <button
            type="submit"
            className="submit-btn"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <Spinner style={{ width: '15px', height: '15px' }} />
            ) : (
              t('enter')
            )}
          </button>
        </div>

        <div className="auth-unregistered">
          <p>
            {t('noAccount')}
            {' '}
            <a className="auth-unregistered__signup" href="/signup">
              {t('signUpTitle')}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
