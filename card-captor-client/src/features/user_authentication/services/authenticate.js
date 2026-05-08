import { fetchData } from "../../../shared/fetchData.js";

const base = 'auth';

export default async function authRequest({authState: authType, username, password, email}){
    let payload = {username, password};
    if(email) payload.email = email;
    const data = await fetchData(`${base}/${authType}`, "POST", payload, "Authentication Failed");
    return data.message;
}

export async function verifyAuth(){
    const data = await fetchData(`${base}/user`, "GET", null, "Authentication Failed");
    return data;
}

export async function logoutRequest(){
    const data = await fetchData(`${base}/logout`, "POST", null, "Logout Failed");
    return data;
}