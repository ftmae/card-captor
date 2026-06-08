import { useMutation, useQuery } from "@tanstack/react-query";
import { createFlashcard, deleteFlashcard, editFlashcard, fetchFlashcards } from "../services/flashcardManagement";
import queryClient from "../../../shared/queryClient";
import { toast } from "react-toastify";

function onSuccess(deckId, operationType){
    queryClient.invalidateQueries(['flashcards', deckId]);
    toast.success(`Flashcard ${operationType} Successfully!`);
}

function onError(message){
    toast.error(message)
}

export function useFlashcards(deckIds){
    return useQuery({
        queryKey: ['flashcards', deckIds],
        queryFn: ()=> fetchFlashcards(deckIds)
    });
}

export function useAddFlashcard(deckId, setCreate){
    return useMutation({
        mutationFn: createFlashcard,
        onSuccess: ()=> {
            onSuccess(deckId, 'Created');
            setCreate(false);
        },
        onError: (error)=> onError(error.message)
    });
}

export function useEditFlashcard(deckId, setIsEdit){
    return useMutation({
        mutationFn: editFlashcard,
        onSuccess: ()=> {
            onSuccess(deckId, 'Edited');
            setIsEdit(false);
        },
        onError: (error)=> onError(error.message),
    });
}

export function useDeleteFlashcard(deckId){
    return useMutation({
        mutationFn: deleteFlashcard,
        onSuccess: ()=> onSuccess(deckId, 'Deleted'),
        onError: (error)=> onError(error.message),
    });
}