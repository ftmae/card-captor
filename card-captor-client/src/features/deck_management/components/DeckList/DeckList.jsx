import ErrorMessage from '../../../../shared/components/ErrorMessage/ErrorMessage.jsx';
import Deck from '../Deck/Deck.jsx';
import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import { createDeck } from '../../services/deckManagement.js';

export default function Decks(){
    const [error, setError] = useState(null);
    const fetchedData = useLoaderData();
    console.log(fetchedData);
    const [decks, setDecks] = useState(fetchedData.data);

    async function handleCreateClick(){
        try{
            const deck = await createDeck();
            setDecks(prev=>[...prev, deck])
        }catch(error){
            setError(error.message);
        }
    }
    
    useEffect(()=>{
        if(fetchedData.error) setError(fetchedData.error);
    }, []);
    
    return(
        <>
            {error && <ErrorMessage error={error} setError={setError}/>}
            <section className="flex-column  align-center container-center" style={{marginTop: '7rem'}}>
                <h1 className="ff-serif">Your Decks</h1>
                <article className="flex-column align-center" style={{width: '90%', marginTop: '1rem'}}>
                    {decks.length > 0 ? 
                        decks.map(deck=><Deck key={deck.id} name={deck.name} id={deck.id} />)
                    :
                        <p className="fs-450">No Decks To Show</p>
                    }
                </article>
                <button className="small-button bg-dark-1 text-white" onClick={handleCreateClick} style={{marginTop: '1rem'}}>Create New Deck</button>
            </section>
        </>
    )
}