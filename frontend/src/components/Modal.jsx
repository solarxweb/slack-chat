import { useSelector } from 'react-redux';
import CreateChannel from './Channels/Modal/CreateChannel';
import SwitchChannelName from './Channels/Modal/ChangeNameChannel';
import MakeSureDelete from './Channels/Modal/MakeSureDelete';
import { useEffect } from 'react';


const ModalContainer = () => {
  const { type } = useSelector(state => state.modal);
  useEffect(() => {
    console.log('Modal type changed:', type);
  }, [type]);

  const renderModal = () => {
    switch (type) {
      case 'rename':
        return <SwitchChannelName />;
      case 'delete':
        return <MakeSureDelete />;
      case 'create':
        return <CreateChannel />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderModal()}
    </>
  );
};

export default ModalContainer;