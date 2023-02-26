import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  faCirclePlus,
  faCircleMinus,
  faLink,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';
import styles from './umeetingcard.module.scss';
import Button from '../Button';
import { useRouter } from 'next/router';
import { AuthContext } from '../AdminRoute';
import Modal from '../Modal';
import Input from '../Input';

export default function AMeetingCard(props) {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API;
  const [editUrlModal, setEditUrlModal] = React.useState(false);
  const [assigning, setAssigning] = React.useState(false);
  const [unassigning, setUnassigning] = React.useState(false);
  const [updatingUrl, setUpdatingUrl] = React.useState(false);
  const [urlError, setUrlError] = React.useState('');
  const [url, setUrl] = React.useState('');
  const userData = React.useContext(AuthContext);
  async function updateUrl() {
    setUrlError('');
    setUpdatingUrl(true);
    try {
      if (!url.trim()) {
        setUrlError('URL cannot be empty');
        throw new Error('Empty Url');
      }
      const data = {
        link_id: props.meeting.link_id,
        url: url.trim(),
      };
      const res = await fetch(API + '/admin/zoom-links/save-url', {
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
        setUpdatingUrl(false);
        setEditUrlModal(false);
        setUrl('');
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      setUpdatingUrl(false);
      let err = 'Something went wrong :(';
      console.log(error.message);
      if (error.message.startsWith('AuthError')) {
        router.push('/log-in');
        return;
      }
    }
  }
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
      let url = '/admin/zoom-links/assign';
      if (!assign) {
        url = '/admin/zoom-links/unassign';
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
              <h2 className={styles.meetingId}>{props.meeting?.link_id}</h2>
            </div>
            <div className={styles.joinArea}>
              <div className={styles.meetJoin}>
                {!props.manage &&
                  (props.assigned?.find(
                    (link) => link.link_id === props.meeting?.link_id
                  ) ? (
                    <Button
                      text='Unassign'
                      icon={faCircleMinus}
                      handleLoading={() => assign(0)}
                      loading={unassigning}
                      hundred={true}
                      class='default regular join sdanger'
                    />
                  ) : (
                    <Button
                      text='Assign'
                      icon={faCirclePlus}
                      handleLoading={() => assign(1)}
                      loading={assigning}
                      hundred={true}
                      class='default regular join'
                    />
                  ))}
                {props.manage && (
                  <Button
                    text='Assign'
                    icon={faCirclePlus}
                    handleLoading={props.openAssignModal}
                    unloadable={true}
                    loading={false}
                    hundred={true}
                    class='default regular join'
                  />
                )}
              </div>

              {props.manage && (
                <div className={styles.meetJoin}>
                  <Button
                    text='Edit URL'
                    icon={faLink}
                    hundred={true}
                    handleLoading={() => setEditUrlModal(true)}
                    loading={false}
                    unloadable={true}
                    class='default regular join stertiary'
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Modal open={editUrlModal} closeModal={() => setEditUrlModal(false)}>
        <h2>{props.meeting?.topic}</h2>
        <h3>Edit URL</h3>

        <div className={styles.modalInputContainer}>
          <div className={styles.modalInput}>
            <Input
              type='text'
              name='url'
              domName='URL'
              placeholder={props.meeting.url ? props.meeting.url : 'Enter URL'}
              value={url}
              handleChange={(e) => setUrl(e.target.value)}
              error={urlError}
            />
            <br />
            <Button
              text='Update'
              icon={faFloppyDisk}
              handleLoading={updateUrl}
              loading={updatingUrl}
              unloadable={true}
              class='default regular join stertiary'
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
