import { fetchDecks } from '../services/deckManagement.js';



// implement try catch here and in catch segregate the errors 
// if server down - show a custom page that says server down. 
// if some other error - what to do?

export async function deckLoader(){
  try{
    const decks = await fetchDecks();
    return {data: decks, error: null};
  }catch(error){
    if(!error.status || error.status >=500) throw new Error("Server Unavailable. Please try again");
    return {data: [], error: "We're having trouble loading your data. Please try again later."}
  }
}