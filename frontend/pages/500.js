import Error from '../components/Error';
import Head from 'next/head';

export default function Custom500() {
  return (
    <>
      <Head>
      <meta property='og:title' content="Server Error" />

        <title>Server Error</title>
      </Head>
      <Error error='500 Error' message='Server Error :(' />
    </>
  );
}
