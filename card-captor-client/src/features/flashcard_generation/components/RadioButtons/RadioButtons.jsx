import './radiobuttons.css';

const options = [
    {key: '1-radio-text', id: 'text', label:'Text', value: 'text'},
    {key: '2-radio-pdf', id: 'pdf', label:'PDF', value: 'pdf'},
];

export default function RadioButtons({selected, setSelected}){
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