import * as cookie from 'cookie';
import checkAuth from './checkAuth';

export default async function getServerSideProps(context) {
  const cookies = cookie.parse(context?.req?.headers?.cookie || '');
  if (cookies.auth) {
    const response = await checkAuth(cookies.auth);
    if (response?.message === 'Success') {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/user',
        },
      };
    } else if (response?.message === 'AuthError: Not approved') {
      return {
        props: {
          auth: cookies.auth,
          user: response.user,
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
