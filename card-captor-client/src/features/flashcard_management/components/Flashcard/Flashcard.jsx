import { useState } from "react";
import IconButton from "../../../../shared/components/IconButton/IconButton";
import NewFlashcardForm from "../NewFlashcardForm/NewFlashcardForm";
import { useDeleteFlashcard, useEditFlashcard } from "../../hooks/useFlashcards.jsx";

export default function Flashcard({question, answer, deckId, flashcardId, type}){
    const [isEdit, setIsEdit] = useState(false);
    const { mutate: deleteCard, isPending: isDelPending } = useDeleteFlashcard(deckId)
    const { mutate: editCard, isPending: isEditPending } = useEditFlashcard(deckId, setIsEdit);

    return (
        <>
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
                        <IconButton title="Delete Flashcard" onClick={()=>deleteCard(flashcardId)} icon={'delete'} disabled={isDelPending || isEditPending } buttonStyle="flex-row align-center border-dark-2 bg-light-1" spanStyle="text-dark-2"/>
                        <IconButton title="Edit Flashcard" onClick={()=>setIsEdit(true)} icon={isEdit ? 'check': 'edit_square'} disabled={isDelPending || isEditPending } buttonStyle="flex-row align-center border-dark-2 bg-light-1" spanStyle="text-dark-2"/>
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