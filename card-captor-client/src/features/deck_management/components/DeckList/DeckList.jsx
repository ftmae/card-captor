import Deck from '../Deck/Deck.jsx';
import { useEffect, useMemo, useState } from 'react';
import { useAddDeck, useDecks, useDeleteDeck } from '../../hooks/useDecks.jsx';
import Searchbar from '../../../../shared/components/Searchbar/Searchbar.jsx';
import IconTextButton from '../../../../shared/components/IconTextButton/IconTextButton.jsx';
import useChecked from '../../../../shared/hooks/useChecked.jsx';
import AddDeckForm from '../AddDeckForm/AddDeckForm.jsx';
import './decklist.css';

export default function DeckList(){
    const {data: decks, isLoading: isQueryLoading} = useDecks();
    const [searchInput, setSearchInput] = useState('');
    const [add, setAdd] = useState(false);
    const [deleteDecks, setDeleteDecks] = useState(false);
    const [checked, setChecked, handleOnChange] = useChecked(decks);
    const {mutate: removeDecks, isPending: isRemovePending} = useDeleteDeck();
    const deckstoRender = useMemo(()=> (
        decks?.filter(deck => 
            (deck.name.toLowerCase().includes(searchInput.toLowerCase()))
        )
    ), [decks, searchInput]);

    function handleDone(){
        setDeleteDecks(false);
        removeDecks(checked, {
            onSuccess: setChecked(new Set())
        });
    }
    return(
        <>  
            {add && <AddDeckForm setAdd={setAdd} />}
            <section className="container mt-7 padding-2">
                <div className="decklist-header mb-2">
                    <h1 className="ff-serif">Your Decks</h1>
                    <Searchbar searchInput={searchInput} setSearchInput={setSearchInput} />
                    <div className='flex-row flex-wrap'>
                        <IconTextButton 
                            onClick={()=>setAdd(true)} 
                            disabled={isQueryLoading || isRemovePending} 
                            icon={'add'} 
                            text={'Create Deck'}
                            style='bg-dark-1 text-white border-trans' 
                        />

                        <IconTextButton 
                            onClick={()=>setDeleteDecks(prev=> !prev)} 
                            disabled={isQueryLoading || isRemovePending} 
                            icon={deleteDecks ? 'close_small' : 'delete'} 
                            text={deleteDecks ? '' : 'Delete Decks'}
                            style='bg-light-3 text-dark-2 border-dark-1'
                        />

                        {deleteDecks &&
                            <IconTextButton 
                                onClick={handleDone} 
                                disabled={isQueryLoading || isRemovePending} 
                                icon={'check'} 
                                text={''}
                                style='bg-dark-1 text-white border-trans' 
                            />
                        }
                    </div>
                </div>
                
                <div className="grid-responsive">
                    {
                        (isQueryLoading) ? <div className="flex-container-center min-height-70-vh">Loading Decks</div>
                        : deckstoRender?.length > 0 ? 
                        deckstoRender.map(deck=>(
                            <Deck 
                                key={deck.id} 
                                name={deck.name} 
                                id={deck.id} 
                                deleteDecks={deleteDecks} 
                                handleOnChange={handleOnChange} 
                                isChecked={checked.has(deck.id)} 
                            />
                        )) : <p className="fs-450">No Decks To Show</p>
                    }
                </div>
            </section>
        </>
    )
}