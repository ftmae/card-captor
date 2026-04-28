import { fetchFlashcards } from '../services/flashcardManagement.js';
export async function flashcardLoader({request}){
  const url = new URL(request.url);
  const deckId = url.searchParams.get('deckId');
  const flashcards = await fetchFlashcards(deckId);
  return flashcards;
}