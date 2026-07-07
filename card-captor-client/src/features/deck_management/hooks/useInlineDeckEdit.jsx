import { useState, useEffect } from "react";
import { editDeck } from "../services/deckManagement";
import { useEditDeck } from "./useDecks";

export default function useInlineDeckEdit(name, id, onSuccessFunc){
    const [isEdit, setIsEdit] = useState(false);
    const [updatedName, setUpdatedName] = useState(name);
    const {mutate: editName, isPending: isEditPending} = useEditDeck(editDeck);
    
    async function handleEdit(){
        setIsEdit(prev=>!prev);
        if(isEdit && updatedName != name){
            editName({id, updatedName}, {
                onSuccess: ()=>{
                    if(onSuccessFunc) onSuccessFunc();
                }
            })
        }
    }

    async function handleCancel(){
        setIsEdit(false);
        setUpdatedName(name);
    }

    return [isEdit, setIsEdit, updatedName, setUpdatedName, handleEdit, handleCancel, isEditPending]
}