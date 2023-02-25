import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faPassport, faXmark } from '@fortawesome/free-solid-svg-icons';
import {} from '@fortawesome/free-brands-svg-icons';
import Portal from '../Portal';
import styles from './servererror.module.scss';
import Loader from '../Loader';
import Lottie from 'react-lottie';
import server from '../../lotties/server.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function ServerError({ children, open, closeModal }) {
  const API = process.env.NEXT_PUBLIC_API;
  const backdropVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };
  const modalVariants = {
    hidden: {
      y: 200,
      opacity: 0,
      transition: {
        type: 'spring',
      },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
      },
    },
  };
  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(API);
        const result = res.json();
        if (result) closeModal();
      } catch {}
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const serverLottie = {
    loop: true,
    autoplay: true,
    animationData: server,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      className: styles.serverLottie,
    },
  };
  return (
    <>
      <AnimatePresence>
        {open && (
          <Portal selector='#modal'>
            <motion.div
              className={styles.backdrop}
              variants={backdropVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
            >
              <motion.div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                variants={modalVariants}
                initial='hidden'
                animate='visible'
                exit='hidden'
              >
                <Lottie options={serverLottie} speed={1.5} />
                <br />
                Waiting for Hasathcharu Services
              </motion.div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
}
