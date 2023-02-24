import Error from '../components/Error';
import Head from 'next/head';

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Server Error</title>
      </Head>
      <Error error='500 Error' message='Server Error :(' />
    </>
  );
}
