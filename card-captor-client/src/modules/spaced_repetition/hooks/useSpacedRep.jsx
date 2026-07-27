import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchFlashcards, fetchRecallTypes, updateRecallType } from '../services/spacedRepetition';
import queryClient from '../../../shared/queryClient';
import { toast } from 'react-toastify';

export function useRecallTypes(){
    return useQuery({
        queryKey: ['recall_types'],
        queryFn: fetchRecallTypes,
    });
}

export function useSpacedRepFlashcards(deckIds){
    return useQuery({
        queryKey: ['spacedRepFlashcards', deckIds.toString()],
        queryFn: ()=> fetchFlashcards(deckIds)
    })
}

export function useUpdateRecallType(setCurrent, setSide){
    return useMutation({
        mutationFn: ({rating, id})=> updateRecallType(rating, id),
        onSuccess: ()=> {
            queryClient.invalidateQueries(['spacedRepFlashcards']);
            setCurrent(0);
            setSide('question');
        },
        onError: ()=> toast.error('Failed to Update Card')
    });
}