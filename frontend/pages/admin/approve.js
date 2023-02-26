import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import getServerSideProps from '../../server/adminProps';
import UserDashBoard from '../../components/UserDashBoard';
import AdminRoute from '../../components/AdminRoute';
import ApproveUsers from '../../components/ApproveUsers';

export { getServerSideProps };

export default function AdminPage(props) {
  return (
    <AdminRoute auth={props.auth} user={props.user}>
      <div className='App'>
        <Head>
          <title>Approve Users</title>
        </Head>
        <section>
          <ApproveUsers />
        </section>
      </div>
    </AdminRoute>
  );
}
