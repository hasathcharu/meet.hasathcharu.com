import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import getServerSideProps from '../../server/adminProps';
import AdminRoute from '../../components/AdminRoute';
export { getServerSideProps };
import ManageMeetings from '../../components/ManageMeetings';

export default function ManageMeetingsPage(props) {
  return (
    <AdminRoute auth={props.auth} user={props.user}>
      <div className='App'>
        <Head>
          <title>Manage Meetings</title>
        </Head>
        <section>
          <ManageMeetings />
        </section>
      </div>
    </AdminRoute>
  );
}
