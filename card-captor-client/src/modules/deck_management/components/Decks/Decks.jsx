import Deck from '../Deck/Deck.jsx';
import { useEffect, useMemo, useState } from 'react';
import { useAddDeck, useDecks, useDeleteDeck } from '../../hooks/useDecks.jsx';
import Searchbar from '../../../../shared/components/Searchbar/Searchbar.jsx';
import IconTextButton from '../../../../shared/components/IconTextButton/IconTextButton.jsx';
import useChecked from '../../../../shared/hooks/useChecked.jsx';
import AddDeckForm from '../AddDeckForm/AddDeckForm.jsx';
import useSelectAll from '../../../../shared/hooks/useSelectAll.jsx';
import BulkDelete from '../../../../shared/components/BulkDelete/BulkDelete.jsx';
import './decks.css';

export default function Decks(){
    const {data: decks, isLoading: isQueryLoading} = useDecks();
    const [searchInput, setSearchInput] = useState('');
    const [add, setAdd] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [checked, setChecked, handleOnChange] = useChecked(decks);
    const {mutate: removeDecks, isPending: isRemovePending} = useDeleteDeck();
    const filteredDecks = useMemo(()=> (
        decks?.filter(deck => 
            (deck.name.toLowerCase().includes(searchInput.toLowerCase()))
        )
    ), [decks, searchInput]);
    const [isAllSelected, onToggleSelectAll] = useSelectAll(checked, setChecked, filteredDecks);

    function onConfirmDelete(){
        setIsDeleteMode(false);
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
                        <BulkDelete 
                            data={filteredDecks}
                            isDeleteMode={isDeleteMode}
                            setIsDeleteMode={setIsDeleteMode}
                            isAllSelected={isAllSelected}
                            onConfirmDelete={onConfirmDelete}
                            onToggleSelectAll={onToggleSelectAll}
                            disabled={isQueryLoading || isRemovePending}
                            deleteLabel="Delete Cards"
                        />
                    </div>
                </div>
                
                <div className="grid-responsive">
                    {
                        (isQueryLoading) ? <div className="flex-container-center min-height-70-vh">Loading Decks</div>
                        : filteredDecks?.length > 0 ? 
                        filteredDecks.map(deck=>(
                            <Deck 
                                key={deck.id} 
                                name={deck.name} 
                                id={deck.id} 
                                isDeleteMode={isDeleteMode} 
                                handleOnChange={handleOnChange} 
                                isChecked={checked.has(deck.id)} 
                            />
                        )) : <div className="flex-container-center fs-450 min-height-60vh">No Decks To Show.</div>
                    }
                </div>
            </section>
        </>
    )
}