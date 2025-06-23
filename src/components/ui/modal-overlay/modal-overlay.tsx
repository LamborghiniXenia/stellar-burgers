import { FC } from 'react';
import styles from './modal-overlay.module.css';

type ModalOverlayUIProps = {
  onClick?: () => void;
};

export const ModalOverlayUI: FC<ModalOverlayUIProps> = ({onClick, ...rest}) => (
  <div className={styles.overlay} onClick={onClick} {...rest}/>
);
