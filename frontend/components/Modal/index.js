import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-brands-svg-icons';
import Portal from '../Portal';
import Button from '../Button';
import styles from "./modal.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Modal({ children, open, closeModal }){
    
    const backdropVariants = {
        hidden:{
            opacity:0,
        },
        visible:{
            opacity:1,
        }
    }
    const modalVariants = {
        hidden:{
            y:200,
            opacity:0,
            transition:{
                type:'spring'
            }
        },
        visible:{
            y:0,
            opacity:1,
            transition:{
                type:'spring'
            }
        }
    }
    return (
        <>
            <AnimatePresence>
            {open && (
                <Portal selector="#modal">
                    <motion.div 
                        className={styles.backdrop} 
                        onClick={closeModal}
                        variants={backdropVariants}
                        initial='hidden'
                        animate='visible'
                        exit='hidden'

                    >
                        <motion.div className={styles.modal}  onClick={(e)=>e.stopPropagation()}
                            variants={modalVariants}
                            initial='hidden'
                            animate='visible'
                            exit='hidden'
                        >
                            <div className={styles.close}><div onClick={closeModal}><FontAwesomeIcon icon={faXmark}/></div></div>
                            {children}
                        </motion.div>
                    </motion.div>
                </Portal>
            )}
        </AnimatePresence>
        </>
  );
}