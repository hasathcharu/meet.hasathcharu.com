import React from 'react';
import unapproved from '../../images/unapproved.png';
import styles from './unapproved.module.scss';
import ImageWrapper from '../ImageWrapper';

export default function UnapprovedUser(props) {
  return (
    <div className={styles.dashboard}>
      <h1>Hello {props.fname} 👋</h1>
      <div className={styles.smallImage}>
        <ImageWrapper
          src={unapproved}
          alt='Unapproved User'
          className={styles.interviewImage}
          objectFit='contain'
        />
      </div>
      <h1>Haritha is yet to approve you</h1>
    </div>
  );
}
