import React from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleMinus,
  faVideo,
  faChalkboardUser,
} from '@fortawesome/free-solid-svg-icons';
import styles from './linkinfo.module.scss';
import Greeting from '../Greeting';
import ServerError from '../ServerError';
import { useRouter } from 'next/router';
import Input from '../Input';
import Button from '../Button';
import { AuthContext } from '../UserRoute';
import ImageWrapper from '../ImageWrapper';
import zoom from '../../images/zoom.svg';
import interview from '../../images/interview.png';

function checkLive(props) {
  if (props?.status)
    return (
      <p className={`${styles.status} ${styles.live}`}>
        <span>
          <FontAwesomeIcon icon={faVideo} />
        </span>
        <span>{props?.timeText}</span>
      </p>
    );
  return (
    <p className={`${styles.status} ${styles.inactive}`}>
      <span>
        <FontAwesomeIcon icon={faCircleMinus} />
      </span>
      <span>Inactive</span>
    </p>
  );
}

export default function LinkInfo(props) {
  const [clickCount, setClickCount] = React.useState(0);
  const [name, setName] = React.useState('');
  const [work, setWork] = React.useState('');
  const router = useRouter();
  const userData = React.useContext(AuthContext);
  const [date, setDate] = React.useState(new Date());
  function join() {
    let unameText = '';
    var uname = name.trim().split(' ');
    if (uname) {
      uname.forEach((item, index) => {
        uname[index] = item.charAt(0).toUpperCase() + item.slice(1);
      });
      uname = uname.join(' ');
    }

    if (uname) {
      unameText = '&uname=' + encodeURI(uname);
    } else if (userData) {
      unameText =
        '&uname=' +
        encodeURI(userData.user?.fname + ' ' + userData.user?.lname);
    } else {
      unameText = '';
    }
    setClickCount((prev) => prev + 1);
    if (isMobile) {
      window.location.href = `zoomus://zoom.us/join?confno=${props.meeting?.id}&pwd=${props.meeting?.pwd}${unameText}`;
    } else {
      window.location.href = `zoommtg://zoom.us/join?confno=${props.meeting?.id}&pwd=${props.meeting?.pwd}${unameText}`;
    }
    if (clickCount > 1) {
      setWork(
        <span>
          Doesn't work? Click
          <a
            href={
              'https://us02web.zoom.us/j/' +
              props.meeting?.id +
              '?pwd=' +
              props.meeting?.pwd +
              unameText
            }
          >
            &nbsp;here&nbsp;
          </a>
          to join
        </span>
      );
    }
  }
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  });
  return (
    <div className={styles.dashboard}>
      <div>
        <Greeting fname={userData.user?.fname} date={date}></Greeting>
        <br />
        <div className={styles.smallImage}>
          <ImageWrapper
            src={interview}
            alt='Interview Image'
            className={styles.interviewImage}
            objectFit='contain'
          />
        </div>
      </div>
      <div className={styles.box}>
        <div class={styles.zoomLogoContainer}>
          <ImageWrapper
            src={zoom}
            alt='Zoom Logo'
            className={styles.zoomLogo}
          />
        </div>
        <h1>{props.meeting?.topic}</h1>
        {checkLive(props.meeting)}
        <div className={styles.inputContainer}>
          <Input
            type='text'
            name='name'
            domName='Join as (optional)'
            placeholder='enter name'
            value={name}
            handleChange={(e) => setName(e.target.value)}
            error={''}
          />
        </div>
        <Button
          text='Join'
          icon={faChalkboardUser}
          handleLoading={join}
          loading={false}
          unloadable={true}
          class='default'
        />
        {work}
      </div>
    </div>
  );
}
