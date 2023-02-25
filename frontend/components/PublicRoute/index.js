import React from 'react';

export const AuthContext = React.createContext({});

export default function PublicRoute(props) {
  return (
    <AuthContext.Provider value={{ auth: props.auth, user: props.user }}>
      {props.children}
    </AuthContext.Provider>
  );
}
