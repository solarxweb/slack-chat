import './SignUp.css';
import { Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../store/authSlice';
import API_ROUTES from '../../api';

const SignUp = () => {
  const redir = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const noticeError = () => toast.warning(t('errNetwork'));

  const validationSchema = yup.object({
    userLogin: yup
      .string()
      .min(3, t('errRegistrationUsernameLength'))
      .max(20, t('errRegistrationUsernameLength'))
      .required(t('errRegistrationRequiredField')),
    userPassword: yup
      .string()
      .min(6, t('errRegistrationNotEnougthSymbs'))
      .required(t('errRegistrationRequiredField')),
    userConfirmPassword: yup
      .string()
      .required(t('errRegistrationRequiredField'))
      .oneOf([yup.ref('userPassword')], t('errRegistrationPasswordsDontMatch')),
  });

  const formik = useFormik({
    initialValues: {
      userLogin: '',
      userPassword: '',
      userConfirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(API_ROUTES.signup(), {
          username: values.userLogin,
          password: values.userPassword,
        });
        if (response.statusText === 'Created') {
          const { username, token } = response.data;
          localStorage.setItem('username', username);
          localStorage.setItem('token', token);
          dispatch(setUserData({ username, token }));
          redir('/');
        }
      } catch (error) {
        if (error.response?.status === 409) {
          formik.setFieldError('userLogin', t('errRegistrationAlreadyExist'));
        } else if (error.response?.status === 500) {
          noticeError();
        } else {
          console.error('Unexpected error:', error);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="signup-wrapper">
      <div className="signup-title">
        <h3>{t('signUpTitle')}</h3>
      </div>
      <form onSubmit={formik.handleSubmit} className="signup-form">
        {/* Поле логина */}
        <div className="form-floating mb-3">
          <input
            placeholder={t('signUpUsername')}
            id="signup-login"
            className={`form-control ${
              formik.touched.userLogin && formik.errors.userLogin
                ? 'is-invalid'
                : ''
            }`}
            type="text"
            name="userLogin"
            value={formik.values.userLogin}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label htmlFor="signup-login" className="form-label">
            {t('signUpUsername')}
          </label>
          {formik.touched.userLogin && formik.errors.userLogin && (
            <div className="invalid-feedback">{formik.errors.userLogin}</div>
          )}
        </div>

        {/* Поле пароля */}
        <div className="form-floating mb-3">
          <input
            placeholder={t('signUpPassword')}
            id="signup-password"
            className={`form-control ${
              formik.touched.userPassword && formik.errors.userPassword
                ? 'is-invalid'
                : ''
            }`}
            type="password"
            name="userPassword"
            value={formik.values.userPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label htmlFor="signup-password" className="form-label">
            {t('signUpPassword')}
          </label>
          {formik.touched.userPassword
          && formik.errors.userPassword
            && (
            <div className="invalid-feedback">{formik.errors.userPassword}</div>
          )}
        </div>

        {/* Подтверждение пароля */}
        <div className="form-floating mb-3">
          <input
            placeholder={t('signUpConfirmPassword')}
            id="signup-confirm-password"
            className={`form-control ${
              formik.touched.userConfirmPassword &&
              formik.errors.userConfirmPassword
                ? 'is-invalid'
                : ''
            }`}
            type="password"
            name="userConfirmPassword"
            value={formik.values.userConfirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label htmlFor="signup-confirm-password" className="form-label">
            {t('signUpConfirmPassword')}
          </label>
          {formik.touched.userConfirmPassword
          &&
            formik.errors.userConfirmPassword
            && (
            <div className="invalid-feedback">
              {formik.errors.userConfirmPassword}
            </div>
          )}
        </div>

        <button
          className="signup-btn btn btn-outline-primary"
          type="submit"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <Spinner style={{ width: '15px', hight: '15px' }} />
          ) : (
            t('signUpRegistrationBtn')
          )}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
