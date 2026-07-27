import { fetchData } from "../../../shared/fetchData"

const base = 'flashcards';

export async function fetchFlashcards(deckIds){
    if(typeof deckIds === 'string' || typeof deckIds === 'number') deckIds = [deckIds]; 
    const params = new URLSearchParams();
    deckIds.forEach(deckId => params.append("deckId", deckId));
    const data = await fetchData(`${base}?${params.toString()}`, "GET", null, "Failed to Fetch Flashcards for Deck" );
    return data.flashcards;
}

export async function createFlashcard({deckId, question, answer, type}){
    const data = await fetchData(`${base}/create`, "POST", {deckId, question, answer, type}, "Failed to Create Flashcard");
    return data;
}

export async function deleteFlashcard(flashcardIds){
    const searchParams = new URLSearchParams();
    flashcardIds.forEach((flashcardId)=> searchParams.append('ids', flashcardId));
    const data = await fetchData(`${base}?${searchParams.toString()}`, "DELETE", null, "Failed to Delete Flashcard");
    return data;
}

export async function editFlashcard({flashcardId, question, answer, type, deckId}){
    const data = await fetchData(`${base}/${flashcardId}`, "PUT", {question, answer, type, deckId}, "Failed to Edit Flashcard");
    return data;
}
