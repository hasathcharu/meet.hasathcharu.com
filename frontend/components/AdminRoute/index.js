import React from 'react';
import {useRouter} from 'next/router';

const AuthContext = React.createContext({});

export default function UserRoute(props){
    const router = useRouter();
    if(props.auth && props.admin)
        return(
            <AuthContext.Provider value={props.user}>
                {props.children}
            </AuthContext.Provider>
        );
    if(props.auth)
        router.push('/user');
    else
        router.push('/log-in');
    return null;
}