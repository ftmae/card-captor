import { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import RadioButtons from '../RadioButtons/RadioButtons.jsx';
import FlashcardFileInput from '../FlashcardFileInput/FlashcardFileInput.jsx';
import FlashcardTextInput from '../FlashcardTextInput/FlashcardTextInput.jsx';
import QuestionTypeCheckbox from '../QuestionTypeCheckbox/QuestionTypeCheckbox.jsx';
import ErrorMessage from '../../../../shared/components/ErrorMessage/ErrorMessage.jsx';
import useAppStore from '../../../../store/appStore.js';
import generateCards from '../../services/gemini.js';
import extractText from '../../services/extractPdfText.js';
import './flashcardsourceform.css';

const QUESTION_TYPES = [
    { value: "fob", label: 'Fill in the Blanks', checked: true },
    { value: "mcqs", label: 'Multiple Choice', checked: false },
    { value: "short-answer", label: 'Short Answer', checked: false },
    { value: "long-answer", label: 'Long Answer', checked: false },
    { value: "assertion-reason", label: 'Assertion / Reason', checked: false },
    { value: "true-false", label: 'True / False', checked: false },
]

export default function FlashcardSourceForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const deckId = searchParams.get('deckId');
    const { pages, resetPages, text, setText, flashcards, setFlashcards } = useAppStore(
        useShallow(state => ({
            pages: state.pages,
            resetPages: state.resetPages,
            text: state.text,
            setText: state.setText,
            flashcards: state.flashcards,
            setFlashcards: state.setFlashcards,
        }))
    );
    const [validation, setValidation] = useState([]);
    const [selected, setSelected] = useState('text');
    const [checkboxes, setCheckboxes] = useState(QUESTION_TYPES);
    const [inputFile, setInputFile] = useState();
    const [inputText, setInputText] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    function validateForm() {
        let errors = [];
        if (!checkboxes.some(checkbox => checkbox.checked)) errors.push('Select at least 1 question / answer type');
        if (selected === 'text' && inputText.length < 100) errors.push('Text should be at least 100 characters long');
        if (selected === 'pdf' && !inputFile) errors.push('Please upload a file');
        return errors;
    }

    function resetFormState() {
        setSelected('text');
        setInputText('');
        setInputFile();
        resetPages();
        setCheckboxes(QUESTION_TYPES);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        const formErrors = validateForm();
        if (formErrors.length > 0) {
            setValidation(formErrors);
            return;
        }
        setIsLoading(true);
        try{
            const selectedQuestionTypes = checkboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.label);
            const finalText = selected === 'pdf' ? await extractText(inputFile, pages.from, pages.to) : inputText;
            setText(finalText);
            const returnedDeckId = await generateCards(finalText, selectedQuestionTypes, deckId);       
            if(returnedDeckId) {
                // setFlashcards(generatedFlashcards.data);
                navigate({pathname: '/flashcards', search: `?deckId=${deckId}`});
            };
        }
        catch(error){
            console.error(error);
            if (error === 'TypeError') setError("Network error please check your connection");
            setError(error?.message || "Something went wrong");
        }
        finally{
            resetFormState();
            setIsLoading(false);
        }
    }

    return (
        <>
        {error &&  <ErrorMessage error={error} setError={setError}/>}
        <div className='mt-7'>
            <form onSubmit={handleSubmit} className="upload-form">
                <h1 className="ff-serif fs-500 text-center">Flashcard Preferences</h1>
                <RadioButtons selected={selected} setSelected={setSelected} />
                <div className='upload-input'>
                    {selected === 'pdf' ? <FlashcardFileInput inputFile={inputFile} setInputFile={setInputFile} /> : <FlashcardTextInput inputText={inputText} setInputText={setInputText} />}
                </div>
                <QuestionTypeCheckbox checkboxes={checkboxes} setCheckboxes={setCheckboxes} />
                {validation.length > 0 && <ul className="ff-sans text-dark-1 fs-425 text-center">{validation.map((message, index) => <li key={index}>{message}</li>)}</ul>}
                <button type="submit" className={`small-button  ${isloading ? 'bg-light-1 text-dark-1' : 'bg-dark-1 text-white'}`} disabled = {isloading}>{isloading ? "Generating..." : "Submit"}</button>
            </form>
        </div>
        </>
    )
}