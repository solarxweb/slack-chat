/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setOpen } from '../../../store/modalSlice.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

const DropdownElement = ({ id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenRename = () => {
    dispatch(setOpen({ type: 'rename', extra: id }));
  };

  const handleOpenRemove = () => {
    dispatch(setOpen({ type: 'delete', extra: id }));
  };

  return (
      <div ref={dropdownRef}>
        <button
          className="flex-grow-0 dropdown-toggle dropdown-toggle-split btn"
          type="button"
          id="dropdownMenuButton"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
        >
          <span className="visually-hidden">{t('labelChannelControl')}</span>
        </button>
        <ul
          className={`dropdown-menu ${isOpen ? 'show' : ''}`}
          aria-labelledby={id}
        >
          <li>
            <a
              className="dropdown-item"
              href="#"
              role="button"
              onClick={handleOpenRemove}
            >
              {t('remove')}
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              href="#"
              role="button"
              onClick={handleOpenRename}
            >
              {t('submitRenameBtn')}
            </a>
          </li>
        </ul>
      </div>
  );
};

export default DropdownElement;
