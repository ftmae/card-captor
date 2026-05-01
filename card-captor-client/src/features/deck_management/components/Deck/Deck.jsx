import { Link } from 'react-router';
import { useState } from 'react';
import { editDeck } from '../../services/deckManagement.js';
import ErrorMessage from '../../../../shared/components/ErrorMessage/ErrorMessage.jsx';
import './deck.css';

export default function Deck({name, id}){
    const [error, setError] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [updatedName, setUpdatedName] = useState(name);

    function handleDelete(){
    }

    async function handleEdit(){
        try{
            setIsEdit(prev=>!prev);
            if(isEdit){
                const updatedDeck = await editDeck(id, updatedName);
                name = updatedName;
            }
        }catch(error){
            setError(error.message)
        }
    }
    return (
        <>
            {error &&  <ErrorMessage error={error} setError={setError}/>}
            <div className='border-dark-2 bg-light-1 container flex-row align-center justify-space-between' style={{width: '100%'}}> 
                <div className='deck-name-container'>
                    {isEdit ? 
                        <input type="text" className="textbox fs-400" value={updatedName} onChange={(event)=>setUpdatedName(event.target.value)}/>:
                        <p>{updatedName}</p> 
                    }
                </div>
                <div className="flex-row align-center">
                    <button className="icon-button bg-trans" title="Edit Deck" onClick={handleEdit}>
                        <span className="text-dark-2 fs-400 material-symbols-outlined">
                            {isEdit ? 'check': 'edit'}
                        </span>
                    </button>
                    <Link to={{pathname: '/flashcards', search: `?deckId=${id}`}} className="icon-button bg-trans" title="View Cards In Deck">
                        <span className="text-dark-2 fs-400 material-symbols-outlined">
                            visibility
                        </span>
                    </Link>
                    <Link to={{pathname: '/generate_flashcards', search: `?deckId=${id}`}} className="icon-button bg-trans" title="Add Cards to Deck">
                        <span className="text-dark-2 fs-400 material-symbols-outlined">
                            add
                        </span>
                    </Link>
                    <button className="icon-button bg-trans" title="Delete Deck" onClick={handleDelete}>
                        <span className="text-dark-2 fs-400 material-symbols-outlined">
                            delete
                        </span>
                    </button>
                </div>
            </div>
        </>
    )
}