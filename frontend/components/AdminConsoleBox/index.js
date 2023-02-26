import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './adminconsolebox.module.scss';

export default function AdminConsoleBox(props) {
  return (
    <div className={styles.box} onClick={props.onClick}>
      <div className={styles.icon}>
        <FontAwesomeIcon icon={props.icon} />
      </div>
      <h2 className={styles.number}>{props.number}</h2>
      <h3 className={styles.text}>{props.text}</h3>
    </div>
  );
}
