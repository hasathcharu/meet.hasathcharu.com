import * as cookie from 'cookie';
import checkAuth from './checkAuth';

export default async function getServerSideProps(context) {
    const cookies = cookie.parse(context.req.headers.cookie  || '');
    if(cookies.auth){
        const response = await checkAuth(cookies.auth);
        if(response?.message==='Success'){
            return {
                props:{
                    auth:cookies.auth,
                    user:response.user,
                    }
                }
        }
        else if(response?.message==='Not approved'){
            return {
                props:{}, 
                redirect:{
                    permanent: false,
                    destination: '/user/not-approved'
                }
            }//if the user is not approved, then we will put a logout button in not-approved route
        }
    }
    return {
        props:{}, 
        redirect:{
            permanent: false,
            destination: '/log-in'
        }
    }
}