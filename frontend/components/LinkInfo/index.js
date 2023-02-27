import React from 'react';
import { motion } from 'framer-motion';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './linkinfo.module.scss';
import Greeting from '../Greeting';
import { useRouter } from 'next/router';
import Button from '../Button';
import { AuthContext } from '../PublicRoute';
import ImageWrapper from '../ImageWrapper';
import sleeping from '../../lotties/sleeping.json';
import interview from '../../images/interview.png';
import Modal from '../Modal';
import Lottie from 'react-lottie';
import LinkInfoBox from '../LinkInfoBox';

export default function LinkInfo(props) {
  const router = useRouter();
  const userData = React.useContext(AuthContext);
  const [date, setDate] = React.useState(new Date());
  function closeModal() {
    router.reload();
  }
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  });
  const endedLottie = {
    loop: true,
    autoplay: true,
    animationData: sleeping,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      className: styles.endedLottie,
    },
  };
  return (
    <div className={styles.dashboard}>
      <div>
        <Greeting fname={userData.user?.fname} date={date}></Greeting>
        <br />
        <motion.div className={styles.smallImage} layout>
          <ImageWrapper
            src={interview}
            alt='Interview Image'
            className={styles.interviewImage}
            objectFit='contain'
          />
        </motion.div>
      </div>
      <LinkInfoBox meeting={props.meeting} />
      <Modal open={props.meeting.hasEnded} closeModal={closeModal}>
        <Lottie options={endedLottie} />
        <div className={styles.modalContent}>
          <h2>Oh! The meeting just ended 🥹</h2>
          <h3>おわりました</h3>
          <Button
            icon={faArrowLeft}
            class='default'
            text='Go Back'
            loading={false}
            handleLoading={() => router.reload()}
            unloadable={true}
          />
          <br />
          <br />
        </div>
      </Modal>
    </div>
  );
}
