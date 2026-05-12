import Deck from '../Deck/Deck.jsx';
import { useMemo, useState } from 'react';
import { useAddDeck, useDecks } from '../../hooks/useDecks.jsx';
import './decklist.css';

export default function DeckList(){
    const {data: decks, isLoading: isQueryLoading} = useDecks();
    const {mutate: addDeck, isPending: isMutatePending} = useAddDeck();
    const [searchInput, setSearchInput] = useState('');
    const deckstoRender = useMemo(()=> decks?.filter(deck => (deck.name.toLowerCase().includes(searchInput.toLowerCase())) ));

    return(
        <>  
            <section className="container mt-7 padding-2">
                <div className="decklist-header mb-2">
                    <h1 className="ff-serif">Your Decks</h1>
                    <input type="text" className='textbox-large bg-white' placeholder='Search For Decks' value={searchInput} onChange={()=>setSearchInput(event.target.value)} />
                    <button className="small-button bg-dark-1 text-white flex-row align-center" onClick={addDeck} disabled={isMutatePending || isQueryLoading}>
                        <span className="fs-400 material-symbols-outlined">
                            add
                        </span>
                        Create Deck
                    </button>
                </div>
                
                <div className="grid-responsive">
                    {
                        (isQueryLoading || isMutatePending) ? <div className="flex-container-center min-height-70-vh">Loading Decks</div>
                        : deckstoRender?.length > 0 ? 
                        deckstoRender.map(deck=><Deck key={deck.id} name={deck.name} id={deck.id} />) : <p className="fs-450">No Decks To Show</p>
                    }
                </div>
            </section>
        </>
    )
}