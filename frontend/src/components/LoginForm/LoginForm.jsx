import './LoginForm.css';
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
  const { t } = useTranslation()

  const noticeError = () => toast.warn(t('errNetwork'));

  const navigate = useNavigate();
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
    onSubmit: (values) => {
      axios.post('/api/v1/login', values)
        .then(({ data: user }) => {
          localStorage.setItem('username', user.username);
          localStorage.setItem('token', user.token);
          setAuthError(false)
          dispatch(setUserData(user));
          navigate('/');
        })
        .catch((e) => {
          if (e.status === 500) {
            noticeError();
          } else if (e.status === 401) {
            setAuthError(true);
          }
          console.warn(e)
        })
    }
  });

  return (
    <div className="auth-wrapper">
      <form onSubmit={formik.handleSubmit} className="auth-form">
        <div className="auth-fields">
          <div className="auth-title">
            <h1>Войти</h1>
          </div>
          <label htmlFor='username'>Ваше имя</label>
          <input
            required
            className='input-field'
            type="text"
            name='username'
            id='login_form-control'
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? (
            <span style={{ color: 'red' }}>{formik.errors.username}</span>
          ) : null}
          
          <label htmlFor='password'>Пароль</label>
          <input
            required
            className='input-field'
            type="password"
            name='password'
            id='password_form-control'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <span style={{ color: 'red' }}>{formik.errors.password}</span>
          ) : null}

          {authError && <span style={{ backgroundColor: 'red', padding: '5px', margin: '5px', color: 'white', fontSize: '14px', width: '270px'}}>{t('errLogin')}</span>}

        </div>
        <div className="submit_btn-wrapper">
          <button type="submit" className='submit-btn'>Войти</button>
        </div>
      <div className="auth-unregistred">
        <p>Нет аккаунта? <a className='auth-unregistred__signup' href="/signup">Регистрация</a></p>
      </div>
      </form>
    </div>
  );
};