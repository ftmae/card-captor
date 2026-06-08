import { useState, useEffect } from "react";
import { editDeck } from "../services/deckManagement";
import { useEditDeck } from "./useDecks";

export default function useInlineDeckEdit(name, id){
    const [isEdit, setIsEdit] = useState(false);
    const [updatedName, setUpdatedName] = useState(name);
    const {mutate: editName, isPending: isEditPending} = useEditDeck(editDeck);

    useEffect(()=>{
        function detectEscapePress(event){
            if(event.key === 'Escape') setIsEdit(false);
        }
        if(isEdit){
            document.addEventListener('keydown', detectEscapePress);
        }
    }, [isEdit]);

    async function handleEdit(){
        setIsEdit(prev=>!prev);
        if(isEdit && updatedName != name){
            editName({id, updatedName})
        }
    }

    return [isEdit, setIsEdit, updatedName, setUpdatedName, handleEdit, isEditPending]

}