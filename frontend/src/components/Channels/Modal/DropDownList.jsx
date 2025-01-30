/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import MakeSure from './MakeSureDelete.jsx';
import SwitchNameChannel from './ChangeNameChannel.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const DropdownElement = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleRemoveClick = () => {
    setIsOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleRenameClick = () => {
    setIsOpen(false);
    setIsEditorOpen(true);
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
          className='flex-grow-0 dropdown-toggle dropdown-toggle-split btn'
          type='button'
          id='dropdownMenuButton'
          onClick={toggleDropdown}
          aria-expanded={isOpen}
        >
          <span className='visually-hidden'>Управление каналом</span>
        </button>
        <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`} aria-labelledby={id}>
          <li>
            <a className='dropdown-item' href='#' role='button' onClick={handleRemoveClick}>
              Удалить
            </a>
          </li>
          <li>
            <a className='dropdown-item' href='#' role='button' onClick={handleRenameClick}>
              Переименовать
            </a>
          </li>
        </ul>
      </div>

      {/* Компонент MakeSure для подтверждения удаления */}
      <MakeSure 
        show={isConfirmationOpen} 
        onHide={() => {
          console.log('Закрываюсь'); 
          setIsConfirmationOpen(false);
        }}
        id={id}
      />
      
      {/* Компонент SwitchNameChannel для переименования */}
      <SwitchNameChannel
        show={isEditorOpen}
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