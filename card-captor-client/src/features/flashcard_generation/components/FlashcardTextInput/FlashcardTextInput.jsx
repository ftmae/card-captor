export default function FlashcardTextInput({ inputText, setInputText }) {
    return (
        <label>
            <textarea
                name="upload"
                className="large-textarea"
                placeholder="Input text"
                minLength="100"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                required 
            />
        </label>
    )
}