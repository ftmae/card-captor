import { refreshAuthToken } from '../modules/user_authentication/services/authenticate.js';
import HttpError from '../shared/error-classes/HttpError.js';

export async function fetchData(endpoint, method, body, errorMessage, retry=true){
    const headers = (method === "POST" || method === "PUT") ? { "Content-Type": "application/json" } : {}
    const response = await fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
        method, 
        credentials: 'include',
        headers: headers, 
        body: body && JSON.stringify(body),
    });
    if(!response.ok) {
        const err = await response.json();
        if(response.status === 401 && retry){
            await refreshAuthToken();
            return fetchData(endpoint, method, body, errorMessage, false);
        }
        throw new HttpError(response.status, err.error || errorMessage);
    }
    const data = await response.json();
    return data; 
}