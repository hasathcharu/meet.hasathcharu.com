import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import UserRoute from '../../components/UserRoute';
import getServerSideProps from '../../server/firstProps';
import FirstTimeUser from '../../components/FirstTimeUser';

export { getServerSideProps };

export default function FirstTimeUserPage(props) {
  const title = 'Hello ' + props.user?.fname + ' 👋';
  return (
    <UserRoute auth={props.auth} user={props.user}>
      <div className='App'>
        <Head>
          <meta property='og:title' content="Haritha's Meetings" />

          <title>{title}</title>
        </Head>
        <section>
          <FirstTimeUser fname={props.user?.fname} />
        </section>
      </div>
    </UserRoute>
  );
}
