export default async function (token){
    const API = process.env.NEXT_PUBLIC_API;
    try{
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
    catch{
        throw new Error("Internal Server Error");
    }
}