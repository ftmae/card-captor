import { useState } from 'react';
import { editDeck, deleteDeck, duplicateDeck } from '../../services/deckManagement.js';
import queryClient from '../../../../shared/queryClient.js';
import ErrorMessage from '../../../../shared/components/ErrorMessage/ErrorMessage.jsx';
import IconButton from '../../../../shared/components/IconButton/IconButton.jsx';
import DeckLink from '../DeckLink/DeckLink.jsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function Deck({name, id}){
    const [isEdit, setIsEdit] = useState(false);
    const [updatedName, setUpdatedName] = useState(name);

    useEffect(()=>{
        if(isEdit){
            document.addEventListener('keydown', detectEscapePress);
        }
    }, [isEdit]);

    function detectEscapePress(event){
        if(event.key === 'Escape') setIsEdit(false);
    }
    
    const linkElements = [
        {pathname: '/flashcards', id, title: 'View Cards In Deck', icon: 'folder_eye'},
        {pathname: '/generate_flashcards', id, title: 'Add Cards To Deck', icon: 'add'} 
    ];
    
    const {mutate: removeDeck, isLoading: isRemoveLoading, isError: isRemoveError, error: removeError, reset: resetRemove } = useMutation({
        mutationFn: deleteDeck, 
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['decks']})
    });
    
    const {mutate: editName, isLoading: isEditLoading, isError: isEditError, error: editError, reset: resetEdit } = useMutation({
        mutationFn: editDeck, 
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['decks']})
    });
    
    const {mutate: dupDeck, isLoading: isDuplicateLoading, isError: isDuplicateError, error: duplicateError, reset: resetDuplicate } = useMutation({
        mutationFn: duplicateDeck, 
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['decks']})
    }); 
    async function handleEdit(){
        setIsEdit(prev=>!prev);
        if(isEdit && updatedName != name){
            editName({id, updatedName})
        }
    }
    return (
        <>
            {(isRemoveError) && <ErrorMessage error={removeError.message} reset={resetRemove}/>}
            {(isEditError) && <ErrorMessage error={editError.message} reset={resetEdit}/> }
            {(isDuplicateError) && <ErrorMessage error={duplicateError.message} reset={resetDuplicate}/> }

            <div className='border-dark-2-trans50 bg-white container flex-column hover'> 
                <div className="border-bottom-dark-2-trans50">
                    {isEdit ? 
                        <input type="text" className="textbox fs-450 ff-serif width-100" value={updatedName} onChange={(event)=>setUpdatedName(event.target.value)}/>:
                        <p className="fs-450 ff-serif mb-1">{name}</p> 
                    }
                </div>
                <div className="flex-row">
                    <IconButton title="Edit Deck" onClick={handleEdit} icon={isEdit ? 'check': 'edit_square'} />
                    <IconButton title="Delete Deck" onClick={()=>removeDeck(id)} icon={'delete'} /> 
                    <IconButton title="Duplicate Deck" onClick={()=>dupDeck({id, name})} icon={'copy_all'} /> 

                    {linkElements.map(element => <DeckLink key={`${element.id}-${element.pathname}`} pathname={element.pathname} id={element.id} title={element.title} icon={element.icon} name={name}/>)}
                </div>
            </div>
        </>
    )
}