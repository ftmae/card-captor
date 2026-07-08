export default function Checkbox({id, isChecked, handleOnChange}){
    return(
        <label key={id} htmlFor={id} className="flex-row align-center gap-02">
            <input className="d-none" type="checkbox" name="deck" checked={isChecked} value={id} id={id} onChange={handleOnChange}/>
            <span className="checkmark"></span>
        </label>  
    )
}