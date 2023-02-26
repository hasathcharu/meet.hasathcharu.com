import React from 'react';
import Header from '../components/Header';
import { useCookies } from 'react-cookie';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
import Head from 'next/head';
import '../styles/global.scss';

function MyApp({ Component, pageProps }) {
  const [cookies, setCookie] = useCookies();
  if (!cookies.theme) {
    setCookie('theme', 'dark', { maxAge: 864000, path: '/' });
  }
  function handleTheme() {
    setCookie('theme', cookies.theme === 'light' ? 'dark' : 'light', {
      maxAge: 864000,
      path: '/',
    });
  }
  React.useEffect(() => {
    if (!cookies.theme) {
      document.documentElement.className = 'dark';
    } else {
      document.documentElement.className = cookies.theme;
    }
  }, [cookies.theme]);
  return (
    <>
      <Head>
        <meta name='theme-color' content='#22cc9d' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        ></meta>
        <meta property='og:title' content="Haritha's Meetings" />
        <meta property='og:description' content="Haritha's Meetings Portal" />
        <meta
          property='og:image'
          content='https://meet.hasathcharu.com/embed.png'
        />
        <meta property='og:url' content='https://meet.hasathcharu.com' />
        <meta property='og:type' content='website' />
        <meta name='description' content="Haritha's Meetings Portal" />
      </Head>
      <Header
        handleTheme={handleTheme}
        theme={cookies.theme}
        user={pageProps.user}
      />
      <Component {...pageProps} />
      <section className='footer'>&copy; Haritha Hasathcharu</section>
    </>
  );
}

export default MyApp;
