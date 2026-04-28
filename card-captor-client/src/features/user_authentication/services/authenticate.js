export default async function authRequest(authType, username, password, email){
    let payload = {username, password};
    if(email) payload.email = email;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/${authType}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    });
    if(!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Authentication Failed');
    }
    const data = await response.json();
    return data.message;
}

export async function verifyAuth(){
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
        credentials: 'include',
    });
    if(!response.ok){
        const err = await response.json();
        throw new Error(err.error || 'Authentication Failed');
    }
    const data = await response.json();
    return data;
}

export async function logoutRequest(){
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
    });

    if(!response.ok){
        const err = await response.json();
        throw new Error(err.error || 'Logout Failed');
    }
    
    const message = await response.json();
    return message;
}