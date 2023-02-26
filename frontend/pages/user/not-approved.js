import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import UserRoute from '../../components/PublicRoute';
import getServerSideProps from '../../server/unappProps';
import UnapprovedUser from '../../components/UnapprovedUser';

export { getServerSideProps };

export default function UnapprovedUserPage(props) {
  const title = 'Hello ' + props.user?.fname + ' 👋';
  return (
    <UserRoute auth={props.auth} user={props.user}>
      <div className='App'>
        <Head>
          <title>{title}</title>
        </Head>
        <section>
          <UnapprovedUser fname={props.user?.fname} />
        </section>
      </div>
    </UserRoute>
  );
}
