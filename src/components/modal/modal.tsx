import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalOverlayUI, ModalUI } from '@ui';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
    <ModalUI title={title} onClose={onClose} data-cy='order-number'>
      {children}
    </ModalUI>
    <ModalOverlayUI onClick={onClose} data-cy='modal-overlay'/>
    </>,
    modalRoot as HTMLDivElement
  );
});
