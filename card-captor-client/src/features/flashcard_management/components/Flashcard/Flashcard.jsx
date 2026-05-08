import { useState } from "react";
import IconButton from "../../../../shared/components/IconButton/IconButton";
import { useMutation } from "@tanstack/react-query";
import { deleteFlashcard, editFlashcard } from "../../services/flashcardManagement";
import NewFlashcardForm from "../NewFlashcardForm/NewFlashcardForm";
import ErrorMessage from "../../../../shared/components/ErrorMessage/ErrorMessage";
import queryClient from "../../../../shared/queryClient.js";

export default function Flashcard({question, answer, deckId, flashcardId, type}){
    const [isEdit, setIsEdit] = useState(false);
    
    const {mutate: deleteCard, isPending: isDelPending, isError: isDelError, error: delError, reset: resetDel } = useMutation({
        mutationFn: deleteFlashcard,
        onSuccess: () => queryClient.invalidateQueries(['flashcards', deckId])
    });

    const {mutate: editCard, isPending: isEditPending, isError: isEditError, error: editError, reset: resetEdit} = useMutation({
        mutationFn: editFlashcard,
        onSuccess: () => {
            queryClient.invalidateQueries(['flashcards', deckId]);
            setIsEdit(false);
        }
    });

    return (
        <>
            {(isDelError) && <ErrorMessage error={delError.message} reset={resetDel}/> }
            {(isEditError) && <ErrorMessage error={editError.message} reset={resetEdit}/> }
            {(isDelPending || isEditPending) && <div>Loading...</div>}

            {isEdit && <NewFlashcardForm 
                formType="edit" 
                action={editCard} 
                setModalState={setIsEdit} 
                id={flashcardId} 
                defaultAnswer={answer} 
                defaultQuestion={question} 
                defaultType={type} 
                deckId={deckId}/>}

            <div className="flex-column border-dark-2-trans50 bg-white container hover mb-05 width-responsive">
                <div className="flex-row justify-space-between">
                    <p>{type}</p>
                    <div className="flex-row">
                        <IconButton title="Delete Flashcard" onClick={()=>deleteCard(flashcardId)} icon={'delete'}/>
                        <IconButton title="Edit Flashcard" onClick={()=>setIsEdit(true)} icon={isEdit ? 'check': 'edit_square'}/>
                    </div>
                </div>
                <div className="grid-responsive">
                    <div className="flex-column container border-dark-2-trans50">
                        <p className="uppercase fs-350 text-dark-2-trans50">Question</p>
                        <p className="text-dark-2">{question}</p>
                    </div>
                    <div className="flex-column container bg-light-3">
                        <p className="uppercase fs-350 text-dark-2-trans50">Answer</p>
                        <p className="text-dark-2">{answer}</p>
                    </div>
                </div>
                
            </div>
        </>
    )
}