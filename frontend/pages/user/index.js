import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import UserRoute from '../../components/UserRoute';
import getServerSideProps from "../../server/userProps";

export { getServerSideProps };

export default function UserPage(props) {
    const title = 'Hello '+props.user.fname+' 👋';
    return (
        <UserRoute auth={props.auth}>
            <div className="App">
                <Head>
                    <title>{title}</title>
                </Head>
                <section>
                    Hello
                </section>
            </div>
        </UserRoute>
    );
}