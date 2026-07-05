import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useGenerationFormStore from '../../store/generationFormStore.js';
import IconButton from '../../../../shared/components/IconButton/IconButton.jsx';
import './pagenumberinput.css';


export default function PageNumberInput({ totalPages }) {
    const { pages, setPages, incrementPages, decrementPages } = useGenerationFormStore(
        useShallow(state => (
            {
                pages: state.pages,
                setPages: state.setPages,
                incrementPages: state.incrementPages,
                decrementPages: state.decrementPages,
            }
        ))
    );

    const numberInputs = [
        { id: 'from', value: pages.from, min: 1, handleChange: handleFromChange, handleBlur: handleFromBlur },
        { id: 'to', value: pages.to, min: pages.from, handleChange: handleToChange, handleBlur: handleToBlur },
    ]

    useEffect(() => {
        setPages('to', totalPages);
    }, [totalPages, setPages])

    function handleFromChange(event) {
        const value = parseInt(event.target.value);
        setPages('from', value);
    }

    function handleToChange(event) {
        const value = parseInt(event.target.value);
        setPages('to', value);

    }

    function handleFromBlur(event) {
        let value = pages.from;

        if (Number.isNaN(value) || value === '' || value < 1) {
            value = 1;
        }
        if (value > totalPages) {
            value = totalPages;
        }
        if (value > pages.to) {
            value = pages.to;
        }
        setPages('from', value);
    }

    function handleToBlur() {
        let value = pages.to;

        if (Number.isNaN(value) || value === '' || value < 1 || value < pages.from || value > totalPages) {
            value = totalPages;
        }
        setPages('to', value);
    }

    function handleUp(event) {
        const id = event.target.id;
        if (id === 'from' && pages.from < pages.to && pages.from < totalPages) {
            incrementPages('from');
        }
        if (id === 'to' && pages.to < totalPages) {
            incrementPages('to');
        }
    }

    function handleDown(event) {
        const id = event.target.id;
        if (id === 'from' && pages.from > 1) {
            decrementPages('from');
        }
        if (id === 'to' && pages.to > pages.from) {
            decrementPages('to');
        }
    }

    return (
        <div className="flex-row justify-center">
            {numberInputs.map(numberInput => (
                <label key={numberInput.id} htmlFor={numberInput.id} className="flex-row align-center flex-1">
                    <span className='titlecase'>{numberInput.id}</span>
                    <div className='input-container'>
                        <input className="number-input" type="number" value={numberInput.value} onChange={numberInput.handleChange} onBlur={numberInput.handleBlur} min={numberInput.min} max={totalPages} />
                        <div className="button-row">
                            {/* <IconButton title="Increment Page Number" onClick={handleUp} icon="arrow_drop_up" disabled={false} buttonStyle="bg-dark-1 text-white border-none" id={numberInput.id} spanStyle="text-white" spanId={numberInput.id}/>
                            <IconButton title="Decrement Page Number" onClick={handleDown} icon="arrow_drop_down" disabled={false} buttonStyle="bg-dark-1 text-white border-none" id={numberInput.id} spanStyle="text-white" spanId={numberInput.id}/>     */}
                            <button type="button" className="icon-button bg-dark-1 text-white border-none" onClick={handleUp}>
                                <span id={numberInput.id} className="material-symbols-outlined">arrow_drop_up</span>
                            </button>
                            <button type="button" className="icon-button bg-dark-1 text-white border-none" onClick={handleDown}>
                                <span id={numberInput.id} className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </div>
                    </div>
                </label>
            ))}
        </div>
    )
}