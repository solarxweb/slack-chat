import { useNavigate } from 'react-router-dom';
import './Header.css';
import { useTranslation } from 'react-i18next';
import { clearUserData } from '../../store/authSlice';

const Header = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const redir = useNavigate();
  const link = token ? '/' : '/login';
  const logout = () => {
    localStorage.clear();
    clearUserData();
    redir('/login');
  };
  // Вместо title, используем строку как ключ
  return (
    <>
      <div className='header__container'>
        <div className='header__title'>
          <a href={link} className='title'>
            {t('title')}
          </a>
        </div>
        <div className='header__btn-logout'>
          {token ? (
            <button className='btn btn-primary' type='button' onClick={logout}>
              {t('logout')}
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Header;
