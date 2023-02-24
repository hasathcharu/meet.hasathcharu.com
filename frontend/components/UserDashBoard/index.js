import React from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons';
import styles from './userdashboard.module.scss';
import Greeting from '../Greeting';
import ServerError from '../ServerError';
import { useRouter } from 'next/router';
import { AuthContext } from '../UserRoute/';
import UMeetingCard from '../UMeetingCard';

export default function UserDashBoard(props) {
  const API = process.env.NEXT_PUBLIC_API;
  const [serverError, setServerError] = React.useState(0);
  const router = useRouter();
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
      if (error.message.startsWith('AuthError')) {
        router.push('/log-in');
      }
    } catch {
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
            topic={liveMeeting?.topic}
            status={liveMeeting?.status}
            timeText={liveMeeting?.timeText}
            url={liveMeeting?.url}
            meetingId={liveMeeting?.id}
            pwd={liveMeeting?.pwd}
            updateMeetings={updateMeetings.bind(this, userData.auth)}
          />
        </motion.div>
      </Greeting>
      <LayoutGroup>
        {meetings?.length === 0 && !liveMeeting?.topic && (
          <h1>You have no assigned meetings yet.</h1>
        )}
        {meetings?.length !== 0 && (
          <motion.div className={styles.meetings} layout>
            {meetings.length > 0 && (
              <motion.h1 layout>
                {liveMeeting?.topic ? 'Other ' : 'Your '}Meetings
              </motion.h1>
            )}
            <motion.div className={styles.meetingsContainer} layout>
              {meetings?.map((meeting) => {
                return (
                  <UMeetingCard
                    key={meeting.id}
                    topic={meeting.topic}
                    status={meeting.status}
                    timeText={meeting.timeText}
                    url={meeting.url}
                    meetingId={meeting.id}
                    pwd={meeting.pwd}
                    updateMeetings={updateMeetings.bind(this, userData.auth)}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </LayoutGroup>
      <ServerError
        open={serverError}
        closeModal={() => {
          setServerError(0);
        }}
      />
    </div>
  );
}
