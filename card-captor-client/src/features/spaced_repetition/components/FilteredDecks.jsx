import DeckCheckbox from './DeckCheckbox.jsx';
import { editDeckStatus } from '../../deck_management/services/deckManagement.js';
import { useEditDeck } from '../../deck_management/hooks/useDecks.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function FilteredDecks({ heading, filteredDecks, buttonIcon, buttonText, handleOnChange, checkedDecks, setCheckedDecks, type}) {
    const {mutate: editStatus, isPending: isEditPending} = useEditDeck(editDeckStatus);
    const [selected, setSelected] = useState(false);
    const navigate = useNavigate();

    function handleClick(event){
        setSelected(false);
        if(type==="add"){
            editStatus({checkedDecks, status: true});
        }else{
            const searchParams = new URLSearchParams();
            checkedDecks.forEach(deck=> searchParams.append("deckId", deck));
            navigate({pathname: '/study', search: `?${searchParams.toString()}`});
        }
    }

    function handleOnChange(event){
        const id = Number.parseInt(event.target.value);
        setCheckedDecks(prev=>{
            const newDeck = new Set(prev);
            prev.has(id) ? newDeck.delete(id) : newDeck.add(id);
            return newDeck;
        });
    }

    return (
        <>
            <div className='flex-row justify-space-between'>
                <h1 className="fs-500 ff-serif">{heading}</h1>
                <div className="flex-row">
                    <button className={`small-button flex-row align-center ${selected ? "bg-light-3 text-dark-2 border-dark-1" : "border-trans bg-dark-1 text-white"}`} onClick={()=>setSelected(prev=>!prev)}>
                        <span className="material-symbols-outlined">
                            {selected ? 'close_small': buttonIcon}
                        </span>
                        {selected ? 'Cancel': buttonText}
                    </button>
                    {selected && 
                        <button className="small-button flex-row align-center border-trans bg-dark-1 text-white" onClick={handleClick}>
                            <span className="material-symbols-outlined">
                                check
                            </span>
                            Done
                        </button>
                    }
                </div>
            </div>
            <div className="grid-responsive">
                { filteredDecks?.length > 0 ? 
                    filteredDecks.map(deck => (
                        <DeckCheckbox 
                            key={deck.id} 
                            name={deck.name} 
                            id={deck.id} 
                            selected={selected} 
                            isChecked={checkedDecks.has(deck.id)} 
                            handleOnChange={handleOnChange} 
                            selected={selected} 
                            type={type} />
                    ))
                    : <p className="fs-450 flex-container-center bg-white border-dark-2">No Decks To Show</p>
                }
            </div>
        </>
    )
}