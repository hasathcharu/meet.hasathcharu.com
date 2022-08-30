import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import styles from "./menu.module.scss";
import Button from '../Button';
import { useRouter } from 'next/router';

export default function Menu(props){
    const router = useRouter();
    async function buttonPress(name){
        router.push('/'+name);
    }
    const menuVariants = {
        hidden:{
            scale:0,
            display:'grid',
            originX:1,
            originY:0,
            opacity:0,
            transition:{
                duration:.4,
                type:'spring'
            }
        },
        visible:{
            scale:1,
            originX:1,
            opacity:1,
            originY:0,
            display:'grid',
            transition:{
                duration:.4,
                type:'spring'
            }
        }
    }
    const darkVariants = {
        light: {
            rotate:0,
            opacity:1,
            transition:{
                duration:1,
                type:'spring',
                damping:4,
                stiffness: 40,
            }
        },
        dark: {
            rotate:180,
            opacity:1,
            transition:{
                duration:1,
                type:'spring',
                damping:4,
                stiffness: 40,
            }
        }
    }
    return(
        <AnimatePresence>
        {props.show && 
        <div className={styles.menuBack}
            onClick={props.setShow}
        >
                <motion.div 
                    onClick={(e)=>e.stopPropagation()}
                    className={styles.menu}
                    variants={menuVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    
                >
                    <motion.div className={styles.dark}
                        onClick={props.handleTheme}
                        initial='dark'
                        variants={darkVariants}
                        animate = {props.theme}
                    >
                        <FontAwesomeIcon icon={faCircleHalfStroke} />
                    </motion.div>
                    <Button 
                        text="Log in"
                        icon={faRightToBracket}
                        handleLoading={buttonPress.bind(this,'log-in')}
                        loading={false}
                        class='default medium'
                    />
                </motion.div>
        </div>
        }
        </AnimatePresence>
    );
}