import { fetchData } from "../../../shared/fetchData.js";

const base = 'auth';

export async function loginRequest(payload){
    const data = await fetchData(`${base}/login`, "POST", payload, "Authentication Failed");
    return data.message;
}

export async function registerRequest(payload){
    const data = await fetchData(`${base}/register`, "POST", payload, "Authentication Failed");
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

export async function updateUser(args){
    const data = await fetchData(`${base}/user`, "PUT", args, "Update Failed");
    return data;
}

export async function forgotPassword(email){
    const data = await fetchData(`${base}/forgotPassword`, "POST", {email}, "Failed to Send Link");
    return data;
}

export async function resetPassword(password, token, email){
    const data = await fetchData(`${base}/resetPassword`, "POST", {password, token, email}, "Failed to Reset Password");
    return data;
}