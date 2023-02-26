import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import getServerSideProps from '../../server/adminProps';
import AdminRoute from '../../components/AdminRoute';
import ManageUsers from '../../components/ManageUsers';
export { getServerSideProps };

export default function ManageUsersPage(props) {
  return (
    <AdminRoute auth={props.auth} user={props.user}>
      <div className='App'>
        <Head>
          <title>Manage Users</title>
        </Head>
        <section>
          <ManageUsers />
        </section>
      </div>
    </AdminRoute>
  );
}
