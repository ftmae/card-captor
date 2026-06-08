export default function FormInput({value, type, placeholder, defaultValue}){
    return (
        <>
            <label htmlFor={value} className="sr-only">{value}</label>
            <input className="textbox" type={type} name={value} id={value} placeholder={placeholder} defaultValue={defaultValue}/>
        </>
    )
}