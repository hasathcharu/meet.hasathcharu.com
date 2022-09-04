import React from 'react';
import ImageWrapper from '../ImageWrapper';
import styles from './error.module.scss';
import logo from '../../images/logo.svg';

export default function Error(props){
    return (
        <div className={styles.error}>
            <a href='./'>
                <ImageWrapper
                    src={logo}
                    alt="Hasathcharu Logo"
                    width='50vmin'
                    className={styles.image}
                />
            </a>
            <h1>{props.error}</h1>
            <h3>{props.message}</h3>

        </div>
    );
}