import React from 'react';
import {motion} from 'framer-motion';
import styles from "./loader.module.scss";
export default function Loader(){
        return(
                <motion.div 
                    className={styles.loaderContainer}
                >
                        <motion.span className={styles.loader}></motion.span>
                </motion.div>
        );
}