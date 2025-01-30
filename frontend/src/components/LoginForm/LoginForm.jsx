import './LoginForm.css';
import { Spinner } from 'react-bootstrap';
import { API_ROUTES } from '../../api';
import * as yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../store/authSlice';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const LoginForm = () => {
  const { t } = useTranslation();
  const noticeError = () => toast.warning(t('errNetwork'));

  const redir = useNavigate();
  const dispatch = useDispatch();
  const [authError, setAuthError] = useState(false);

  const validationSchema = yup.object().shape({
    username: yup.string().required(t('errRegistrationRequiredField')),
    password: yup.string().required(t('errRegistrationRequiredField')),
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
        formik.isValid ? redir('/') : formik.setError('username', t('errLogin'));
      } catch (error) {
        console.error('Login error:', error);
        if (error.status === 401) {
          setAuthError(true);
        } else if (error.status === 500) {
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
          <div className="form-floating mb-3">
            {/* Поле имени пользователя */}
            <input
              placeholder={t('loginName')}
              required
              className={`input-field form-control ${formik.touched.username && formik.errors.username ? 'error' : ''}`}
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <label className="label-form" htmlFor="username">{t('loginName')}</label>
            {formik.touched.username && formik.errors.username && (
              <span className="error-message">{formik.errors.username}</span>
            )}
          </div>
          
            <div className="form-floating mb-3">
              {/* Поле пароля */}
              <input
                placeholder={t('loginPassword')}
                required
                className={`input-field form-control ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label className="label-form" htmlFor="password">{t('loginPassword')}</label>
              {formik.touched.password && formik.errors.password && (
                <span className="error-message">{formik.errors.password}</span>
              )}
            </div>

          {/* Общая ошибка авторизации */}
          {authError && <div className="auth-error">{t('errLogin')}</div>}

          <button type="submit" className="submit-btn" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? <Spinner style={{ width: '15px', height: '15px'}}/> : t('enter')}
          </button>
        </div>


        <div className="auth-unregistred">
          <p>
            {t('noAccount')}{' '}
            <a className="auth-unregistred__signup" href="/signup">
              {t('signUpTitle')}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
