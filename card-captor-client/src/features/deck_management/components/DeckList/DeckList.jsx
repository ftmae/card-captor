import ErrorMessage from '../../../../shared/components/ErrorMessage/ErrorMessage.jsx';
import Deck from '../Deck/Deck.jsx';
import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { createDeck } from '../../services/deckManagement.js';

export default function Decks(){
    const [error, setError] = useState(null);
    const fetchedDecks = useLoaderData();
    const [decks, setDecks] = useState(fetchedDecks);

    async function handleCreateClick(){
        try{
            const deck = await createDeck();
            setDecks(prev=>[...prev, deck])
        }catch(error){
            setError(error.message);
        }
    }

    return(
        <>
            {error && <ErrorMessage error={error} setError={setError}/>}
            <section className="flex-column  align-center container-center" style={{marginTop: '2rem'}}>
                <h1>Your Decks</h1>
                <article className="flex-column align-center container bg-light-1" style={{width: '90%', marginTop: '1rem'}}>
                    {decks.length > 0 ? 
                        decks.map(deck=><Deck key={deck.id} name={deck.name} id={deck.id} />)
                    :
                        <p className="fs-450">No Decks To Show</p>
                    }
                </article>
                <button className="large-button bg-dark-1 text-white" onClick={handleCreateClick} style={{marginTop: '1rem'}}>Create New Deck</button>
            </section>
        </>
    )
}