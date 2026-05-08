import ErrorMessage from '../../../../shared/components/ErrorMessage/ErrorMessage.jsx';
import Deck from '../Deck/Deck.jsx';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '../../../../shared/queryClient.js';
import { createDeck, fetchDecks, deleteDeck } from '../../services/deckManagement.js';

export default function DeckList(){
    const [showError, setShowError] = useState(null);
    const {data:decks, isLoading: isQueryLoading, isError: isQueryError, error: queryError} = useQuery({
        queryKey: ['decks'],
        queryFn: fetchDecks
    });

    const {mutate: addDeck, isLoading: isMutateLoading, isError: isMutateError, error: mutateError, reset: resetMutation} = useMutation({
        mutationFn: createDeck,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['decks']}),
    });

    useEffect(()=>{
        if(isQueryError) setShowError(true);
    }, [queryError])

    return(
        <>
            {(isQueryError && showError) && <ErrorMessage error={queryError.message} reset={()=>{setShowError(false)}}/>}
            {(isMutateError) && <ErrorMessage error={mutateError.message} reset={resetMutation}/>}
            
            <section className="container mt-7 padding-2">
                <div className="flex-row justify-space-between align-center mb-2">
                    <h1 className="ff-serif">Your Decks</h1>
                    <button className="small-button bg-dark-1 text-white flex-row align-center" onClick={addDeck}>
                        <span className="fs-400 material-symbols-outlined">
                            add
                        </span>
                        Create Deck
                    </button>
                </div>
                
                <div className="grid-responsive">
                    {
                        (isQueryLoading || isMutateLoading) ? <div>Loading Decks</div>
                        : decks?.length > 0 ? 
                        decks.map(deck=><Deck key={deck.id} name={deck.name} id={deck.id} />) : <p className="fs-450">No Decks To Show</p>
                    }
                </div>
            </section>
        </>
    )
}