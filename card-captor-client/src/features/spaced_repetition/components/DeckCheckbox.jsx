import IconButton from "../../../shared/components/IconButton/IconButton.jsx";
import { editDeckStatus } from "../../deck_management/services/deckManagement.js";
import useInlineDeckEdit from "../../deck_management/hooks/useInlineDeckEdit.jsx";
import { useEditDeck } from "../../deck_management/hooks/useDecks.jsx";
import EditDeckName from "../../../shared/components/EditDeckName/EditDeckName.jsx";
import DeckOperations from "../../../shared/components/DeckOperations/DeckOperations.jsx";
import Checkbox from "../../../shared/components/Checkbox/Checkbox.jsx";

export default function DeckCheckbox({name, id, isChecked, handleOnChange, selected, type}){      
    const {mutate: editStatus} = useEditDeck(editDeckStatus);
    const [isEdit, setIsEdit, updatedName, setUpdatedName, handleEdit, handleCancel, isEditPending] = useInlineDeckEdit(name, id);

    return (
        <div className={`border-dark-2-trans50 bg-white container justify-space-between hover ${type==="add" ? 'flex-row' : 'flex-column'}`}> 
            <div className="flex-row gap-02 align-center">
                {selected && <Checkbox handleOnChange={handleOnChange} isChecked={isChecked} id={id} /> }
                {isEdit ? <EditDeckName updatedName={updatedName} setUpdatedName={setUpdatedName} handleCancel={handleCancel} handleEdit={handleEdit} /> : <span className="fs-400 ff-serif">{name}</span> }
            </div>
            <div className={`flex-row ${type==="study" && 'border-top-dark-2-trans50 padding-top-07'}`}>
                {type === "study" &&
                    <IconButton title="Remove Deck from Study Set" 
                        onClick={()=> editStatus({checkedDecks: new Set([id]), status: false})} icon={'close_small'} 
                        disabled={false} 
                        buttonStyle="flex-row align-center border-dark-2 bg-light-1" 
                        spanStyle="text-dark-2" />
                }
                {/* instead of including this here too, provide a link to deck management  */}
                <DeckOperations handleEdit={handleEdit} isEdit={isEdit} name={name} id={id} isEditPending={isEditPending} />
           </div>
        </div>
    )
}