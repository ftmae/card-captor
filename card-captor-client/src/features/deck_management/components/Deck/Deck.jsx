import { useState } from 'react';
import IconButton from '../../../../shared/components/IconButton/IconButton.jsx';
import DeckLink from '../DeckLink/DeckLink.jsx';
import { useEffect } from 'react';
import { useDeleteDeck, useDupDeck } from '../../hooks/useDecks.jsx';
import { editDeck } from '../../services/deckManagement.js';
import useInlineDeckEdit from '../../hooks/useInlineDeckEdit.jsx';

export default function Deck({name, id}){
    const linkElements = [
        {pathname: '/flashcards', id, title: 'View Cards In Deck', icon: 'folder_eye'},
        {pathname: '/generate_flashcards', id, title: 'Add Cards To Deck', icon: 'add'} 
    ];

    const {mutate: removeDeck, isPending: isRemovePending} = useDeleteDeck();
    const {mutate: dupDeck, isPending: isDuplicatePending} = useDupDeck();

    const [isEdit, setIsEdit, updatedName, setUpdatedName, handleEdit, isEditPending] = useInlineDeckEdit(name, id);
    
    return (
        <>
            <div className='border-dark-2-trans50 bg-white container flex-column hover'> 
                <div className="border-bottom-dark-2-trans50">
                    {isEdit ? 
                        <input type="text" className="textbox fs-450 ff-serif width-100" value={updatedName} onChange={(event)=>setUpdatedName(event.target.value)}/>:
                        <p className="fs-450 ff-serif mb-1">{name}</p> 
                    }
                </div>
                <div className="flex-row">
                    <IconButton title="Edit Deck" onClick={handleEdit} icon={isEdit ? 'check': 'edit_square'} disabled={isRemovePending || isDuplicatePending || isEditPending} buttonStyle={"flex-row align-center border-dark-2 bg-light-1"} spanStyle="text-dark-2"/>
                    <IconButton title="Delete Deck" onClick={()=>removeDeck(id)} icon={'delete'} disabled={isRemovePending || isDuplicatePending || isEditPending} buttonStyle={"flex-row align-center border-dark-2 bg-light-1"} spanStyle="text-dark-2"/> 
                    <DeckLink key="view_flashcards" pathname="/flashcards" title="View Cards In Deck" icon="folder_eye" name={name} id={id}/>
                </div>
            </div>
        </>
    )
}