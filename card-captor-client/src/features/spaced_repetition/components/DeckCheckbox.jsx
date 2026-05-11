export default function DeckCheckbox({name, id, isChecked, handleOnChange}){    
   
    return (
        <div className='border-dark-2-trans50 bg-white container flex-column hover'> 
            <label key={id} htmlFor={id} className="flex-row align-center" style={{"gap": '0.2rem'}}>
                <input className="d-none" type="checkbox" name="deck" checked={isChecked} value={id} id={id} onChange={handleOnChange}/>
                <span className="checkmark"></span>
                <span className="fs-400">{name}</span>
            </label>
        </div>
    )
}