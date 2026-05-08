export async function fetchData(endpoint, method, body, errorMessage){
    const headers = (method === "POST" || method === "PUT") ? { "Content-Type": "application/json" } : {}
    const response = await fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
        method, 
        credentials: 'include',
        headers: headers, 
        body: body && JSON.stringify(body),
    });

    if(!response.ok) {
        const err = await response.json();
        throw new Error(err.error || errorMessage);
    }
    const data = await response.json();
    return data; 
}