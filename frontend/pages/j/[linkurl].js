import React from 'react';
import Head from 'next/head';
import '@fortawesome/fontawesome-svg-core/styles.css';
import PublicRoute from '../../components/PublicRoute';
import publicProps from '../../server/publicProps';
import LinkInfo from '../../components/LinkInfo';
import ServerError from '../../components/ServerError';
const API = process.env.NEXT_PUBLIC_API;

async function updateMeeting(url, current, hasEnded) {
  try {
    const res = await fetch(API + '/zoom-sync/link-data/' + url, {
      method: 'GET',
    });
    const result = await res.json();
    if (result.message === 'Success') {
      const meeting = result.link;
      meeting['hasEnded'] = hasEnded;
      if (!meeting.status && current) {
        meeting['hasEnded'] = true;
      }
      if (meeting.status) {
        meeting['hasEnded'] = false;
      }
      return meeting;
    }
    throw new Error();
  } catch (error) {
    console.log(error);
    return 'Error';
  }
}

export async function getServerSideProps(context) {
  const props = await publicProps(context);
  const meeting = await updateMeeting(context.params?.linkurl);
  props.props.meeting = null;
  if (meeting) {
    meeting['hasEnded'] = false;
    props.props.meeting = meeting;
  } else {
    return {
      notFound: true,
    };
  }
  return props;
}

export default function ZoomLinkPage(props) {
  const [serverError, setServerError] = React.useState(0);
  const [meeting, setMeeting] = React.useState(props.meeting);
  const title = meeting?.topic;
  React.useEffect(() => {
    const interval = setInterval(() => {
      updateMeeting(meeting?.url, meeting?.status, meeting?.hasEnded).then(
        (info) => {
          if (info == 'Error') {
            setServerError(1);
            return;
          } else {
            setMeeting(info);
          }
        }
      );
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [meeting]);
  return (
    <PublicRoute auth={props.auth} user={props.user}>
      <div className='App'>
        <Head>
          <title>{title}</title>
        </Head>
        <section>
          <LinkInfo meeting={meeting} />
        </section>
        <ServerError
          open={serverError}
          closeModal={() => {
            setServerError(0);
          }}
        />
      </div>
    </PublicRoute>
  );
}
