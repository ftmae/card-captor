import { useEffect, useState } from 'react';
import FilteredDecks from './FilteredDecks.jsx';
import {useDecks} from '../../deck_management/hooks/useDecks.jsx';

export default function DeckSelection() {
    const { data: decks, isPending: isQueryPending } = useDecks();
    const [selected, setSelected] = useState(false);
    const [ongoingChecked, setOngoingChecked] = useState(new Set());
    const [pendingChecked, setPendingChecked] = useState(new Set());
    const onGoingDecks = decks?.filter(deck=>(deck.isStudying));
    const pendingDecks = decks?.filter(deck=>(!deck.isStudying));

     useEffect(()=>{
        if(onGoingDecks?.length > 0 && ongoingChecked.size === 0){
            setOngoingChecked(new Set([onGoingDecks[0].id]));
        }
        if(pendingDecks?.length > 0 && pendingChecked.size === 0){
            setPendingChecked(new Set([pendingDecks[0].id]));
        }
    }, [decks]);

    
    return (
        <div className="container mt-7 padding-2 flex-column">
            {onGoingDecks?.length > 0 && 
                <FilteredDecks 
                    heading="Ongoing Decks" 
                    filteredDecks={onGoingDecks} 
                    buttonIcon={'book_ribbon'} 
                    buttonText={"Study Cards"} 
                    checkedDecks={ongoingChecked} 
                    setCheckedDecks={setOngoingChecked}
                    type="study" />
            }

            {pendingDecks?.length > 0 && 
                <FilteredDecks 
                    heading="Pending Decks" 
                    filteredDecks={pendingDecks} 
                    buttonIcon={'add'} 
                    buttonText={"Add to Set"} 
                    checkedDecks={pendingChecked} 
                    setCheckedDecks={setPendingChecked}
                    type="add" />
            }
        </div>
    )
}