import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {AnimatePresence, motion} from 'framer-motion';
import styles from "./button.module.scss";
export default function Button(props){
    const button = React.useRef(null);
    const [width, setWidth] = React.useState();
    const [hover,setHover] = React.useState(false);
    const toolTipVariants = {
        hidden:{
            y:20,
            x: '-50%',
            opacity:0,
        },
        visible:{
            y:0,
            x: '-50%',
            opacity:1
        }
    }

    const toggle  = async (e)=>{
        if(!props.loading){
            setWidth(button.current.offsetWidth-32+'px');
        }
        if(props.handleLoading)
            await props.handleLoading(1);
        setWidth('auto');
    }
    return(
        <div className={styles.buttonContainer}>
            <motion.button 
                className={`${props.class.split(" ").map( (item)=>{ return `${styles[item]}` }).join(" ")}`} 
                onClick={toggle} 
                style={{width:width}} 
                onHoverStart={()=>setHover(true)}
                onHoverEnd={()=>setHover(false)}
                ref={button} 
                disabled={props.loading}
                whileTap= {{translateY: 5}}
            >
                {
                    props.loading===false && 
                    <div className={styles.btnContainer}>
                        {props.icon && <div className={`${styles.btnContent} ${styles.btnIcon}`}><FontAwesomeIcon icon={props.icon}/></div>}
                        {props.text && <div className={`${styles.btnContent} ${styles.btnText}`}>{props.text}</div>}
                    </div>
                }
                {
                    props.loading===true && 
                    <div className={styles.loaderBtnContainer}>
                        <span className={styles.loaderBtn}></span>
                    </div>
                }
            </motion.button>
            <AnimatePresence>
                {hover && props.text && props.toolTip &&
                <motion.div 
                    initial='hidden'
                    exit='hidden'
                    animate='visible'
                    variants={toolTipVariants}
                    className={styles.toolTip}
                >   
                    <div className={styles.toolTipContent}>{props.text}</div>
                    
                </motion.div>}
            </AnimatePresence>
        </div>
    );
}