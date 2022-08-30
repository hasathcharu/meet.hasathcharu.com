import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {motion} from 'framer-motion';
import styles from "./button.module.scss";
export default function Button(props){
    const button = React.useRef(null);
    const [width, setWidth] = React.useState('auto');
    const toggle  = async (e)=>{
        if(!props.loading){
            setWidth(button.current.offsetWidth-32+'px');
        }
        await props.handleLoading(1);
        setWidth('auto');
    }
    return(
        <motion.button 
            className={`${props.class.split(" ").map( (item)=>{ return `${styles[item]}` }).join(" ")}`} 
            onClick={toggle} 
            style={{width:width}} 
            ref={button} 
            disabled={props.loading}
            whileTap= {{translateY: 5}}
        >
            {
                props.loading===false && 
                <div className={styles.btnContainer}>
                    <div className={`${styles.btnContent} ${styles.btnIcon}`}><FontAwesomeIcon icon={props.icon}/></div>
                    <div className={`${styles.btnContent} ${styles.btnText}`}>{props.text}</div>
                </div>
            }
            {
                props.loading===true && 
                <div className={styles.loaderBtnContainer}>
                    <span className={styles.loaderBtn}></span>
                </div>
            }
        </motion.button>
    );
}