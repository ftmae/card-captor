import { useDeleteDeck } from "../../../modules/deck_management/hooks/useDecks.jsx";
import DeckLink from "./DeckLink/DeckLink.jsx";
import IconButton from "../IconButton/IconButton.jsx";

export default function DeckOperations({handleEdit, name, id, isEdit, isEditPending}){
    const {mutate: removeDeck, isPending: isRemovePending} = useDeleteDeck();
    return(
        <>
            <IconButton title="Edit Deck" onClick={handleEdit} icon={isEdit ? 'check': 'edit_square'} disabled={isRemovePending || isEditPending} buttonStyle={"flex-row align-center border-dark-2 bg-light-1"} spanStyle="text-dark-2"/>
            <IconButton title="Delete Deck" onClick={()=>removeDeck([id])} icon={'delete'} disabled={isRemovePending || isEditPending} buttonStyle={"flex-row align-center border-dark-2 bg-light-1"} spanStyle="text-dark-2"/> 
            <DeckLink key="view_flashcards" pathname="/flashcards" title="View Cards In Deck" icon="folder_eye" name={name} id={id}/>
        </>
    )
}