import { useState } from 'react';
import IconButton from '../../../../shared/components/IconButton/IconButton.jsx';
import DeckLink from '../DeckLink/DeckLink.jsx';
import { useEffect } from 'react';
import { useDeleteDeck, useDupDeck, useEditDeck } from '../../hooks/useDecks.jsx';

export default function Deck({name, id}){
    const [isEdit, setIsEdit] = useState(false);
    const [updatedName, setUpdatedName] = useState(name);

    useEffect(()=>{
        function detectEscapePress(event){
            if(event.key === 'Escape') setIsEdit(false);
        }
        if(isEdit){
            document.addEventListener('keydown', detectEscapePress);
        }
    }, [isEdit]);

    const linkElements = [
        {pathname: '/flashcards', id, title: 'View Cards In Deck', icon: 'folder_eye'},
        {pathname: '/generate_flashcards', id, title: 'Add Cards To Deck', icon: 'add'} 
    ];

    async function handleEdit(){
        setIsEdit(prev=>!prev);
        if(isEdit && updatedName != name){
            editName({id, updatedName})
        }
    }
    const {mutate: removeDeck, isPending: isRemovePending} = useDeleteDeck();
    const {mutate: editName, isPending: isEditPending} = useEditDeck();
    const {mutate: dupDeck, isPending: isDuplicatePending} = useDupDeck();
  
    
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
                    <IconButton title="Edit Deck" onClick={handleEdit} icon={isEdit ? 'check': 'edit_square'} disabled={isRemovePending || isDuplicatePending || isEditPending}/>
                    <IconButton title="Delete Deck" onClick={()=>removeDeck(id)} icon={'delete'} disabled={isRemovePending || isDuplicatePending || isEditPending}/> 
                    <IconButton title="Duplicate Deck" onClick={()=>dupDeck({id, name})} icon={'copy_all'} disabled={isRemovePending || isDuplicatePending || isEditPending}/> 

                    {linkElements.map(element => <DeckLink key={`${element.id}-${element.pathname}`} pathname={element.pathname} id={element.id} title={element.title} icon={element.icon} name={name}/>)}
                </div>
            </div>
        </>
    )
}