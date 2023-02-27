import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './manageu.module.scss';
import { useRouter } from 'next/router';
import { AuthContext } from '../AdminRoute';
import UserCard from '../UserCard';
import Input from '../Input';
import Modal from '../Modal';
import AMeetingCard from '../AMeetingCard';
import ImageWrapper from '../ImageWrapper';
import searchImg from '../../images/search.svg';

export default function ManageUsers(props) {
  const [assignModal, setAssignModal] = React.useState(false);
  const [activeUser, setActiveUser] = React.useState({});
  const [meetings, setMeetings] = React.useState([]);
  function closeAssignModal() {
    setActiveUser({});
    setAssignModal(false);
  }
  async function getZoomLinks(user) {
    try {
      const res = await fetch(API + '/admin/zoom-links', {
        method: 'GET',
        headers: new Headers({
          authorization: 'Bearer ' + userData.auth,
        }),
      });
      const result = await res.json();
      if (result.message === 'Success') {
        const links = result.links.reduce(
          (p, c) => (
            user.links.find((l) => l.link_id == c.link_id) && p.push(c), p
          ),
          []
        );
        links.push(
          ...result.links.reduce(
            (p, c) => (
              !user.links.find((l) => l.link_id == c.link_id) && p.push(c), p
            ),
            []
          )
        );
        setMeetings(links);
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
  async function getAssignedLinks(user) {
    try {
      const res = await fetch(API + '/admin/users/assigned/' + user.user_id, {
        method: 'GET',
        headers: new Headers({
          authorization: 'Bearer ' + userData.auth,
        }),
      });
      const result = await res.json();
      if (result.message === 'Success') {
        user['links'] = result.links;
        setActiveUser(user);
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
  async function openAssignModal(userid) {
    setAssignModal(true);
    const user = pageData.users.find((user) => user.user_id == userid);
    await getAssignedLinks(user);
    await getZoomLinks(user);
  }
  async function updateModalData() {
    await getAssignedLinks(activeUser);
    await getZoomLinks(activeUser);
  }
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const userData = React.useContext(AuthContext);
  const [pageData, setPageData] = React.useState({});
  async function getData() {
    try {
      const res = await fetch(API + '/admin/users', {
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
      <div className={styles.heading}>
        <h1>Manage Users</h1>
        <div className={styles.searchInput}>
          <Input
            type='text'
            name='search'
            domName='Search'
            placeholder='search...'
            value={search}
            handleChange={(e) => setSearch(e.target.value)}
            error=''
          />
        </div>
      </div>
      <div className={styles.dashboardBoxes}>
        <AnimatePresence>
          {pageData.users
            ?.filter(
              (user) =>
                (user.fname + ' ' + user.lname + ' ' + user.email)
                  .toLowerCase()
                  .search(search) != -1
            )
            .map((user) => {
              return (
                <UserCard
                  user={user}
                  key={user.email}
                  getData={getData}
                  manage={true}
                  assign={() => openAssignModal(user.user_id)}
                />
              );
            })}
          {pageData.users?.filter(
            (user) =>
              (user.fname + ' ' + user.lname + ' ' + user.email)
                .toLowerCase()
                .search(search) != -1
          ).length == 0 && (
            <>
              <motion.div className={styles.smallImage} layout>
                <ImageWrapper
                  src={searchImg}
                  alt='Search'
                  className={styles.interviewImage}
                  objectFit='contain'
                />
              </motion.div>
              <motion.h2 layout>No matching users</motion.h2>
            </>
          )}
        </AnimatePresence>
      </div>
      <Modal open={assignModal} closeModal={closeAssignModal} fullHeight={true}>
        <h3>
          Meetings assigned to
          <br />
          {activeUser.email}
        </h3>
        {meetings.map((meeting) => {
          return (
            <AMeetingCard
              meeting={meeting}
              assigned={activeUser.links}
              user={activeUser}
              getData={updateModalData}
              key={meeting.link_id}
            />
          );
        })}
      </Modal>
    </div>
  );
}
