import React from 'react';
import styles from "./input.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';export default function Input(props){
    return(
        <div className={styles.inputBox}>
            <span>{props.domName}</span>
            {
                props.type!=='textarea' && 
                <input
                    type={props.type}
                    value={props.value}
                    name={props.name}
                    placeholder={props.placeholder}
                    onChange={props.handleChange}
                    className={styles.input}
                />
            }
            {
                props.type==='textarea' &&
                <textarea
                    rows='5'
                    cols='45'
                    value={props.value}
                    name={props.name}
                    placeholder={props.placeholder}
                    onChange={props.handleChange}
                    className={styles.textarea}
                />
            }
            <span className={styles.errorMessage}>
            {(props.error!=='') && <FontAwesomeIcon icon={faCircleArrowUp}/>} {props.error}
            </span>
        </div>
    );
}