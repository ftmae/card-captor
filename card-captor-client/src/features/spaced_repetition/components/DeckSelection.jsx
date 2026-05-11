import { useEffect, useState } from 'react';
import IconButton from '../../../shared/components/IconButton/IconButton.jsx';
import DeckCheckbox from './DeckCheckbox.jsx';
import Deck from './Deck.jsx';
import {useDecks} from '../../deck_management/hooks/useDecks.jsx';

export default function DeckSelection() {
    const { data: decks, isPending: isQueryPending } = useDecks();

    function handleSubmit(event) {
        event.preventDefault();
    }

    const [decksCheckbox, setDecksCheckbox] = useState(null);

    useEffect(() => {
        setDecksCheckbox(decks?.map((deck, index) => (index === 0 ? { ...deck, isChecked: true } : { ...deck, isChecked: false })));
    }, [decks])

    function handleOnChange(event) {
        const id = Number.parseInt(event.target.value);
        setDecksCheckbox(prevDecks => (
            prevDecks.map(deck => (
                deck.id === id ? { ...deck, isChecked: !deck.isChecked } : deck
            ))
        ));
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="container mt-7 padding-2 flex-column">
                <div className='flex-row justify-space-between'>
                    <h1 className="fs-500 ff-serif">Ongoing Decks</h1>
                    <button className="small-button bg-dark-1 text-white flex-row">
                        <span className="material-symbols-outlined">
                            book_ribbon
                        </span>
                        Study Cards
                    </button>
                </div>
                <div className="grid-responsive">
                    {
                        (isQueryPending) ? <div className="flex-container-center min-height-70-vh">Loading Decks</div>
                            : decks?.length > 0 ?
                                decks.map(deck => <Deck key={deck.id} name={deck.name} id={deck.id} />) : <p className="fs-450">No Decks To Show</p>
                    }
                </div>

                <div className='flex-row justify-space-between mt-2'>
                    <h1 className="fs-500 ff-serif">Select Decks to Study</h1>
                    <button className="small-button bg-dark-1 text-white flex-row">
                        <span className="material-symbols-outlined">
                            add
                        </span>
                        Add to Set
                    </button>
                </div>
                <div className="grid-responsive">
                    {
                        (isQueryPending) ? <div className="flex-container-center min-height-70-vh">Loading Decks</div>
                            : decksCheckbox?.length > 0 ?
                                decksCheckbox.map(deck => <DeckCheckbox key={deck.id} name={deck.name} id={deck.id} isChecked={deck.isChecked} handleOnChange={handleOnChange} />) : <p className="fs-450">No Decks To Show</p>
                    }
                </div>
            </form>
        </>
    )
}