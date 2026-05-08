import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({});
export default async function generateCards(text, questionTypes){

    const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
        INSTRUCTIONS: 
        - Given below is text and a list of question / answer types.
        - Form an equal number flashcards for each question / answer type from the text such that all the content is thoroughly covered. 
        - Absolutely avoid creating any duplicate cards. 
        - Only refer to the text provided for the flashcards without adding external information, only stick to the text provided.
        - Return the response in JSON text format like so. Do not include any whitespaces in the JSON format at all.
            {
                "question": "Question",
                "answer": "Answer",
                "type": "Fill in the Blanks"
            }
        - Do not include the ${'``` json ````'} part in your answer.
            
        TEXT: ${text}
        QUESTION/ANSWER TYPES: ${questionTypes}
    `, 
    });
    return response.text;
}