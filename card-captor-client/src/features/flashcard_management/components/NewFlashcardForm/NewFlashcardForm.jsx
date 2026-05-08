const QUESTION_TYPES = [
    'Fill in the Blanks',
    'Multiple Choice',
    'Short Answer',
    'Long Answer',
    'Assertion / Reason',
    'True / False'
];

export default function NewFlashcardForm({formType, action, setModalState, id, defaultQuestion, defaultAnswer, defaultType, deckId}){
    function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        const question = formData.get('question');
        const answer = formData.get('answer');
        const flashcardType = formData.get('type');
        formType === "add" && action({deckId: id, question, answer, type: flashcardType});
        formType === "edit" && action({flashcardId: id, question, answer, type: flashcardType, deckId});
    }

    return (
        <section className="full-screen fixed-top flex-container-center bg-white-trans" style={{zIndex: 5}}>
            <form onSubmit={handleSubmit} className="container bg-white flex-column padding-2 width-responsive" >
                <h1 className="ff-serif">{formType === "add" ? 'New' : 'Edit'} Flashcard</h1>
                <div className="grid-responsive">
                    <textarea name="question" placeholder="Question" defaultValue={defaultQuestion && defaultQuestion} className="large-textarea" />
                    <textarea name="answer" placeholder="Answer" defaultValue={defaultAnswer && defaultAnswer} className="large-textarea" />
                </div>
                <select name="type" className="dropdown" defaultValue={defaultType && defaultType}>
                    {QUESTION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <div className="flex-row">
                    <button type="submit" className="small-button bg-dark-1 text-white titlecase" style={{width: '100%'}}>{formType}</button>
                    <button type="button" className="small-button bg-light-2 text-dark-2" style={{width: '100%'}} onClick={()=>setModalState(false)}>Cancel</button>
                </div>
            </form>
        </section>
    )
}