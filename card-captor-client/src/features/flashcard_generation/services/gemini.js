export default async function generateCards(text, questionTypes, deckId){
    const response = await fetch(`${import.meta.env.VITE_API_URL}/flashcards/generateCards`, {
        credentials: 'include',
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({text, questionTypes, deckId})
    });

    if(!response.ok){
        const err = await response.json();
        throw new Error(err.error || "API request failed");
    };
    const data = await response.json();
    return data;
}