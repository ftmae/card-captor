export async function fetchDecks(){
    const response = await fetch(`${import.meta.env.VITE_API_URL}/decks`, {
        credentials: 'include'
    });
    if(!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to Fetch Decks");
    }
    const data = await response.json();
    return data.decks;
}

export async function createDeck(){
    const response = await fetch(`${import.meta.env.VITE_API_URL}/decks/create`, {
        credentials: 'include'
    });
    if(!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to Fetch Decks");
    }
    const data = await response.json();
    return data; 
}