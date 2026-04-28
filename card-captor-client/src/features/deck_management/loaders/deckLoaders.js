import { fetchDecks } from '../services/deckManagement.js';

export async function deckLoader(){
  const decks = await fetchDecks();
  return decks;
}