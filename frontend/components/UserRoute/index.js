import React from 'react';

export const AuthContext = React.createContext({});

export default function UserRoute(props){
    return(
        <AuthContext.Provider value={{auth: props.auth,user: props.user}}>
            {props.auth? props.children: <section className='placeHolder'></section>}
        </AuthContext.Provider>
    );        
}