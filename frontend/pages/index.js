import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Hero from '../components/Hero';
export { default as getServerSideProps } from '../server/publicProps';

export default function Home(props) {
  return (
    <div className='App'>
      <Head>
      <meta property='og:title' content="Haritha's Meetings" />
        <title>Haritha's Meetings</title>
      </Head>
      <section className='hero-section'>
        <Hero />
      </section>
    </div>
  );
}
