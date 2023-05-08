import Error from '../components/Error';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <meta property='og:title' content='Page not found' />

        <title>Page Not Found</title>
      </Head>
      <Error error='404 Not Found' message='The page cannot be found :(' />
    </>
  );
}
