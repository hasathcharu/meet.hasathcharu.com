import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './meetingstatus.module.scss';

export default function MeetingStatus(props) {
  let style = styles.inactive;
  if (props.status) {
    style = styles.live;
  } else if (props.other) {
    style = styles.other;
  }
  return (
    <LayoutGroup>
      <motion.p className={`${styles.status} ${style}`}>
        <motion.span layout>
          <FontAwesomeIcon icon={props.icon} />
        </motion.span>
        <motion.span layout>{props.text}</motion.span>
      </motion.p>
    </LayoutGroup>
  );
}
