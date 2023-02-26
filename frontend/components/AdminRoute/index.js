import React from 'react';

export const AuthContext = React.createContext({});

export default function AdminRoute(props) {
  return (
    <AuthContext.Provider value={{ auth: props.auth, user: props.user }}>
      {props.auth && props.user?.isAdmin ? (
        props.children
      ) : (
        <section className='placeHolder'></section>
      )}
    </AuthContext.Provider>
  );
}
