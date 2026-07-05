import IconButton from "../../../shared/components/IconButton/IconButton.jsx";
import { editDeckStatus } from "../../deck_management/services/deckManagement.js";
import DeckLink from "../../deck_management/components/DeckLink/DeckLink.jsx";
import useInlineDeckEdit from "../../deck_management/hooks/useInlineDeckEdit.jsx";
import { useEditDeck } from "../../deck_management/hooks/useDecks.jsx";

export default function DeckCheckbox({name, id, isChecked, handleOnChange, selected, type}){      
    const {mutate: editStatus} = useEditDeck(editDeckStatus);
    const [isEdit, setIsEdit, updatedName, setUpdatedName, handleEdit, isEditPending] = useInlineDeckEdit(name, id);

    return (
        <div className={`border-dark-2-trans50 bg-white container justify-space-between hover ${type==="add" ? 'flex-row' : 'flex-column'}`}> 
            <label key={id} htmlFor={id} className="flex-row align-center gap-02">
                {selected && 
                    <>
                        <input className="d-none" type="checkbox" name="deck" checked={isChecked} value={id} id={id} onChange={handleOnChange}/>
                        <span className="checkmark"></span>
                    </>
                }
                {isEdit ? 
                    <input type="text" className="textbox fs-450 ff-serif width-100" value={updatedName} onChange={(event)=>setUpdatedName(event.target.value)}/>:
                    <span className="fs-400 ff-serif">{name}</span> 
                }
            </label>        
           <div  className={`flex-row ${type==="study" && 'border-top-dark-2-trans50 padding-top-07'}`}>
                {type === "study" &&
                    <IconButton title="Remove Deck from Study Set" onClick={()=> editStatus({checkedDecks: new Set([id]), status: false})} icon={'close_small'} disabled={false} buttonStyle="flex-row align-center border-dark-2 bg-light-1" spanStyle="text-dark-2"/>
                }
                <DeckLink key={`view-deck-link-${id}`} pathname='/flashcards' id={id} title='View Cards in Deck' icon='folder_eye' name={name}/>
                <IconButton title="Edit Deck" onClick={handleEdit} icon={isEdit ? 'check': 'edit_square'} disabled={isEditPending} buttonStyle={"flex-row align-center border-dark-2 bg-light-1"} spanStyle="text-dark-2"/>
           </div>
        </div>
    )
}