import React from 'react';
import { motion } from 'framer-motion';
import {
  faUserPlus,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import ImageWrapper from '../ImageWrapper';
import hero from '../../images/hero.svg';
import Button from '../Button';
import styles from './hero.module.scss';
import { useRouter } from 'next/router';
export default function Hero() {
  const router = useRouter();
  async function buttonPress(name) {
    router.push('/' + name);
  }
  const contentVariants = {
    hidden: {
      x: 0,
      y: 20,
      opacity: 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        type: 'linear',
      },
    },
  };
  const contentH1 = JSON.parse(JSON.stringify(contentVariants));
  const contentH2 = JSON.parse(JSON.stringify(contentVariants));
  const contentP = JSON.parse(JSON.stringify(contentVariants));
  contentH2.visible.transition.delay = 0.8;
  contentP.visible.transition.delay = 1.6;
  return (
    <div className={styles.hero}>
      <div className={styles.heroText}>
        <motion.h1 initial='hidden' variants={contentH1} animate='visible'>
          Meetings
        </motion.h1>
        <motion.h2 initial='hidden' variants={contentH2} animate='visible'>
          Hosted by Hasathcharu
        </motion.h2>
        <motion.div initial='hidden' variants={contentP} animate='visible'>
          <p>This is the portal for Haritha's meetings.</p>
          <p>
            Frequent participants of Haritha's meetings can create an account to
            easily join future meetings without the need for lengthy links.
          </p>
          <Button
            text='Sign Up'
            icon={faUserPlus}
            handleLoading={buttonPress.bind(this, 'sign-up')}
            loading={false}
            class='default'
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            text='Log in'
            icon={faRightToBracket}
            handleLoading={buttonPress.bind(this, 'log-in')}
            loading={false}
            class='default secondary'
          />
        </motion.div>
      </div>
      <div className={styles.heroImage}>
        <ImageWrapper
          src={hero}
          objectFit='contain'
          alt='Meeting Graphic'
          priority={true}
        />
      </div>
    </div>
  );
}
