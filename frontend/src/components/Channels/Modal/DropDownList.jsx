/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useRef, useEffect } from 'react';
import MakeSure from './MakeSureDelete.jsx';
import SwitchNameChannel from './ChangeNameChannel.jsx';
import { setOpen } from '../../../store/modalSlice.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const DropdownElement = ({ id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const { type } = useSelector((state) => state.modal)
  const dropdownRef = useRef(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  return (
    <>
      <div ref={dropdownRef}>
        <button
          className="flex-grow-0 dropdown-toggle dropdown-toggle-split btn"
          type="button"
          id="dropdownMenuButton"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
        >
          <span className="visually-hidden">Управление каналом</span>
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
              onClick={() => dispatch(setOpen({ type: 'remove' }))}
            >
              {t('remove')}
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              href="#"
              role="button"
              onClick={() => dispatch(setOpen({ type: 'rename'}))}
            >
              {t('submitRenameBtn')}
            </a>
          </li>
        </ul>
      </div>

      {/* Компонент MakeSure для подтверждения удаления */}
      <MakeSure
        show={type === 'delete'}
        onHide={() => {
          console.log('Закрываюсь');
          setIsConfirmationOpen(false);
        }}
        id={id}
      />

      {/* Компонент SwitchNameChannel для переименования */}
      <SwitchNameChannel
        show={type === 'rename'}
        onHide={() => {
          console.log('Закрываю редактор');
          setIsEditorOpen(false);
        }}
        id={id}
      />
    </>
  );
};

export default DropdownElement;
