import './SignUp.css'
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { setUserData } from '../../store/authSlice';

const SignUp = () => {
  const redir = useNavigate();
  const { t } = useTranslation();
  const noticeError = () => toast.warning(t('errNetwork'))

  const validationSchema = yup.object({
    userLogin: yup.string()
      .min(3, t('errRegistrationUsernameLength'))
      .max(20, t('errRegistrationUsernameLength'))
      .required(t('errRegistrationRequiredField')),
    userPassword: yup.string()
      .min(6, t('errRegistrationNotEnougthSymbs'))
      .required(t('errRegistrationRequiredField')),
    userConfirmPassword: yup.string()
      .required(t('errRegistrationRequiredField'))
      .oneOf([yup.ref('userPassword'), null], t('errRegistrationPasswordsDontMatch')),
      
  });

  const formik = useFormik({
    initialValues: {
      userLogin: '',
      userPassword: '',
      userConfirmPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        axios.post('/api/v1/signup', {
          username: values.userLogin,
          userPassword: values.userPassword,
        })
        .then((response) => {
          if (response.statusText === 'Created') {
            const { username, token } = response.data;
            setUserData({username, token})
            localStorage.setItem('username', username);
            localStorage.setItem('token', token);
            redir('/');
          }
        })
        .catch((error) => {
          if (error.status === 500) {
            noticeError()
          } else if (error.status === 409) {
            formik.setFieldError('userLogin', t('errRegistrationAlreadyExist'))
          }
          console.warn(error)
        })
      } catch (netError) {
        noticeError();
        console.warn(netError)
      }
    },
  });

  return (
    <>
      <div className="signup-wrapper">
        <div className="signup-title">
          <h3>Регистрация</h3>
        </div>
        <form onSubmit={formik.handleSubmit} className='signup-form'>
          <div className="form-floating mb-3">
            <input id='signup-login' className='form-control' type="text" name="userLogin" value={formik.values.userLogin} onChange={formik.handleChange} />
            <label className='form-label'>Имя пользователя</label>
              {formik.touched.userLogin && formik.errors.userLogin ? <div className='bg-danger'>{formik.errors.userLogin}</div> : null}
          </div>
          <div className="form-floating mb-3">
            <input id='signup-password' className='form-control' type="password" name="userPassword" value={formik.values.userPassword} onChange={formik.handleChange} />
              {formik.touched.userPassword && formik.errors.userPassword ? <div className='bg-danger'>{formik.errors.userPassword}</div> : null}
            <label className='form-label'>Пароль</label>
          </div>
          <div className="form-floating mb-3">
            <input id='signup-password' className='form-control' type="password" name="userConfirmPassword" value={formik.values.userConfirmPassword} onChange={formik.handleChange} />
              {formik.touched.userConfirmPassword && formik.errors.userConfirmPassword ? <div className='bg-danger'>{formik.errors.userConfirmPassword}</div> : null}
            <label className='label-control'>Подтвердите пароль</label>
          </div>
          <button className='signup-btn btn btn-outline-primary' type="submit">Зарегистрироваться</button>
        </form>
        </div>
    </>
  );
};

export default SignUp;