import React from 'react';
import {
  faUser,
  faUserPlus,
  faChalkboardUser,
} from '@fortawesome/free-solid-svg-icons';
import styles from './admindashboard.module.scss';
import { useRouter } from 'next/router';
import { AuthContext } from '../AdminRoute';
import AdminConsoleBox from '../AdminConsoleBox';

export default function AdminDashboard(props) {
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();
  const userData = React.useContext(AuthContext);
  const [pageData, setPageData] = React.useState({});
  async function getData() {
    try {
      const res = await fetch(API + '/admin/summary', {
        method: 'GET',
        headers: new Headers({
          authorization: 'Bearer ' + userData.auth,
        }),
      });
      const result = await res.json();
      if (result.message === 'Success') {
        setPageData(result);
        return;
      }
      throw new Error(result.message);
    } catch (error) {
      if (error.message.startsWith('AuthError')) {
        router.push('/log-in');
      }
      console.log(error);
    }
  }
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <div className={styles.dashboard}>
      <h1>Administration</h1>
      <div className={styles.dashboardBoxes}>
        {pageData.numOfUnapprovedUsers ? (
          <AdminConsoleBox
            icon={faUserPlus}
            text='New Users'
            number={pageData.numOfUnapprovedUsers}
            onClick={() => router.push('/admin/approve')}
          />
        ) : null}
        <AdminConsoleBox
          icon={faUser}
          text='Users'
          number={pageData.numOfApprovedUsers}
          onClick={() => router.push('/admin/users')}
        />
        <AdminConsoleBox
          icon={faChalkboardUser}
          text='Meetings'
          number={pageData.numOfLinks}
          onClick={() => router.push('/admin/meetings')}
        />
      </div>
    </div>
  );
}
