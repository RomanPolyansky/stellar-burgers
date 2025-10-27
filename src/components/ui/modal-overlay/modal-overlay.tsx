import styles from './modal-overlay.module.css';
import { dataCy } from '../../../utils/dataCy';

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div
    className={styles.overlay}
    data-cy={dataCy.modalOverlay}
    onClick={onClick}
  />
);
