export default function Searchbar({searchInput, setSearchInput}){
    return (
        <input type="text" className='textbox-large bg-white' placeholder='Search For Decks' value={searchInput} onChange={()=>setSearchInput(event.target.value)} />
    )
}