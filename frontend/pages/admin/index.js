import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import getServerSideProps from '../../server/adminProps';
import UserDashBoard from '../../components/UserDashBoard';
import AdminRoute from '../../components/AdminRoute';
import AdminDashboard from '../../components/AdminDashboard';

export { getServerSideProps };

export default function AdminPage(props) {
  return (
    <AdminRoute auth={props.auth} user={props.user}>
      <div className='App'>
        <Head>
          <title>Admin Console</title>
        </Head>
        <section>
          <AdminDashboard />
        </section>
      </div>
    </AdminRoute>
  );
}
