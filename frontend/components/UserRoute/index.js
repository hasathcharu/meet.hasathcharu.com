import React from 'react';

const AuthContext = React.createContext({});

export default function UserRoute(props){
    return(
        <AuthContext.Provider value={props.auth}>
            {props.auth? props.children: <section className='placeHolder'></section>}
        </AuthContext.Provider>
    );        
}