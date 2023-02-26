import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import SignUp from '../../components/SignUp';
import publicProps from '../../server/publicProps';

export async function getServerSideProps(context) {
  const auth = await publicProps(context);
  if (auth.props?.auth && auth.props?.user)
    return {
      redirect: {
        permanent: false,
        destination: '/user',
      },
    };
  return { props: {} };
}

export default function SignUpPage(props) {
  return (
    <div className='App'>
      <Head>
        <title>Sign Up</title>
      </Head>
      <section>
        <SignUp />
      </section>
    </div>
  );
}
