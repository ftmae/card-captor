import { useState, useEffect } from 'react';
import { editDeck } from '../../services/deckManagement.js';
import useInlineDeckEdit from '../../hooks/useInlineDeckEdit.jsx';
import EditDeckName from '../../../../shared/components/EditDeckName/EditDeckName.jsx';
import DeckOperations from '../../../../shared/components/DeckOperations/DeckOperations.jsx';
import Checkbox from '../../../../shared/components/Checkbox/Checkbox.jsx';

export default function Deck({name, id, isDeleteMode, handleOnChange, isChecked}){
    const [isEdit, setIsEdit, updatedName, setUpdatedName, handleEdit, handleCancel, isEditPending] = useInlineDeckEdit(name, id);
    return (
        <div className='border-dark-2-trans50 bg-white container flex-column hover'> 
            <div className="border-bottom-dark-2-trans50 flex-row gap-02 align-center padding-bottom-07">
                {isDeleteMode && <Checkbox handleOnChange={handleOnChange} isChecked={isChecked} id={id} /> }
                {isEdit ? <EditDeckName updatedName={updatedName} setUpdatedName={setUpdatedName} handleCancel={handleCancel} handleEdit={handleEdit} /> : <p className="fs-450 ff-serif ">{name}</p>}
            </div>
            <div className="flex-row flex-wrap">
                <DeckOperations handleEdit={handleEdit} isEdit={isEdit} name={name} id={id} isEditPending={isEditPending} />
            </div>
        </div>
    )
}