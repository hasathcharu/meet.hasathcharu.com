export default async function (token){
    const API = process.env.NEXT_PUBLIC_API;
    const user = await fetch(API+'/user', 
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
    });
    const response = await user.json();
    return response;
}