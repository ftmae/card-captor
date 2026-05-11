import { useQuery, useMutation } from "@tanstack/react-query";
import { createDeck, deleteDeck, duplicateDeck, editDeck, fetchDecks } from '../services/deckManagement.js';
import queryClient from "../../../shared/queryClient.js";
import { toast } from 'react-toastify';

function onSuccess(operationType){
    queryClient.invalidateQueries({queryKey: ['decks']});
    toast.success(`Deck ${operationType} Successfully!`);
}

function onError(message){
    toast.error(message)
}

const queryKey = ['decks'];
export function useDecks(){
    return useQuery({
        queryKey,
        queryFn: fetchDecks,
    });
}

export function useAddDeck(){
    return useMutation({
        mutationFn: createDeck,
        onSuccess: ()=> onSuccess('Added'),
        onError: (error)=> onError(error.message),
    })
}

export function useEditDeck(){
    return useMutation({
        mutationFn: editDeck,
        onSuccess: ()=> onSuccess('Edited'),
        onError: (error)=> onError(error.message),
    });
}

export function useDeleteDeck(){
    return useMutation({
        mutationFn: deleteDeck,
        onSuccess: ()=> onSuccess('Deleted'), 
        onError: (error)=> onError(error.message),
    });
}

export function useDupDeck(){
    return useMutation({
        mutationFn: duplicateDeck,
        onSuccess: ()=> onSuccess('Duplicated'),
        onError: (error)=> onError(error.message),
    });
}