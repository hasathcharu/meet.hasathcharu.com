import React from 'react';
import { motion } from 'framer-motion';
import styles from './managem.module.scss';
import { useRouter } from 'next/router';
import { AuthContext } from '../AdminRoute';
import UserCard from '../UserCard';
import Input from '../Input';
import Modal from '../Modal';
import AMeetingCard from '../AMeetingCard';
import ImageWrapper from '../ImageWrapper';
import searchImg from '../../images/search.svg';

export default function ManageMeetings(props) {
  const [assignModal, setAssignModal] = React.useState(false);
  const [activeLink, setActiveLink] = React.useState({});
  const [users, setUsers] = React.useState([]);
  function closeAssignModal() {
    setUserSearch('');
    setActiveLink({});
    setAssignModal(false);
  }
  async function getUsers(link) {
    try {
      const res = await fetch(API + '/admin/users', {
        method: 'GET',
        headers: new Headers({
          authorization: 'Bearer ' + userData.auth,
        }),
      });
      const result = await res.json();
      if (result.message === 'Success') {
        const users = result.users.reduce(
          (p, c) => (
            link.users.find((l) => l.user_id == c.user_id) && p.push(c), p
          ),
          []
        );
        users.push(
          ...result.users.reduce(
            (p, c) => (
              !link.users.find((l) => l.user_id == c.user_id) && p.push(c), p
            ),
            []
          )
        );
        setUsers(users);
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
  async function getAssignedUsers(link) {
    try {
      const res = await fetch(
        API + '/admin/zoom-links/assigned/' + link.link_id,
        {
          method: 'GET',
          headers: new Headers({
            authorization: 'Bearer ' + userData.auth,
          }),
        }
      );
      const result = await res.json();
      if (result.message === 'Success') {
        link['users'] = result.users;
        setActiveLink(link);
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
  async function openAssignModal(linkid) {
    setAssignModal(true);
    const link = pageData.links.find((link) => link.link_id == linkid);
    await getAssignedUsers(link);
    await getUsers(link);
  }
  async function updateModalData() {
    await getAssignedUsers(activeLink);
    await getUsers(activeLink);
  }
  const API = process.env.NEXT_PUBLIC_API;
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [userSearch, setUserSearch] = React.useState('');
  const userData = React.useContext(AuthContext);
  const [pageData, setPageData] = React.useState({});
  async function getData() {
    try {
      const res = await fetch(API + '/admin/zoom-links', {
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
        <h1>Manage Meetings</h1>
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
      <motion.div className={styles.dashboardBoxes} layoutScroll>
        {pageData.links
          ?.filter(
            (link) =>
              (link.topic + link.link_id).toLowerCase().search(search) != -1
          )
          .map((link) => {
            return (
              <AMeetingCard
                meeting={link}
                key={link.link_id}
                getData={getData}
                manage={true}
                openAssignModal={() => openAssignModal(link.link_id)}
              />
            );
          })}
        {pageData.links?.filter(
          (link) =>
            (link.topic + link.link_id).toLowerCase().search(search) != -1
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
            <motion.h2 layout>No matching meetings</motion.h2>
          </>
        )}
      </motion.div>
      <Modal open={assignModal} closeModal={closeAssignModal} fullHeight={true}>
        <h3>
          Users assigned
          <br />
          {activeLink.topic}
        </h3>
        <div className={styles.searchInputModal}>
          <Input
            type='text'
            name='search'
            domName='Search'
            placeholder='search...'
            value={userSearch}
            handleChange={(e) => setUserSearch(e.target.value)}
            error=''
          />
        </div>
        {users
          .filter(
            (user) =>
              (user.fname + ' ' + user.lname + ' ' + user.email)
                .toLowerCase()
                .search(userSearch) != -1
          )
          .map((user) => {
            return (
              <UserCard
                user={user}
                key={user.email}
                meeting={activeLink}
                getData={updateModalData}
                assigned={activeLink.users}
                assignMode={true}
              />
            );
          })}
        {users.filter(
          (user) =>
            (user.fname + ' ' + user.lname + ' ' + user.email)
              .toLowerCase()
              .search(userSearch) != -1
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
      </Modal>
    </div>
  );
}
