import { fetchData } from "../../../shared/fetchData";

const base = 'spaced_repetition'

export async function fetchRecallTypes(){
    const data = await fetchData(`${base}/recall_types`, "GET", null, "Failed to Fetch Answer Types");
    return data.ratings;
}

export async function fetchFlashcards(deckIds){
    const params = new URLSearchParams();
    deckIds.forEach(deckId => params.append("deckId", deckId));
    const data = await fetchData(`${base}?${params.toString()}`, "GET", null, "Failed to Fetch Flashcards for Decks" );
    return data.flashcards;
}

export async function updateRecallType(rating, id){
    const data = await fetchData(`${base}/recall_type`, "PUT", {rating, id}, "Failed to Update Flashcard");
    return data;
}