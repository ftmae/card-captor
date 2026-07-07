import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router";
import Flashcard from '../Flashcard/Flashcard.jsx';
import TypeButton from "../TypeButton/TypeButton.jsx";
import NewFlashcardForm from "../NewFlashcardForm/NewFlashcardForm.jsx";
import { useAddFlashcard, useFlashcards } from "../../hooks/useFlashcards.jsx";
import useInlineDeckEdit from '../../../deck_management/hooks/useInlineDeckEdit.jsx';
import IconButton from "../../../../shared/components/IconButton/IconButton.jsx";
import { Link } from "react-router";
import queryClient from "../../../../shared/queryClient.js";
import EditDeckName from "../../../../shared/components/EditDeckName.jsx";

export default function Flashcards() {
    const [searchParams, setSearchParams] = useSearchParams();
    const deckId = searchParams.get('deckId');
    const deckName = searchParams.get('deckName');
    const [create, setCreate] = useState(false);
    const [current, setCurrent] = useState('All');
    const { data: flashcards, isLoading: isQueryLoading } = useFlashcards([deckId]);
    const { mutate: addCard, isPending: isAddPending } = useAddFlashcard(deckId, setCreate);
    const types = useMemo(()=>['All', ...new Set(flashcards?.map(flashcard=>flashcard.type))], [flashcards]);
    const filteredCards = flashcards?.filter(flashcard => flashcard.type === current);
    const [isEdit, setIsEdit, updatedName, setUpdatedName, handleEdit, handleCancel, isEditPending] = useInlineDeckEdit(deckName, deckId, ()=>{
       const newParams = new URLSearchParams(searchParams);
       newParams.set('deckName', updatedName);
       setSearchParams(newParams, {replace: true});
    });
    
    return (
        <>
            {create && <NewFlashcardForm formType="add" action={addCard} setModalState={setCreate} id={deckId} />}
            <section className="mt-7 container flex-column align-center">
                <div className="flex-row align-center justify-space-between width-responsive mb-05">
                    <div className="flex-row align-center">
                        <IconButton title="Edit Deck" onClick={handleEdit} icon={isEdit ? 'check': 'edit_square'} disabled={isEditPending} buttonStyle={"flex-row align-center border-trans bg-trans"} spanStyle="text-dark-1"/>
                        {isEdit ? <EditDeckName updatedName={updatedName} setUpdatedName={setUpdatedName} handleCancel={handleCancel} handleEdit={handleEdit} /> : <h1 className="ff-serif fs-500 ">{deckName}</h1> }
                    </div>
                            
                    <div className="flex-row">
                        {/* <button className="small-button border-dark-2 bg-light-1 flex-row align-center text-dark-2" onClick={()=> console.log('hello')} disabled={isQueryLoading || isAddPending}>
                            <span className="fs-400 material-symbols-outlined text-dark-2">
                                delete
                            </span>
                            Delete Cards
                        </button> */}
                        <button className="small-button border-dark-2 bg-light-1 flex-row align-center text-dark-2" onClick={()=> setCreate(prev=>!prev)} disabled={isQueryLoading || isAddPending}>
                            <span className="fs-400 material-symbols-outlined text-dark-2">
                                add
                            </span>
                            Add Card
                        </button>
                        <Link to={{pathname: '/generate_flashcards', search: `?deckId=${deckId}&deckName=${deckName}`}} className="icon-button flex-row align-center bg-dark-1 border-trans text-white " title="Generate Cards">
                            <span className="text-white fs-400 material-symbols-outlined">
                                cards_stack
                            </span>
                            Generate Cards
                        </Link>
                    </div>
                </div>
                <div className="width-responsive">
                    {flashcards?.length > 0 && types.map(type=>(
                        <TypeButton key={type} text={type} onClick={()=> setCurrent(type)} current={current}/>
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