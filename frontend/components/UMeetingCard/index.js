import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChalkboardUser,
  faClone,
  faTrash,
  faArrowUpRightFromSquare,
  faVideo,
  faCircleMinus,
} from '@fortawesome/free-solid-svg-icons';
import styles from './umeetingcard.module.scss';
import ServerError from '../ServerError';
import Button from '../Button';
import { useRouter } from 'next/router';
import { AuthContext } from '../UserRoute/';
import MeetingStatus from '../MeetingStatus';

function checkLive(props) {
  if (props.meeting.status)
    return (
      <MeetingStatus
        icon={faVideo}
        text={props.meeting.timeText}
        status={props.meeting.status}
      />
    );
  return <MeetingStatus icon={faCircleMinus} text='Inactive' />;
}

export default function UMeetingCard(props) {
  const router = useRouter();
  const [joinModal, setJoinModal] = React.useState(false);
  const API = process.env.NEXT_PUBLIC_API;
  const [serverError, setServerError] = React.useState(0);
  const userData = React.useContext(AuthContext);
  const transition = {
    duration: 1,
  };

  function copy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        process.env.NEXT_PUBLIC_DOMAIN + '/j/' + props.meeting.url
      );
    }
  }
  function open() {
    router.push('/j/' + props.meeting.url);
  }
  async function unAssign() {
    try {
      const res = await fetch(API + '/user/unassign', {
        method: 'delete',
        headers: new Headers({
          authorization: 'Bearer ' + userData.auth,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          link_id: props.meeting.id,
        }),
      });
      const result = await res.json();
      if (result.message === 'Success') {
        await props.updateMeetings();
        return;
      }
      if (result.message.startsWith('AuthError')) router.push('/log-in');
      return;
    } catch {
      setServerError(1);
    }
  }
  return (
    <>
      <AnimatePresence>
        {props.meeting?.topic && (
          <motion.div
            className={styles.meetingCard}
            initial={{ scale: 0, transition: transition }}
            animate={{ scale: 1, transition: transition }}
            exit={{ scale: 0, transition: transition }}
            layout
          >
            <div className={styles.meetingInfo}>
              <h1 className={styles.topic}>{props.meeting?.topic}</h1>
              <h2 className={styles.meetingId}>{props.meeting?.id}</h2>
              {checkLive(props)}
            </div>
            <div className={styles.joinArea}>
              <div className={styles.meetJoin}>
                <Button
                  text='Join'
                  icon={faChalkboardUser}
                  unloadable={true}
                  handleLoading={props.openJoinModal}
                  loading={false}
                  class='default regular join'
                />
              </div>
              <div className={styles.meetActions}>
                {props.meeting.url && (
                  <Button
                    text='Copy'
                    icon={faClone}
                    handleLoading={copy}
                    toolTip={true}
                    loading={false}
                    class='default small tertiary join'
                  />
                )}
                {props.meeting.url && (
                  <Button
                    text='Open'
                    icon={faArrowUpRightFromSquare}
                    toolTip={true}
                    handleLoading={open}
                    loading={false}
                    class='default small join'
                  />
                )}
                <Button
                  text='Delete'
                  toolTip={true}
                  icon={faTrash}
                  handleLoading={unAssign}
                  loading={false}
                  class='default small danger join'
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ServerError
        open={serverError}
        closeModal={() => {
          setServerError(0);
        }}
      />
    </>
  );
}
