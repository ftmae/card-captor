import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useAppStore from '../../../../store/appStore';
import './pagenumberinput.css';


export default function PageNumberInput({totalPages}) {
    const {pages, setPages, incrementPages, decrementPages} = useAppStore(
        useShallow(state=>(
            {
                pages: state.pages,
                setPages: state.setPages,
                incrementPages: state.incrementPages, 
                decrementPages: state.decrementPages,
            }
        ))
    );
    
    const numberInputs = [
        {id: 'from', value: pages.from, min: 1, handleChange: handleFromChange},
        {id: 'to', value: pages.to, min: pages.from, handleChange: handleToChange},
    ]

    useEffect(() => {
        setPages('to', totalPages);
    }, [totalPages, setPages])

    function handleFromChange(event) {
        const value = parseInt(event.target.value);
        if (value >= 1 && value <= totalPages && value <= pages.to) {
            setPages('from', value);
        }
    }

    function handleToChange(event) {
        const value = parseInt(event.target.value);
        if (value <= totalPages && value >= pages.from) {
            setPages('to', value);
        }
    }

    function handleUp(event){ 
        const id = event.target.id;
        if(id === 'from' && pages.from < pages.to && pages.from < totalPages){
            incrementPages('from');
        }
        if(id ==='to' && pages.to < totalPages){
            incrementPages('to');
        }
    }

    function handleDown(event){
        const id = event.target.id;
        if(id === 'from' && pages.from > 1){
            decrementPages('from');
        }
        if(id==='to' && pages.to > pages.from){
           decrementPages('to');
        }
    }

    return (
        <div className="flex-row justify-center">
            {numberInputs.map(numberInput => (
                <label key={numberInput.id} htmlFor={numberInput.id} className="flex-row align-center" style={{ flex: 1 }}>
                    <span className='titlecase'>{numberInput.id}</span>
                    <div className='input-container'>
                        <input className="number-input" type="number" value={numberInput.value} onChange={numberInput.handleChange} min={numberInput.min} max={totalPages}/>
                        <div className="button-row">
                            <button type="button" className="icon-button bg-dark-1 text-white" onClick={handleUp}>
                                <span id={numberInput.id} className="material-symbols-outlined">arrow_drop_up</span>
                            </button>
                            <button type="button" className="icon-button bg-dark-1 text-white" onClick={handleDown}>
                                <span id={numberInput.id} className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </div>
                    </div>
                </label>
            ))}
        </div>
    )
}