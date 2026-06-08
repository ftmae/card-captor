import Deck from '../Deck/Deck.jsx';
import { useMemo, useState } from 'react';
import { useAddDeck, useDecks } from '../../hooks/useDecks.jsx';
import Searchbar from '../../../../shared/components/Searchbar/Searchbar.jsx';
import AddDeckForm from '../AddDeckForm.jsx';
import './decklist.css';

export default function DeckList(){
    const {data: decks, isLoading: isQueryLoading} = useDecks();
    const [searchInput, setSearchInput] = useState('');
    const [add, setAdd] = useState(false);
    const deckstoRender = useMemo(()=> decks?.filter(deck => (deck.name.toLowerCase().includes(searchInput.toLowerCase())) ));

    return(
        <>  
            {add && <AddDeckForm setAdd={setAdd} />}
            <section className="container mt-7 padding-2">
                <div className="decklist-header mb-2">
                    <h1 className="ff-serif">Your Decks</h1>
                    <Searchbar searchInput={searchInput} setSearchInput={setSearchInput} />
                    <button className="small-button bg-dark-1 text-white flex-row align-center border-trans" onClick={()=>setAdd(true)} disabled={isQueryLoading}>
                        <span className="fs-400 material-symbols-outlined">
                            add
                        </span>
                        Create Deck
                    </button>
                </div>
                
                <div className="grid-responsive">
                    {
                        (isQueryLoading) ? <div className="flex-container-center min-height-70-vh">Loading Decks</div>
                        : deckstoRender?.length > 0 ? 
                        deckstoRender.map(deck=><Deck key={deck.id} name={deck.name} id={deck.id} />) : <p className="fs-450">No Decks To Show</p>
                    }
                </div>
            </section>
        </>
    )
}