import { fetchData } from "../../../shared/fetchData.js";

const base = 'decks'
export async function fetchDecks(){
    const data = await fetchData(base, "GET", null, "Failed to Fetch Decks");
    return data.decks;
}

export async function createDeck(){
    const data = await fetchData(`${base}/create`, "POST", null, "Failed to Create Deck");
    return data;
}

export async function editDeck({id, updatedName}){
    const data = await fetchData(`${base}/${id}`, "PUT", {updatedName}, "Failed to Edit Deck");
    return data; 
}

export async function deleteDeck(deckId) {
    const data = await fetchData(`${base}/${deckId}`, "DELETE", null, "Failed to Delete Deck");
}

export async function duplicateDeck({id, name}){
    console.log(name);
    const data = await fetchData(`${base}/duplicate/${id}`, "POST", {name}, "Failed to Duplicate Deck");
}