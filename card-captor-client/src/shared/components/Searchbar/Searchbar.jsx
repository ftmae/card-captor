export default function Searchbar(value, onChange){
    return (
        <input type="text" className="textbox" value={value} onChange={onChange}/>
    )
}