import React from 'react';
import { motion } from 'framer-motion';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import styles from './login.module.scss';
import Button from '../Button';
import Input from '../Input';
import { useRouter } from 'next/router';
import { isEmail, isEmpty } from 'validator';
export default function LogIn(props) {
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [formState, setFormState] = React.useState({
    sending: false,
    emailError: '',
    passwordError: '',
    formError: '',
    logInError: false,
    loggedIn: false,
  });
  async function handleSending() {
    setFormState((currentState) => ({
      ...currentState,
      sending: true,
      emailError: '',
      passwordError: '',
      formError: '',
      logInError: false,
    }));
    let invalid = 0;
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
        email: formData.email.trim(),
        password: formData.password.trim(),
      };
      const res = await fetch(API + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.message === 'Success') {
        setFormState((currentState) => ({
          ...currentState,
          sending: false,
          formError: '',
          logInError: false,
          loggedIn: true,
        }));
        setFormData(() => ({ email: '', password: '' }));
        router.push('/user');
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      let err = 'Something went wrong :(';
      console.log(error.message);
      if (error.message === 'AuthError: Failed Auth') {
        err = 'Invalid Credentials';
        setFormData(() => ({ email: '', password: '' }));
      }
      setFormState((currentState) => ({
        ...currentState,
        sending: false,
        formError: err,
        logInError: true,
        loggedIn: false,
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
        <h1>Welcome Back</h1>
        <Input
          type='email'
          name='email'
          domName='Email'
          placeholder='enter your email'
          value={formData.email}
          handleChange={handleChange}
          error={formState.emailError}
        />
        <Input
          type='password'
          name='password'
          domName='Password'
          placeholder='enter a password'
          value={formData.password}
          handleChange={handleChange}
          error={formState.passwordError}
        />
        <br />
        <Button
          icon={faRightToBracket}
          class='default'
          text='Log in'
          loading={formState.sending}
          handleLoading={handleSending}
        />
        {formState.logInError === true && (
          <p className={styles.formError}>{formState.formError}</p>
        )}
      </div>
    </div>
  );
}
