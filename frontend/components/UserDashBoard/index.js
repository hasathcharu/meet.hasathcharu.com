import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import styles from './userdashboard.module.scss';
import Greeting from '../Greeting';
import ServerError from '../ServerError';
import { useRouter } from 'next/router';
import { AuthContext } from '../UserRoute/';
import UMeetingCard from '../UMeetingCard';
import MeetingStatus from '../MeetingStatus';
import LinkInfoBox from '../LinkInfoBox';
import Modal from '../Modal';
import noface from '../../images/ghost.png';
import ImageWrapper from '../ImageWrapper';

export default function UserDashBoard(props) {
  const API = process.env.NEXT_PUBLIC_API;
  const [serverError, setServerError] = React.useState(0);
  const router = useRouter();
  const [joinModal, setJoinModal] = React.useState(false);
  const [activeMeeting, setActiveMeeting] = React.useState({});
  function openJoinModal(meetingId) {
    setActiveMeeting(meetingId);
    setJoinModal(true);
  }
  function closeJoinModal() {
    setJoinModal(false);
    setActiveMeeting({});
  }
  const userData = React.useContext(AuthContext);
  const [meetings, setMeetings] = React.useState([]);
  const [liveMeeting, setLiveMeeting] = React.useState({});
  const [otherMeeting, setOtherMeeting] = React.useState(0);
  const [date, setDate] = React.useState(new Date());
  async function updateMeetings(token) {
    try {
      const res = await fetch(API + '/user/meeting-status', {
        method: 'get',
        headers: new Headers({
          authorization: 'Bearer ' + token,
        }),
      });
      const result = await res.json();
      if (result.message === 'Success') {
        const liveMeeting = result.links.find((link) => link.status);
        const otherMeetings = result.links.filter((link) => !link.status);
        setLiveMeeting(liveMeeting);
        setMeetings(otherMeetings);
        setOtherMeeting(result.other);
        return;
      }
      throw new Error(result.message);
    } catch (error) {
      console.log(error);
      if (error.message.startsWith('AuthError')) {
        router.push('/log-in');
        return;
      }
      setServerError(1);
    }
  }
  React.useEffect(() => {
    updateMeetings(userData.auth);
    setDate(new Date());
    const interval = setInterval(() => {
      updateMeetings(userData.auth);
      setDate(new Date());
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className={styles.dashboard}>
      <Greeting fname={userData.user.fname} date={date}>
        <motion.div className={styles.liveMeeting} layout>
          <UMeetingCard
            meeting={liveMeeting}
            openJoinModal={() => openJoinModal(liveMeeting.id)}
          />
        </motion.div>
      </Greeting>
      <LayoutGroup>
        {meetings?.length === 0 && !liveMeeting?.topic && (
          <div>
            <div className={styles.smallImage}>
              <ImageWrapper
                src={noface}
                alt='No Face'
                className={styles.interviewImage}
                objectFit='contain'
              />
            </div>
            <h3>You have no assigned meetings yet.</h3>
          </div>
        )}
        {meetings?.length !== 0 && (
          <motion.div className={styles.meetings} layout>
            {meetings.length > 0 && (
              <motion.h1 layout>
                {liveMeeting?.topic ? 'Other ' : 'Your '}Meetings
              </motion.h1>
            )}
            {otherMeeting ? (
              <MeetingStatus
                other={true}
                text='Host is in another meeting'
                icon={faBrain}
              />
            ) : null}
            <motion.div className={styles.meetingsContainer} layout>
              {meetings?.map((meeting) => {
                return (
                  <UMeetingCard
                    meeting={meeting}
                    openJoinModal={() => openJoinModal(meeting.id)}
                    key={meeting.id}
                    updateMeetings={updateMeetings.bind(this, userData.auth)}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </LayoutGroup>
      <Modal open={joinModal} closeModal={closeJoinModal}>
        <LinkInfoBox
          meeting={
            liveMeeting?.id === activeMeeting
              ? liveMeeting
              : meetings.find((meeting) => meeting.id === activeMeeting)
          }
        />
      </Modal>
      <ServerError
        open={serverError}
        closeModal={() => {
          setServerError(0);
        }}
      />
    </div>
  );
}
