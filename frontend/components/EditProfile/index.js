import React from 'react';
import {
  faFloppyDisk,
  faLock,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import styles from './editprofile.module.scss';
import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import { useRouter } from 'next/router';
import Lottie from 'react-lottie';
import success from '../../lotties/success.json';
import { isEmail, isEmpty, isLength, matches } from 'validator';
export default function EditProfile(props) {
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();
  function closeModal() {
    router.push('/user');
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
    fname: props.data?.fname,
    lname: props.data?.lname,
    email: props.data?.email,
  });
  const [formState, setFormState] = React.useState({
    sending: false,
    fnameError: '',
    lnameError: '',
    emailError: '',
    passwordError: '',
    cpasswordError: '',
    formError: '',
    signUpError: false,
    signedUp: false,
  });
  async function handleSending() {
    setFormState((currentState) => ({
      ...currentState,
      sending: true,
      fnameError: '',
      lnameError: '',
      emailError: '',
      formError: '',
      editError: false,
    }));
    let invalid = 0;
    if (!isLength(formData.fname.trim(), { min: 0, max: 30 })) {
      setFormState((currentState) => ({
        ...currentState,
        fnameError: "Shouldn't be more than 30 characters.",
      }));
      invalid = 1;
    }
    if (isEmpty(formData.fname.trim())) {
      setFormState((currentState) => ({
        ...currentState,
        fnameError: 'First name cannot be empty',
      }));
      invalid = 1;
    }
    if (!isLength(formData.lname.trim(), { min: 0, max: 30 })) {
      setFormState((currentState) => ({
        ...currentState,
        lnameError: "Shouldn't be more than 30 characters.",
      }));
      invalid = 1;
    }
    if (isEmpty(formData.lname.trim())) {
      setFormState((currentState) => ({
        ...currentState,
        lnameError: 'Last name cannot be empty',
      }));
      invalid = 1;
    }
    if (!isEmail(formData.email.trim())) {
      setFormState((currentState) => ({
        ...currentState,
        emailError: 'Invalid email',
      }));
      invalid = 1;
    }
    if (isEmpty(formData.email.trim())) {
      setFormState((currentState) => ({
        ...currentState,
        emailError: 'Email cannot be empty',
      }));
      invalid = 1;
    }
    if (invalid) {
      setFormState((currentState) => ({ ...currentState, sending: false }));
      return;
    }
    try {
      const data = {
        fname: formData.fname.trim(),
        lname: formData.lname.trim(),
        email: formData.email.trim(),
      };
      const res = await fetch(API + '/user/edit', {
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
          editError: false,
          edited: true,
        }));
        setFormData(() => ({
          fname: '',
          lname: '',
          email: '',
        }));
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      console.log(error.message);
      let err = 'Something went wrong :(';
      if (error.message === 'Email Error') {
        err = 'This email already exists.';
        setFormData((currentState) => ({
          ...currentState,
          email: props.data?.email,
        }));
        setFormState((currentState) => ({
          ...currentState,
          sending: false,
          formError: err,
          editError: true,
          edited: false,
        }));
      } else if (error.message.startsWith('AuthError')) {
        router.push('/log-in');
      } else {
        setFormState((currentState) => ({
          ...currentState,
          sending: false,
          formError: err,
          editError: true,
          edited: false,
        }));
      }
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
        <h1>Edit Your Profile</h1>
        <Input
          type='text'
          name='fname'
          domName='First Name'
          placeholder='enter your first name'
          value={formData.fname}
          handleChange={handleChange}
          error={formState.fnameError}
        />
        <Input
          type='text'
          name='lname'
          domName='Last Name'
          placeholder='enter your last name'
          value={formData.lname}
          handleChange={handleChange}
          error={formState.lnameError}
        />
        <Input
          type='email'
          name='email'
          domName='Email'
          placeholder='enter your email'
          value={formData.email}
          handleChange={handleChange}
          error={formState.emailError}
        />
        <br />
        <Button
          icon={faFloppyDisk}
          class='default'
          text='Save'
          loading={formState.sending}
          handleLoading={handleSending}
        />
        {formState.editError === true && (
          <p className={styles.formError}>{formState.formError}</p>
        )}
        <br />
        <br />
        <Button
          icon={faLock}
          class='default secondary'
          text='Change Password'
          loading={false}
          unloadable={true}
          handleLoading={() => router.push('/user/change-password')}
        />
        <br />
        <br />
        <Button
          icon={faTrash}
          class='default danger'
          text='Delete Account'
          unloadable={true}
          loading={false}
          handleLoading={() => router.push('/user/delete-account')}
        />
      </div>
      <Modal open={formState.edited} closeModal={closeModal}>
        <Lottie options={successLottie} />
        <div className={styles.modalContent}>
          <h1>Saved Successfully!</h1>
          <br />
          <br />
        </div>
      </Modal>
    </div>
  );
}
