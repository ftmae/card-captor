import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import RadioButtons from '../../../../shared/components/RadioButtons/RadioButtons.jsx';
import FlashcardFileInput from '../FlashcardFileInput/FlashcardFileInput.jsx';
import FlashcardTextInput from '../FlashcardTextInput/FlashcardTextInput.jsx';
import QuestionTypeCheckbox from '../QuestionTypeCheckbox/QuestionTypeCheckbox.jsx';
import extractText from '../../services/extractPdfText.js';
import { useGenerate } from '../../hooks/useGenerate.jsx';
import useGenerationFormStore from '../../store/generationFormStore.js';
import { toast } from 'react-toastify';
import './flashcardsourceform.css';

const QUESTION_TYPES = [
    { value: "fob", label: 'Fill in the Blanks', checked: true },
    { value: "mcqs", label: 'Multiple Choice', checked: false },
    { value: "short-answer", label: 'Short Answer', checked: false },
    { value: "long-answer", label: 'Long Answer', checked: false },
    { value: "assertion-reason", label: 'Assertion / Reason', checked: false },
    { value: "true-false", label: 'True / False', checked: false },
]

const options = [
    {key: '1-radio-text', id: 'text', label:'Text', value: 'text'},
    {key: '2-radio-pdf', id: 'pdf', label:'PDF', value: 'pdf'},
];

export default function FlashcardSourceForm() {
    const [searchParams] = useSearchParams();
    const deckId = searchParams.get('deckId');
    const deckName = searchParams.get('deckName');
    const { pages, resetPages, text, setText } = useGenerationFormStore(
        useShallow(state => ({
            pages: state.pages,
            resetPages: state.resetPages,
            text: state.text,
            setText: state.setText,
        }))
    );
    const [validation, setValidation] = useState([]);
    const [selected, setSelected] = useState('text');
    const [checkboxes, setCheckboxes] = useState(QUESTION_TYPES);
    const [inputFile, setInputFile] = useState();
    const [inputText, setInputText] = useState('');

    const {mutate: generateFlashcards, isError, error, isPending, reset } = useGenerate(deckId, deckName);

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

    async function handleSubmit(event){
        event.preventDefault();
        const formErrors = validateForm();
        if (formErrors.length > 0) {
            setValidation(formErrors);
            return;
        }
        const selectedQuestionTypes = checkboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.label);
        let finalText;
        if(selected === 'pdf'){
            const extractedText = await extractText(inputFile, pages.from, pages.to );
            if(!extractedText){
                toast.info("Scanned PDFs aren't yet supported. Try again with a digital PDF");
                return;
            }
            finalText = extractedText;
        }
        else{
            finalText = inputText
        }
        setText(finalText);
        generateFlashcards({finalText, selectedQuestionTypes, deckId});
    }

    return (
        <>
            <div className='mt-7'>
                <form onSubmit={handleSubmit} className="upload-form">
                    <h1 className="ff-serif fs-500 text-center">Flashcard Preferences</h1>
                    <RadioButtons selected={selected} setSelected={setSelected} options={options} />
                    <div className='upload-input'>
                        {selected === 'pdf' ? <FlashcardFileInput inputFile={inputFile} setInputFile={setInputFile} /> : <FlashcardTextInput inputText={inputText} setInputText={setInputText} />}
                    </div>
                    <QuestionTypeCheckbox checkboxes={checkboxes} setCheckboxes={setCheckboxes} />
                    {validation.length > 0 && <ul className="ff-sans text-dark-1 fs-425 text-center">{validation.map((message, index) => <li key={index}>{message}</li>)}</ul>}
                    <button type="submit" className={`small-button  ${isPending ? 'bg-light-3 text-dark-1 border-dark-2' : 'bg-dark-1 text-white border-trans'}`} disabled = {isPending}>{isPending ? "Generating..." : "Submit"}</button>
                </form>
            </div>
        </>
    )
}