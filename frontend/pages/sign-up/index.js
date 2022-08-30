import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import SignUp from '../../components/SignUp';

export default function SignUpPage(props) {
    return (
        <div className="App">
            <Head>
                <title>Sign Up</title>
            </Head>
            <section>
                <SignUp />
            </section>
        </div>
    );
}