import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import adminProps from '../../../server/adminProps';
import AdminRoute from '../../../components/AdminRoute';
import ManageUser from '../../../components/ManageUser';
async function getUser(userid, auth) {
  const API = process.env.NEXT_PUBLIC_API;
  try {
    const res = await fetch(API + '/admin/users/get-user/' + userid, {
      method: 'GET',
      headers: new Headers({
        authorization: 'Bearer ' + auth,
      }),
    });
    const result = await res.json();
    if (result.message === 'Success') {
      return result.user;
    }
    throw new Error(result.message);
  } catch (error) {
    console.log(error);
    if (error.message.startsWith('AuthError')) {
      return 'Auth Error';
    }
    return 'Error';
  }
}
export async function getServerSideProps(context) {
  const props = await adminProps(context);
  const user = await getUser(context.params?.userid, props.props.auth);
  props.props['euser'] = null;
  if (user != 'Error' || user != 'Auth Error') {
    props.props['euser'] = user;
  } else if (user == 'Auth Error') {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: '/log-in',
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
  return props;
}

export default function AdminPage(props) {
  return (
    <AdminRoute auth={props.auth} user={props.user}>
      <div className='App'>
        <Head>
          <title>Manage User</title>
        </Head>
        <section>
          <ManageUser user={props.euser} />
        </section>
      </div>
    </AdminRoute>
  );
}
