import React from 'react';
import { faLock, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import styles from './changepassword.module.scss';
import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import { useRouter } from 'next/router';
import Lottie from 'react-lottie';
import success from '../../lotties/success.json';
import { isEmpty, isLength, matches } from 'validator';
export default function ChangePassword(props) {
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();
  function closeModal() {
    router.push('/log-in');
  }
  const successLottie = {
    loop: false,
    autoplay: true,
    animationData: success,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      className: styles.successLottie,
    },
  };
  const [formData, setFormData] = React.useState({
    currpass: '',
    password: '',
    cpassword: '',
  });
  const [formState, setFormState] = React.useState({
    sending: false,
    currpassError: '',
    passwordError: '',
    cpasswordError: '',
    formError: '',
    resetError: false,
    reset: false,
  });
  async function handleSending() {
    setFormState((currentState) => ({
      ...currentState,
      sending: true,
      currpassError: '',
      passwordError: '',
      cpasswordError: '',
      formError: '',
      resetError: false,
    }));
    let invalid = 0;
    if (isEmpty(formData.currpass.trim())) {
      setFormState((currentState) => ({
        ...currentState,
        currpassError: 'Current password cannot be empty',
      }));
      invalid = 1;
    }
    if (!matches(formData.password.trim(), /\d/)) {
      setFormState((currentState) => ({
        ...currentState,
        passwordError: 'Should contain at least one number',
      }));
      invalid = 1;
    }
    if (!isLength(formData.password.trim(), { min: 8 })) {
      setFormState((currentState) => ({
        ...currentState,
        passwordError: 'Should be more than 8 characters',
      }));
      invalid = 1;
    }
    if (isEmpty(formData.password.trim())) {
      setFormState((currentState) => ({
        ...currentState,
        passwordError: 'Password cannot be empty',
      }));
      invalid = 1;
    }
    if (formData.password.trim() !== formData.cpassword.trim()) {
      setFormState((currentState) => ({
        ...currentState,
        cpasswordError: 'Passwords do not match',
      }));
      invalid = 1;
    }
    if (isEmpty(formData.cpassword.trim())) {
      setFormState((currentState) => ({
        ...currentState,
        cpasswordError: 'Please confirm your password',
      }));
      invalid = 1;
    }
    if (invalid) {
      setFormState((currentState) => ({ ...currentState, sending: false }));
      return;
    }
    try {
      const data = {
        opassword: formData.currpass.trim(),
        password: formData.password.trim(),
      };
      const res = await fetch(API + '/user/change-password', {
        method: 'PUT',
        headers: new Headers({
          authorization: 'Bearer ' + props.auth,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.message === 'Success') {
        setFormState((currentState) => ({
          ...currentState,
          sending: false,
          formError: '',
          resetError: false,
          reset: true,
        }));
        setFormData(() => ({
          currpass: '',
          password: '',
          cpassword: '',
        }));
        await fetch('/log-out');
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      console.log(error.message);
      let err = 'Something went wrong :(';
      if (error.message === 'Failed Auth') {
        err = 'Your current password is wrong';
        setFormData(() => ({
          currpass: '',
          password: '',
          cpassword: '',
        }));
      }
      if (error.message.startsWith('AuthError')) {
        router.push('/log-in');
      }
      setFormState((currentState) => ({
        ...currentState,
        sending: false,
        formError: err,
        resetError: true,
        reset: false,
      }));
    }
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }
  return (
    <div className={styles.signUp}>
      <div className={styles.signUpArea}>
        <h1>Change Password</h1>
        <Input
          type='password'
          name='currpass'
          domName='Current Password'
          placeholder='enter your current password'
          value={formData.currpass}
          handleChange={handleChange}
          error={formState.currpassError}
        />
        <Input
          type='password'
          name='password'
          domName='Password'
          placeholder='enter a new password'
          value={formData.password}
          handleChange={handleChange}
          error={formState.passwordError}
        />
        <Input
          type='password'
          name='cpassword'
          domName='Confirm Password'
          placeholder='confirm password'
          value={formData.cpassword}
          handleChange={handleChange}
          error={formState.cpasswordError}
        />
        <br />
        <Button
          icon={faLock}
          class='default warning'
          text='Change Password'
          loading={formState.sending}
          handleLoading={handleSending}
        />
        {formState.resetError === true && (
          <p className={styles.formError}>{formState.formError}</p>
        )}
      </div>
      <Modal open={formState.reset} closeModal={closeModal}>
        <Lottie options={successLottie} />
        <div className={styles.modalContent}>
          <h1>Password Changed!</h1>
          <Button
            text='Log in'
            icon={faRightToBracket}
            handleLoading={() => router.push('/log-in')}
            loading={false}
            class='default'
          />
          <br />
          <br />
        </div>
      </Modal>
    </div>
  );
}
