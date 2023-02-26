import * as cookie from 'cookie';
import checkAuth from './checkAuth';

export default async function getServerSideProps(context) {
  const cookies = cookie.parse(context?.req?.headers?.cookie || '');
  if (cookies.auth) {
    const response = await checkAuth(cookies.auth);
    if (response?.message === 'Success') {
      return {
        props: {
          auth: cookies.auth,
          user: response.user,
        },
      };
    } else if (response?.message === 'AuthError: Not approved') {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/user/not-approved',
        },
      };
    } else if (response?.message === 'AuthError: First Time') {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/user/first-time',
        },
      };
    }
  }
  return {
    props: {},
    redirect: {
      permanent: false,
      destination: '/log-in',
    },
  };
}
