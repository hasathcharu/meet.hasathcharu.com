import * as cookie from 'cookie';
export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie || '');
  await context.res.setHeader(
    'Set-Cookie',
    cookie.serialize('auth', String(''), {
      httpOnly: true,
      maxAge: -1,
      path: '/',
    })
  );
  return {
    props: {},
    redirect: {
      permanent: false,
      destination: '/',
    },
  };
}
export default function LogOutPage() {
  return null;
}
