import React from 'react';
import styles from './greeting.module.scss';
import ImageWrapper from '../ImageWrapper';
import sun from '../../images/sun.svg';
import moon from '../../images/moon.svg';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useRouter } from 'next/router';
import { AuthContext } from '../UserRoute/';

export default function Greet(props) {
  let date = props.date;
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  function getSup(d) {
    let date = d.getDate();
    if (date > 20) date = date % 10;
    switch (date) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
  function getGreeting(d) {
    const hours = d.getHours();
    if (hours >= 0 && hours < 11) return 'morning';
    if (hours >= 11 && hours < 17) return 'afternoon';
    return 'evening';
  }

  return (
    <LayoutGroup>
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        layout
      >
        <motion.div className={styles.weatherIcon} layout>
          {date.getHours() >= 18 || date.getHours <= 6 ? (
            <ImageWrapper
              src={moon}
              alt='Moon Icon'
              objectFit='contain'
              className={styles.icon}
            />
          ) : (
            <ImageWrapper
              src={sun}
              alt='Sun Icon'
              objectFit='contain'
              className={styles.icon}
            />
          )}
        </motion.div>
        <motion.h1 layout>
          Good {getGreeting(date)}
          {props.fname && <br />}
          {props.fname && props.fname}!
        </motion.h1>
        <motion.h2 layout>
          It's {days[date.getDay()]}, {months[date.getMonth()]} {date.getDate()}
          <sup>{getSup(date)}</sup>
        </motion.h2>
        <motion.h1 layout>
          {date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}
        </motion.h1>
        {props.children}
      </motion.div>
    </LayoutGroup>
  );
}
