import { fetchData } from "../../../shared/fetchData.js";

export default async function generateCards({finalText, selectedQuestionTypes, deckId}){
    const data = await fetchData('flashcards/generateCards', "POST", {text: finalText, questionTypes: selectedQuestionTypes, deckId}, "Failed To Generate Flashcards");
    return data;   
}