import { useState } from 'react';
import IconButton from '../../../shared/components/IconButton/IconButton.jsx';
import { useRecallTypes, useUpdateRecallType } from '../hooks/useSpacedRep.jsx';
import { useEditFlashcard } from '../../flashcard_management/hooks/useFlashcards.jsx';
import NewFlashcardForm from '../../flashcard_management/components/NewFlashcardForm/NewFlashcardForm.jsx';

export default function StudyCard({flashcards, current, setCurrent, side, setSide}){
    const [isEdit, setIsEdit] = useState(false);
    const { mutate: editCard, isPending: isEditPending } = useEditFlashcard(flashcards[current].deckId, setIsEdit);

    const {data: recallTypes} = useRecallTypes();
    const {mutate: updateCard, isPending, OnSuccess} = useUpdateRecallType(setCurrent, setSide);

    function handleAnswerClick(event){
        const id = event.target.id;
        const rating = event.target.value;
        updateCard({rating, id});
    }
    
    return(
        <>
            {isEdit && <NewFlashcardForm 
                formType="edit" 
                action={editCard} 
                setModalState={setIsEdit} 
                id={flashcards[current].id} 
                defaultAnswer={flashcards[current].answer} 
                defaultQuestion={flashcards[current].question} 
                defaultType={flashcards[current].type} 
                deckId={flashcards[current].deckId}/>}
            
            <div className="container bg-white border-dark-2-trans50 text-dark-2 flex-column justify-space-between gap-2 min-width-50 min-height-350px">
                <div className="flex-row justify-space-between">
                    <p className="text-dark-2-trans50 fs-425 ff-serif bg-light-3 align-self-start padding-03 border-radius-05">{side === 'question' ? flashcards[current].type : 'Answer'}</p>
                    <div className="flex-row">
                        <IconButton title="Flip Card" onClick={() => setSide(prev=> prev === 'question' ? 'answer' : 'question')} icon="swap_horiz" disabled={false} buttonStyle={"fs-350 align-self-start align-center flex-row border-trans bg-dark-2 text-light-3"} spanStyle="text-white"/>
                        <IconButton title="Edit Card" onClick={() => setIsEdit(true)} icon="edit_square" disabled={false} buttonStyle={"fs-350 align-self-start align-center flex-row border-trans bg-dark-2 text-light-3"} spanStyle="text-white"/>
                    </div>
                </div>
                <p className="ff-serif fs-500 align-self-center">{side === 'question' ? flashcards[current].question : flashcards[current].answer}</p>
            
                <div className="flex-row justify-space-between">
                    {side === 'answer' && 
                        recallTypes.map((type) => <button key={type.id} id={flashcards[current].id} value={type.name} className="small-button bg-trans text-dark-2 border-dark-2 width-100" onClick={handleAnswerClick}>{type.name}</button>)
                    }
                </div>
            </div>
        </>
    )
}