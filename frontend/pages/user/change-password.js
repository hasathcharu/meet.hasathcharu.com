import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import UserRoute from '../../components/UserRoute';
import getServerSideProps from '../../server/userProps';
import ChangePassword from '../../components/ChangePassword';
export { getServerSideProps };

export default function UserPage(props) {
  const title = 'Change Password';
  return (
    <UserRoute auth={props.auth} user={props.user}>
      <div className='App'>
        <Head>
          <title>{title}</title>
        </Head>
        <section>
          <ChangePassword data={props.user} auth={props.auth} />
        </section>
      </div>
    </UserRoute>
  );
}
