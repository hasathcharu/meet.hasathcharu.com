import React from 'react';
import styles from './unapproved.module.scss';
import { AuthContext } from '../UserRoute';
import { useRouter } from 'next/router';
import Button from '../Button';
import { faCakeCandles } from '@fortawesome/free-solid-svg-icons';
import Lottie from 'react-lottie';
import lottie from '../../lotties/first.json';

export default function FirstTimeUser(props) {
  const userData = React.useContext(AuthContext);
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();
  async function removeFirstTime() {
    try {
      const res = await fetch(API + '/user/first-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userData.auth,
        },
      });
      const response = await res.json();
      if (response.message === 'Success') {
        router.push('/user');
        return;
      }
      throw new Error(response.message);
    } catch (error) {
      console.log(error.message);
      if (error.message === 'AuthError: Failed Auth') {
        router.push('/log-in');
      }
    }
  }
  const endedLottie = {
    loop: true,
    autoplay: true,
    animationData: lottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      className: styles.lottie,
    },
  };
  return (
    <div className={styles.dashboard}>
      <h1>Hello {props.fname}</h1>
      <div className={styles.smallImage}>
        <Lottie options={endedLottie} />
      </div>
      <h1>You are approved!</h1>
      <Button
        icon={faCakeCandles}
        class='default'
        text='Get Started'
        loading={false}
        handleLoading={removeFirstTime}
        unloadable={true}
      />
    </div>
  );
}
