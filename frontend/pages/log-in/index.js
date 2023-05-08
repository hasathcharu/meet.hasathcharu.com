import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import LogIn from '../../components/LogIn';
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
export default function LogInPage(props) {
  return (
    <div className='App'>
      <Head>
        <meta property='og:title' content='Log In' />
        <title>Log In</title>
      </Head>
      <section>
        <LogIn />
      </section>
    </div>
  );
}
