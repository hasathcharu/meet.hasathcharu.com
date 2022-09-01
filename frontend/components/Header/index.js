import React from 'react';
import {motion} from 'framer-motion';
import ImageWrapper from '../ImageWrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logo.svg';
import styles from "./header.module.scss";
import Menu from '../Menu';

export default function Header(props){
    const [menu,setMenu] = React.useState(0);
    const variants = {
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
        <>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <ImageWrapper
                        src={logo}
                        alt='Hasathcharu Logo'
                        className={styles.logoImg}
                    />
                </div>
                <motion.div className={styles.menuBtn}
                    onClick={()=>setMenu((prev)=>!prev)}
                >
                    <FontAwesomeIcon icon={faBars} />
                </motion.div>
            </header>
            <Menu 
                show={menu}
                handleTheme={props.handleTheme}
                theme={props.theme}
                setShow = {()=>setMenu((prev)=>!prev)}
                user = {props.user}
            />
        </>
    );
}