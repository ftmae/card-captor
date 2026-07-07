import { useState, useEffect } from 'react';
import { editDeck } from '../../services/deckManagement.js';
import useInlineDeckEdit from '../../hooks/useInlineDeckEdit.jsx';
import EditDeckName from '../../../../shared/components/EditDeckName.jsx';
import DeckOperations from '../../../../shared/components/DeckOperations.jsx';

export default function Deck({name, id}){
    const [isEdit, setIsEdit, updatedName, setUpdatedName, handleEdit, handleCancel, isEditPending] = useInlineDeckEdit(name, id);
    return (
        <div className='border-dark-2-trans50 bg-white container flex-column hover'> 
            <div className="border-bottom-dark-2-trans50">
                {isEdit ? <EditDeckName updatedName={updatedName} setUpdatedName={setUpdatedName} handleCancel={handleCancel} handleEdit={handleEdit} /> : <p className="fs-450 ff-serif mb-1">{name}</p>}
            </div>
            <div className="flex-row">
                <DeckOperations handleEdit={handleEdit} isEdit={isEdit} name={name} id={id} isEditPending={isEditPending} />
            </div>
        </div>
    )
}