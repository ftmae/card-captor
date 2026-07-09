import { useEffect, useMemo, useState } from "react"
import { useSearchParams, Link } from "react-router";
import Flashcard from '../Flashcard/Flashcard.jsx';
import TypeButton from "../TypeButton/TypeButton.jsx";
import NewFlashcardForm from "../NewFlashcardForm/NewFlashcardForm.jsx";
import { useAddFlashcard, useDeleteFlashcard, useFlashcards } from "../../hooks/useFlashcards.jsx";
import useInlineDeckEdit from '../../../deck_management/hooks/useInlineDeckEdit.jsx';
import IconButton from "../../../../shared/components/IconButton/IconButton.jsx";
import IconTextButton from "../../../../shared/components/IconTextButton/IconTextButton.jsx";
import queryClient from "../../../../shared/queryClient.js";
import EditDeckName from "../../../../shared/components/EditDeckName/EditDeckName.jsx";
import useChecked from "../../../../shared/hooks/useChecked.jsx";
import useSelectAll from "../../../../shared/hooks/useSelectAll.jsx";
import BulkDelete from "../../../../shared/components/BulkDelete/BulkDelete.jsx";

export default function Flashcards() {
    const [searchParams, setSearchParams] = useSearchParams();
    const deckId = searchParams.get('deckId');
    const deckName = searchParams.get('deckName');
    const [create, setCreate] = useState(false);
    const [currentType, setCurrentType] = useState('All');
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const { data: flashcards, isLoading: isQueryLoading } = useFlashcards([deckId]);
    const { mutate: addCard, isPending: isAddPending } = useAddFlashcard(deckId, setCreate);
    const { mutate: removeCards, isPending: isRemovePening } = useDeleteFlashcard();
    const types = useMemo(()=>['All', ...new Set(flashcards?.map(flashcard=>flashcard.type))], [flashcards]);
    const filteredCards = currentType === 'All' ? flashcards : flashcards?.filter(flashcard => flashcard.type === currentType);
    const [checked, setChecked, handleOnChange] = useChecked(flashcards);
    const [isAllSelected, onToggleSelectAll] = useSelectAll(checked, setChecked, filteredCards);
    const [isEdit, setIsEdit, updatedName, setUpdatedName, handleEdit, handleCancel, isEditPending] = useInlineDeckEdit(deckName, deckId, ()=>{
       const newParams = new URLSearchParams(searchParams);
       newParams.set('deckName', updatedName);
       setSearchParams(newParams, {replace: true});
    });


    function onConfirmDelete(){
        setIsDeleteMode(false);
        removeCards(checked, {
            onSuccess: ()=> setChecked(new Set())
        });
    }
        
    return (
        <>
            {create && <NewFlashcardForm formType="add" action={addCard} setModalState={setCreate} id={deckId} />}
            <section className="mt-7 container flex-column align-center">
                <div className="flex-column mb-05">
                    <div className="flex-row align-center mb-05">
                        <IconButton title="Edit Deck" onClick={handleEdit} icon={isEdit ? 'check': 'edit_square'} disabled={isEditPending} buttonStyle={"flex-row align-center border-trans bg-trans"} spanStyle="text-dark-1"/>
                        {isEdit ? <EditDeckName updatedName={updatedName} setUpdatedName={setUpdatedName} handleCancel={handleCancel} handleEdit={handleEdit} /> : <h1 className="ff-serif fs-500 ">{deckName}</h1> }
                    </div>
                            
                    <div className="flex-row flex-wrap">
                        <BulkDelete 
                            data={filteredCards}
                            isDeleteMode={isDeleteMode}
                            setIsDeleteMode={setIsDeleteMode}
                            isAllSelected={isAllSelected}
                            onConfirmDelete={onConfirmDelete}
                            onToggleSelectAll={onToggleSelectAll}
                            disabled={isQueryLoading || isAddPending}
                            deleteLabel="Delete Decks"
                        />
                        <IconTextButton 
                            onClick={()=> setCreate(prev=>!prev)} 
                            disabled={isQueryLoading || isAddPending} 
                            icon={'add'} 
                            text={'Add Card'}
                            style='bg-dark-1 text-white border-trans flex-grow-1 ' 
                        />
                        <Link to={{pathname: '/generate_flashcards', search: `?deckId=${deckId}&deckName=${deckName}`}} className=" flex-grow-1 small-button flex-row align-center bg-dark-1 border-trans text-white " title="Generate Cards">
                            <span className="text-white fs-400 material-symbols-outlined">
                                cards_stack
                            </span>
                            Generate Cards
                        </Link>
                    </div>
                </div>
                <div>
                    {flashcards?.length > 0 && types.map(type=>(
                        <TypeButton key={type} text={type} onClick={()=> setCurrentType(type) } currentType={currentType}/>
                    ))}
                </div>

                {(isQueryLoading || isAddPending) && <div>Loading...</div>}
                {flashcards?.length > 0 ? 
                    filteredCards.length > 0 && 
                        filteredCards.map(flashcard => 
                            <Flashcard 
                                key={flashcard.id} 
                                question={flashcard.question} 
                                answer={flashcard.answer} 
                                deckId={flashcard.deckId}
                                flashcardId={flashcard.id} 
                                type={flashcard.type}
                                isDeleteMode={isDeleteMode}
                                isChecked={checked.has(flashcard.id)}
                                handleOnChange={handleOnChange}
                            />)
                    : !isQueryLoading && <div className="flex-container-center fs-450 min-height-60vh">No Flashcards To Show.</div>
                }
            </section>
        </>
    )
}