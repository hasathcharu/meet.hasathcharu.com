import React from 'react';
import { motion } from 'framer-motion';
import {
  faCircleCheck,
  faCircleXmark,
  faCirclePlus,
  faUserPen,
  faCircleMinus,
} from '@fortawesome/free-solid-svg-icons';
import styles from './usercard.module.scss';
import Button from '../Button';
import { useRouter } from 'next/router';
import { AuthContext } from '../AdminRoute';

export default function UserCard(props) {
  const API = process.env.NEXT_PUBLIC_API;
  const userData = React.useContext(AuthContext);
  const router = useRouter();
  const [rejecting, setRejecting] = React.useState(false);
  const [approving, setApproving] = React.useState(false);
  const [assigning, setAssigning] = React.useState(false);
  const [unassigning, setUnassigning] = React.useState(false);
  const transition = {
    duration: 1,
  };

  async function assign(assign) {
    if (assign) {
      setAssigning(true);
    } else {
      setUnassigning(true);
    }
    try {
      const data = {
        user_id: props.user?.user_id,
        link_id: props.meeting.link_id,
      };
      let url = '/admin/users/assign';
      if (!assign) {
        url = '/admin/users/unassign';
      }
      const res = await fetch(API + url, {
        method: assign ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + userData.auth,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.message === 'Success') {
        await props.getData();
        setAssigning(false);
        setUnassigning(false);
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      let err = 'Something went wrong :(';
      console.log(error.message);
      if (error.message.startsWith('AuthError')) {
        router.push('/log-in');
        return;
      }
    }
  }
  async function approve(approve) {
    if (approve) {
      setApproving(true);
    } else {
      setRejecting(true);
    }
    try {
      const data = {
        user_id: props.user?.user_id,
        approve: approve,
      };
      const res = await fetch(API + '/admin/approve-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + userData.auth,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.message === 'Success') {
        await props.getData();
        setApproving(false);
        setRejecting(false);
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      let err = 'Something went wrong :(';
      console.log(error.message);
      if (error.message.startsWith('AuthError')) {
        router.push('/log-in');
        return;
      }
    }
  }
  return (
    <>
      <motion.div
        className={styles.meetingCard}
        initial={{ scale: 0, transition: transition }}
        animate={{ scale: 1, transition: transition }}
        exit={{ scale: 0, transition: transition }}
        layout
      >
        <div className={styles.meetingInfo}>
          <h1 className={styles.topic}>{props.user?.fname}</h1>
          <h2 className={styles.meetingId}>{props.user?.lname}</h2>
          <h3 className={styles.meetingId}>{props.user?.email}</h3>
        </div>
        {!props.assignMode &&
          (props.manage ? (
            <div className={styles.joinArea}>
              <div className={styles.meetJoin}>
                <Button
                  text='Assign'
                  icon={faCirclePlus}
                  handleLoading={props.assign}
                  loading={false}
                  class='default regular join'
                  hundred={true}
                  unloadable={true}
                />
              </div>
              <div className={styles.meetJoin}>
                <Button
                  text='Manage'
                  icon={faUserPen}
                  loading={false}
                  unloadable={true}
                  handleLoading={() =>
                    router.push('/admin/manage-user/' + props.user.user_id)
                  }
                  hundred={true}
                  class='default regular stertiary join'
                />
              </div>
            </div>
          ) : (
            <div className={styles.joinArea}>
              <div className={styles.meetJoin}>
                <Button
                  text='Approve'
                  icon={faCircleCheck}
                  handleLoading={() => approve(1)}
                  loading={approving}
                  class='default regular join'
                  hundred={true}
                />
              </div>
              <div className={styles.meetJoin}>
                <Button
                  text='Reject'
                  icon={faCircleXmark}
                  loading={rejecting}
                  handleLoading={() => approve(0)}
                  hundred={true}
                  class='default regular sdanger join'
                />
              </div>
            </div>
          ))}
        {props.assignMode && (
          <div className={styles.joinArea}>
            <div className={styles.meetJoin}>
              {props.assigned?.find(
                (user) => user.user_id === props.user?.user_id
              ) ? (
                <Button
                  text='Unassign'
                  icon={faCircleMinus}
                  handleLoading={() => assign(0)}
                  loading={unassigning}
                  class='default regular join sdanger'
                  hundred={true}
                  unloadable={true}
                />
              ) : (
                <Button
                  text='Assign'
                  icon={faCirclePlus}
                  handleLoading={() => assign(1)}
                  loading={assigning}
                  class='default regular join'
                  hundred={true}
                  unloadable={true}
                />
              )}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
