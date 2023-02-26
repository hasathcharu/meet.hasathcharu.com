import React, { useContext } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { faLock, faClone, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import styles from './manageuser.module.scss';
import { useRouter } from 'next/router';
import { AuthContext } from '../AdminRoute';
import Modal from '../Modal';

export default function AdminDashboard(props) {
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();
  const userData = useContext(AuthContext);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [resetModal, setResetModal] = React.useState(false);
  const [reseting, setReseting] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [accountDeleted, setAccountDeleted] = React.useState(false);
  const [resetPasswordMessage, setResetPasswordMessage] = React.useState('');
  async function deleteUser() {
    setDeleting(true);
    try {
      const data = {
        user_id: props.user?.id,
      };
      const res = await fetch(API + '/admin/users/delete/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + userData.auth,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.message === 'Success') {
        setAccountDeleted(true);
        setDeleting(false);
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
  async function resetPassword() {
    setReseting(true);
    try {
      const data = {
        user_id: props.user?.id,
      };
      const res = await fetch(API + '/admin/users/reset-password/', {
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
        setResetPasswordMessage(response.password);
        setReseting(false);
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
  function closeResetModal() {
    setResetPasswordMessage('');
    setReseting(false);
    setResetModal(false);
  }
  function closeDeleteModal() {
    if (accountDeleted) {
      router.push('/admin/users');
    }
    setAccountDeleted(false);
    setDeleting(false);
    setDeleteModal(false);
  }
  return (
    <div className={styles.dashboard}>
      <h1>Manage User</h1>
      <h2>{props.user?.fname + ' ' + props.user?.lname}</h2>
      <h3>{props.user?.email}</h3>
      <br />
      <br />
      <Button
        icon={faLock}
        class='default secondary'
        text='Reset Password'
        loading={false}
        handleLoading={() => setResetModal(true)}
        unloadable={true}
      />
      <br />
      <br />
      <Button
        icon={faTrash}
        class='default danger'
        text='Delete Account'
        loading={false}
        handleLoading={() => setDeleteModal(true)}
        unloadable={true}
      />
      <Modal open={deleteModal} closeModal={closeDeleteModal}>
        <h1>Deleting Account</h1>
        <h3>{props.user?.email}</h3>
        <h3>Confirm your action</h3>
        <br />
        {!accountDeleted && (
          <>
            <Button
              icon={faTrash}
              class='default danger'
              text='Confirm'
              loading={deleting}
              handleLoading={deleteUser}
            />
            <br />
            <br />
          </>
        )}

        {accountDeleted && (
          <>
            <motion.h4 layout>The account has been deleted</motion.h4>
          </>
        )}
      </Modal>
      <Modal open={resetModal} closeModal={closeResetModal}>
        <motion.h1 layout>Reseting Password</motion.h1>
        <motion.h3 layout>{props.user?.email}</motion.h3>
        <motion.h3 layout>Confirm your action</motion.h3>
        <br />
        {!resetPasswordMessage && (
          <>
            <Button
              icon={faLock}
              class='default danger'
              text='Confirm'
              loading={reseting}
              handleLoading={resetPassword}
            />
            <br />
            <br />
          </>
        )}

        {resetPasswordMessage && (
          <LayoutGroup>
            <motion.h4 layout>The password has been reset to</motion.h4>
            <motion.h3 class={styles.resetPassword} layout>
              {resetPasswordMessage}
            </motion.h3>
            <Button
              icon={faClone}
              class='default tertiary medium'
              text='Copy'
              loading={false}
              handleLoading={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(resetPasswordMessage);
                }
              }}
              unloadable={true}
            />
          </LayoutGroup>
        )}
      </Modal>
    </div>
  );
}
