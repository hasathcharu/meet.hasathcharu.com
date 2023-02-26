import React from 'react';
import {
  faRightToBracket,
  faUserMinus,
} from '@fortawesome/free-solid-svg-icons';
import styles from './deleteaccount.module.scss';
import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import { useRouter } from 'next/router';
import Lottie from 'react-lottie';
import success from '../../lotties/sad.json';
import { isEmpty, isLength, matches } from 'validator';
export default function DeleteAccount(props) {
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
    password: '',
  });
  const [formState, setFormState] = React.useState({
    sending: false,
    passwordError: '',
    formError: '',
    deleteError: false,
    delete: false,
  });
  async function handleSending() {
    setFormState((currentState) => ({
      ...currentState,
      sending: true,
      passwordError: '',
      formError: '',
      deleteError: false,
    }));
    let invalid = 0;
    if (isEmpty(formData.password.trim())) {
      setFormState((currentState) => ({
        ...currentState,
        passwordError: 'Password cannot be empty',
      }));
      invalid = 1;
    }
    if (invalid) {
      setFormState((currentState) => ({ ...currentState, sending: false }));
      return;
    }
    try {
      const data = {
        password: formData.password.trim(),
      };
      const res = await fetch(API + '/user/delete', {
        method: 'DELETE',
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
          password: '',
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
          password: '',
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
        <h1>It's sad to see you go</h1>
        <h2>Delete your account</h2>
        <p>Please enter your password to confirm your action 🥲</p>
        <Input
          type='password'
          name='password'
          domName='Password'
          placeholder='enter your password'
          value={formData.password}
          handleChange={handleChange}
          error={formState.passwordError}
        />
        <br />
        <Button
          icon={faUserMinus}
          class='default danger'
          text='Delete Account'
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
          <h1>Account Deleted 😢</h1>
          <h2>さようなら。。。</h2>
          <Button
            text='Home'
            icon={faRightToBracket}
            handleLoading={() => router.push('/')}
            loading={false}
            unloadable={true}
            class='default'
          />
          <br />
          <br />
        </div>
      </Modal>
    </div>
  );
}
