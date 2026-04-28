import './questiontypecheckbox.css'
export default function QuestionTypeCheckbox({checkboxes, setCheckboxes}){
    function handleChange(event){
        const current = event.target.value;
        console.log(current)
        setCheckboxes(prev=>(
            prev.map(checkbox => (
                checkbox.value === current ? {...checkbox, checked: !checkbox.checked} : checkbox
            ))
        ));
    }
    
    return(
        <div className='question-types'>
            {checkboxes.map(checkbox=>(
                <label key={checkbox.value} htmlFor={checkbox.value}>
                    <input className="d-none" type="checkbox" name="question-types" id={checkbox.value} value={checkbox.value} checked={checkbox.checked} onChange={handleChange}/>
                    <span className="checkmark"></span>
                    <span className="fs-425">{checkbox.label}</span>
                </label>
            ))}
        </div>
    )
}