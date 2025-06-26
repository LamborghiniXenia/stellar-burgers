import { FC, memo } from 'react';

import styles from './modal.module.css';

import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children, ...rest }) => (
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={`${styles.title}  ${title.startsWith('#') ? styles.number : `text_type_main-large`}`} >
            {title}
          </h3>
          <button className={styles.button} type='button' aria-label='Закрыть'>
            <CloseIcon type='primary' onClick={onClose} />
          </button>
        </div>
        <div className={styles.content} {...rest}>{children}</div>
      </div>

  )
);
