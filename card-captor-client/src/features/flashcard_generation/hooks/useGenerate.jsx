import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import generateCards from "../services/gemini";
import queryClient from '../../../shared/queryClient.js';
import { toast } from "react-toastify";

export function useGenerate(deckId, deckName){
    const navigate = useNavigate();

    return useMutation({
        mutationFn: generateCards,
        onSuccess: ()=>{
            toast.success('Flashcards Generated Successfully');
            navigate({pathname: '/flashcards', search: `?deckId=${deckId}&deckName=${deckName}`});
            queryClient.invalidateQueries({queryKey: ['flashcards', deckId]});
        },
        onError: (error)=> toast.error(error.message)
    })
}