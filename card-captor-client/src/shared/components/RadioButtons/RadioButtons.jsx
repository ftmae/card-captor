import './radiobuttons.css';

export default function RadioButtons({selected, setSelected, options}){
    const radioButtons = options.map(option=>(
        <label key={option.key} htmlFor={option.id}>  
            <input 
                className="d-none" 
                type="radio" 
                id={option.id} 
                value={option.value} 
                name="uploadOptions" 
                onChange={(event) => setSelected(event.target.value)} 
                checked={selected === option.value}
            />
            <span className="radio-custom">{option.label}</span>
        </label>
    ))

    return (
        <div className='radio-row'>
            {radioButtons}
        </div>
    )
}