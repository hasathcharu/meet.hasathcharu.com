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

import Input from '../Input';
import Button from '../Button';
import { AuthContext } from '../PublicRoute';
import ImageWrapper from '../ImageWrapper';
import zoom from '../../images/zoom.svg';
import MeetingStatus from '../MeetingStatus';

function checkLive(props) {
  if (props?.status)
    return <MeetingStatus icon={faVideo} text={props.timeText} status={true} />;
  else if (props?.other) {
    return (
      <MeetingStatus
        icon={faCircleMinus}
        text='Host is in another meeting'
        other={true}
      />
    );
  }
  return <MeetingStatus icon={faCircleMinus} text='Inactive' status={false} />;
}

export default function LinkInfoBox(props) {
  const [clickCount, setClickCount] = React.useState(0);
  const [name, setName] = React.useState('');
  const [work, setWork] = React.useState('');
  const userData = React.useContext(AuthContext);
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
  return (
    <AnimatePresence>
      <LayoutGroup>
        <motion.div className={styles.box} layout>
          <div className={styles.zoomLogoContainer}>
            <h4>Hosted on</h4>
            <div className={styles.zoomLogoDiv}>
              <ImageWrapper
                src={zoom}
                alt='Zoom Logo'
                className={styles.zoomLogo}
              />
            </div>
          </div>
          <div className={styles.topicId}>
            <motion.h1 layout>{props.meeting?.topic}</motion.h1>
            <motion.h4 layout>{props.meeting?.id}</motion.h4>
          </div>
          {checkLive(props.meeting)}
          <motion.div className={styles.inputContainer} layout>
            <Input
              type='text'
              name='name'
              domName='Join as (optional)'
              placeholder='enter name'
              value={name}
              handleChange={(e) => setName(e.target.value)}
              error={''}
            />
          </motion.div>
          <Button
            text='Join'
            icon={faChalkboardUser}
            handleLoading={join}
            loading={false}
            unloadable={true}
            class='default'
          />
          {work}
        </motion.div>
      </LayoutGroup>
    </AnimatePresence>
  );
}
