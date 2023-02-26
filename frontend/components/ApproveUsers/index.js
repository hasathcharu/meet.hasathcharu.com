import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './approve.module.scss';
import { useRouter } from 'next/router';
import { AuthContext } from '../AdminRoute';
import UserCard from '../UserCard';

export default function ApproveUsers(props) {
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();
  const userData = React.useContext(AuthContext);
  const [pageData, setPageData] = React.useState({});
  async function getData() {
    try {
      const res = await fetch(API + '/admin/get-unapproved', {
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
      console.log(error);
      if (error.message.startsWith('AuthError')) {
        router.push('/log-in');
      }
    }
  }
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <div className={styles.dashboard}>
      <h1>Approve Users</h1>
      <motion.div className={styles.dashboardBoxes} layoutScroll>
        <AnimatePresence>
          {pageData.users?.map((user) => {
            return <UserCard user={user} key={user.email} getData={getData} />;
          })}
          {!pageData.users?.length && (
            <motion.h1 layout>No new users</motion.h1>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
