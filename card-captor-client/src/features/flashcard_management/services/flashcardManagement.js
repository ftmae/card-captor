export async function fetchFlashcards(deckId){
    const response = await fetch(`${import.meta.env.VITE_API_URL}/flashcards/${deckId}`, {
        credentials: 'include'
    });
    if(!response.ok){
        const err = await response.json();
        throw new Error(err.error || `Failed to Fetch Flashcards for Deck - ${deckId}`);
    }
    const data = await response.json();
    return data.flashcards;
}