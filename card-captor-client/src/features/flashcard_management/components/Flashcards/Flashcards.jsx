import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router";
import Flashcard from '../Flashcard/Flashcard.jsx';
import TypeButton from "../TypeButton/TypeButton.jsx";
import NewFlashcardForm from "../NewFlashcardForm/NewFlashcardForm.jsx";
import { useAddFlashcard, useFlashcards } from "../../hooks/useFlashcards.jsx";

export default function Flashcards() {
    const [searchParams] = useSearchParams();
    const deckId = searchParams.get('deckId');
    const deckName = searchParams.get('deckName');
    const [create, setCreate] = useState(false);
    const [current, setCurrent] = useState('All');
    const { data: flashcards, isLoading: isQueryLoading } = useFlashcards(deckId);
    const { mutate: addCard, isPending: isAddPending } = useAddFlashcard(deckId, setCreate);
    const types = useMemo(()=>['All', ...new Set(flashcards?.map(flashcard=>flashcard.type))], [flashcards]);
    const filteredCards = flashcards?.filter(flashcard => flashcard.type === current);
    
    return (
        <>
            {create && <NewFlashcardForm formType="add" action={addCard} setModalState={setCreate} id={deckId} />}
            <section className="mt-7 container flex-column align-center">
                <div className="flex-row justify-space-between align-center width-responsive mb-05">
                    <h1 className="ff-serif fs-500 ">{deckName}</h1> 
                    <div className="flex-row">
                        <button className="small-button bg-dark-1 text-white flex-row align-center" onClick={()=> setCreate(prev=>!prev)}>
                            <span className="fs-400 material-symbols-outlined">
                                add
                            </span>
                            Add Card
                        </button>
                    </div>
                </div>
                <div className="width-responsive">
                    {flashcards?.length > 0 && types.map(type=>(
                        <TypeButton text={type} onClick={()=> setCurrent(type)} current={current}/>
                    ))}
                </div>

                {(isQueryLoading || isAddPending) && <div>Loading...</div>}
                {flashcards?.length > 0 ? 
                    filteredCards.length > 0 ? 
                        filteredCards.map(flashcard => 
                            <Flashcard 
                                key={flashcard.id} 
                                question={flashcard.question} 
                                answer={flashcard.answer} 
                                deckId={flashcard.deckId}
                                flashcardId={flashcard.id} 
                                type={flashcard.type}
                            />)
                        : flashcards.map(flashcard => 
                            <Flashcard 
                                key={flashcard.id} 
                                question={flashcard.question} 
                                answer={flashcard.answer} 
                                deckId={flashcard.deckId}
                                flashcardId={flashcard.id} 
                                type={flashcard.type}
                            />)
                    : !isQueryLoading && <div className="flex-container-center fs-450 min-height-70vh">No Flashcards To Show.</div>
                }
            </section>
        </>
    )
}