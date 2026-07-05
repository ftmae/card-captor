import { useAddDeck } from "../hooks/useDecks.jsx";

export default function AddDeckForm({setAdd}){
    const {mutate: addDeck, isPending: isMutatePending} = useAddDeck(setAdd);

    function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        const deckName = formData.get('deck-name');
        addDeck(deckName);

    }
    return (
            <section className="full-screen fixed-top flex-container-center bg-white-trans z-index-5">
            <form onSubmit={handleSubmit} className="container bg-white flex-column padding-2 width-responsive" >
                <h1 className="ff-serif">Add New Deck</h1>
                <input type="text" name="deck-name" placeholder="Enter Deck Name" className="textbox" />
                <div className="flex-row">
                    <button type="submit" className="small-button bg-dark-1 text-white titlecase border-trans width-100" >Add</button>
                    <button type="button" className="small-button bg-light-1 text-dark-2 border-dark-2 width-100" onClick={()=>setAdd(false)}>Cancel</button>
                </div>
            </form>
        </section>
    )
}