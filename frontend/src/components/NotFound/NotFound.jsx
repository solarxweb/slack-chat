/* eslint-disable react/self-closing-comp */
import './NotFound.css';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <>
    <div className="oops-block">
      <h1 className="oops-title">
        <p>
          {t('notFound')}
        </p>
      </h1>
    </div>
    <div className="ribbon"></div>
    </>
  );
};

export default NotFound;
