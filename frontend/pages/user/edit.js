import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import UserRoute from '../../components/UserRoute';
import getServerSideProps from '../../server/userProps';
import EditProfile from '../../components/EditProfile';

export { getServerSideProps };

export default function UserPage(props) {
  const title = 'Hello ' + props.user.fname + ' 👋';
  return (
    <UserRoute auth={props.auth} user={props.user}>
      <div className='App'>
        <Head>
          <meta property='og:title' content="Haritha's Meetings" />

          <title>{title}</title>
        </Head>
        <section>
          <EditProfile data={props.user} auth={props.auth} />
        </section>
      </div>
    </UserRoute>
  );
}
