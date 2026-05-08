import { useEffect, useState } from "react"
import { useSearchParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFlashcard, fetchFlashcards} from "../../services/flashcardManagement";
import queryClient from '../../../../shared/queryClient.js';
import ErrorMessage from "../../../../shared/components/ErrorMessage/ErrorMessage";
import Flashcard from '../Flashcard/Flashcard.jsx';
import NewFlashcardForm from "../NewFlashcardForm/NewFlashcardForm.jsx";

export default function Flashcards() {
    const [showError, setShowError] = useState(null);
    const [searchParams] = useSearchParams();
    const deckId = searchParams.get('deckId');
    const deckName = searchParams.get('deckName');
    const [create, setCreate] = useState(false);
    const { data: flashcards, isLoading, isError, error } = useQuery({
        queryKey: ['flashcards', deckId],
        queryFn: () => fetchFlashcards(deckId),
    });
    
    const {mutate: addCard, isPending: isAddPending, isError: isAddError, error: addError, reset: resetAdd } = useMutation({
        mutationFn: createFlashcard, 
        onSuccess: () => {
            queryClient.invalidateQueries(['flashcards', deckId]);
            setCreate(false);
        }
    });

    useEffect(()=>{
        if(isError){
            setShowError(true);
        }
    }, [error])

    return (
        <>
            {(isError && showError) && <ErrorMessage error={error.message} reset={()=>{setShowError(false)}}/> }
            {(isAddError) && <ErrorMessage error={addError.message} reset={resetAdd}/> }

            {create && <NewFlashcardForm formType="add" action={addCard} setModalState={setCreate} id={deckId} />}
            <section className="mt-7 container flex-column align-center">
                <div className="flex-row justify-space-between align-center width-responsive mb-05">
                    <h1 className="ff-serif fs-500 text-center">{deckName}</h1> 
                    <div className="flex-row">
                        <button className="small-button bg-dark-1 text-white flex-row align-center" onClick={()=> setCreate(prev=>!prev)}>
                            <span className="fs-400 material-symbols-outlined">
                                add
                            </span>
                            Add Card
                        </button>
                        {/* <button className="small-button bg-dark-1 text-white flex-row align-center" onClick={()=>console.log('transfer ')}>
                            <span className="fs-400 material-symbols-outlined">
                                swap_horiz
                            </span>
                            Transfer Cards
                        </button> */}
                    </div>
                </div>

                {(isLoading || isAddPending) && <div>Loading...</div>}
                {flashcards?.length > 0 ? 
                    flashcards.map(flashcard => 
                        <Flashcard 
                            key={flashcard.id} 
                            question={flashcard.question} 
                            answer={flashcard.answer} 
                            deckId={flashcard.deckId}
                            flashcardId={flashcard.id} 
                            type={flashcard.type}
                        />)
                        : !isLoading && <div className="flex-container-center fs-450 min-height-70vh">No Flashcards To Show.</div>
                }
            </section>
        </>
    )
}