import IconButton from "../../../shared/components/IconButton/IconButton.jsx";
import { editDeckStatus } from "../../deck_management/services/deckManagement.js";
import useInlineDeckEdit from "../../deck_management/hooks/useInlineDeckEdit.jsx";
import { useEditDeck } from "../../deck_management/hooks/useDecks.jsx";
import EditDeckName from "../../../shared/components/EditDeckName.jsx";
import DeckOperations from "../../../shared/components/DeckOperations.jsx";

export default function DeckCheckbox({name, id, isChecked, handleOnChange, selected, type}){      
    const {mutate: editStatus} = useEditDeck(editDeckStatus);
    const [isEdit, setIsEdit, updatedName, setUpdatedName, handleEdit, handleCancel, isEditPending] = useInlineDeckEdit(name, id);

    return (
        <div className={`border-dark-2-trans50 bg-white container justify-space-between hover ${type==="add" ? 'flex-row' : 'flex-column'}`}> 
            <label key={id} htmlFor={id} className="flex-row align-center gap-02">
                {selected && 
                    <>
                        <input className="d-none" type="checkbox" name="deck" checked={isChecked} value={id} id={id} onChange={handleOnChange}/>
                        <span className="checkmark"></span>
                    </>
                }
                {isEdit ? <EditDeckName updatedName={updatedName} setUpdatedName={setUpdatedName} handleCancel={handleCancel} handleEdit={handleEdit} /> : <span className="fs-400 ff-serif">{name}</span> }
            </label>        
           <div className={`flex-row ${type==="study" && 'border-top-dark-2-trans50 padding-top-07'}`}>
                {type === "study" &&
                    <IconButton title="Remove Deck from Study Set" onClick={()=> editStatus({checkedDecks: new Set([id]), status: false})} icon={'close_small'} disabled={false} buttonStyle="flex-row align-center border-dark-2 bg-light-1" spanStyle="text-dark-2"/>
                }
                <DeckOperations handleEdit={handleEdit} isEdit={isEdit} name={name} id={id} isEditPending={isEditPending} />
           </div>
        </div>
    )
}