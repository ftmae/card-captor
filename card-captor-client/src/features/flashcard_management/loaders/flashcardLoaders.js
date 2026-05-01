import { fetchFlashcards } from '../services/flashcardManagement.js';

// implement try catch here and in catch segregate the errors 
// if server down - show a custom page that says server down. 
// if some other error - what to do?

export async function flashcardLoader({request}){
  try{
      const url = new URL(request.url);
      const deckId = url.searchParams.get('deckId');
      const flashcards = await fetchFlashcards(deckId);
      return {data: flashcards, error: null}
  }catch(error){
    if(error.status >=500) throw new Error('Server Unavailable. Please Try Again Later');
    return {data: [], error: "We're having trouble loading your data. Please try again later."};
  }
}