import './flashcardtextinput.css';

export default function FlashcardTextInput({ inputText, setInputText }) {
    return (
        <label>
            <textarea
                name="upload"
                className="custom-textarea-large"
                placeholder="Input text"
                minLength="100"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                required 
            />
        </label>
    )
}