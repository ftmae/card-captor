import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router";
import Flashcard from '../Flashcard/Flashcard.jsx';
import TypeButton from "../TypeButton/TypeButton.jsx";
import NewFlashcardForm from "../NewFlashcardForm/NewFlashcardForm.jsx";
import { useAddFlashcard, useDeleteFlashcard, useFlashcards } from "../../hooks/useFlashcards.jsx";
import useInlineDeckEdit from '../../../deck_management/hooks/useInlineDeckEdit.jsx';
import IconButton from "../../../../shared/components/IconButton/IconButton.jsx";
import IconTextButton from "../../../../shared/components/IconTextButton/IconTextButton.jsx";
import { Link } from "react-router";
import queryClient from "../../../../shared/queryClient.js";
import EditDeckName from "../../../../shared/components/EditDeckName/EditDeckName.jsx";
import useChecked from "../../../../shared/hooks/useChecked.jsx";

export default function Flashcards() {
    const [searchParams, setSearchParams] = useSearchParams();
    const deckId = searchParams.get('deckId');
    const deckName = searchParams.get('deckName');
    const [create, setCreate] = useState(false);
    const [currentType, setCurrentType] = useState('All');
    const [deleteCards, setDeleteCards] = useState(false);
    const { data: flashcards, isLoading: isQueryLoading } = useFlashcards([deckId]);
    const { mutate: addCard, isPending: isAddPending } = useAddFlashcard(deckId, setCreate);
    const { mutate: removeCards, isPending: isRemovePening } = useDeleteFlashcard();
    const types = useMemo(()=>['All', ...new Set(flashcards?.map(flashcard=>flashcard.type))], [flashcards]);
    const filteredCards = currentType === 'All' ? flashcards : flashcards?.filter(flashcard => flashcard.type === currentType);
    const [checked, setChecked, handleOnChange] = useChecked(flashcards);
    const [isEdit, setIsEdit, updatedName, setUpdatedName, handleEdit, handleCancel, isEditPending] = useInlineDeckEdit(deckName, deckId, ()=>{
       const newParams = new URLSearchParams(searchParams);
       newParams.set('deckName', updatedName);
       setSearchParams(newParams, {replace: true});
    });

    const isCurrentTypeAllSelected = useMemo(()=>{
        if(!filteredCards || filteredCards.length === 0) return false;
        return filteredCards.every(card=> checked.has(card.id));
    }, [checked, filteredCards])

    function handleDone(){
        setDeleteCards(false);
        removeCards(checked, {
            onSuccess: ()=> setChecked(new Set())
        });
    }
    
    function handleSelectAllToggle(){
        setChecked(prev=>{
            const newChecked = new Set(prev);
            if(isCurrentTypeAllSelected){
                filteredCards.forEach(card => newChecked.delete(card.id));
            }else{
                filteredCards.forEach(card=> newChecked.add(card.id));
            }
            return newChecked;
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
                         {
                            (filteredCards?.length > 0 &&
                                <IconTextButton 
                                    onClick={()=> setDeleteCards(prev=>!prev)} 
                                    disabled={isQueryLoading || isAddPending} 
                                    icon={deleteCards ? 'close_small' : 'delete'}
                                    text={deleteCards ? '' : 'Delete Cards'}
                                    style='bg-light-3 text-dark-2 border-dark-1' 
                                />
                            )
                         }
                        {deleteCards &&
                            <>
                                <IconTextButton 
                                    onClick={handleDone} 
                                    disabled={isQueryLoading || isAddPending} 
                                    icon={'check'} 
                                    text={''}
                                    style='bg-dark-1 text-white border-trans' 
                                />
                                <IconTextButton 
                                    onClick={handleSelectAllToggle} 
                                    disabled={isQueryLoading || isAddPending} 
                                    icon={isCurrentTypeAllSelected ? 'deselect' : 'select_all'} 
                                    text={isCurrentTypeAllSelected ? 'Deselect All' : 'Select All'}
                                    style='bg-dark-1 text-white border-trans' 
                                />
                            </>
                        }
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
                    filteredCards.length > 0 ? 
                        filteredCards.map(flashcard => 
                            <Flashcard 
                                key={flashcard.id} 
                                question={flashcard.question} 
                                answer={flashcard.answer} 
                                deckId={flashcard.deckId}
                                flashcardId={flashcard.id} 
                                type={flashcard.type}
                                deleteCards={deleteCards}
                                isChecked={checked.has(flashcard.id)}
                                handleOnChange={handleOnChange}
                            />)
                        : flashcards.map(flashcard => 
                            <Flashcard 
                                key={flashcard.id} 
                                question={flashcard.question} 
                                answer={flashcard.answer} 
                                deckId={flashcard.deckId}
                                flashcardId={flashcard.id} 
                                type={flashcard.type}
                                deleteCards={deleteCards}
                                isChecked={checked.has(flashcard.id)}
                                handleOnChange={handleOnChange}
                            />)
                    : !isQueryLoading && <div className="flex-container-center fs-450 min-height-70vh">No Flashcards To Show.</div>
                }
            </section>
        </>
    )
}