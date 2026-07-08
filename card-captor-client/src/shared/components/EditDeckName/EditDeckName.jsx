export default function EditDeckName({updatedName, setUpdatedName, handleCancel, handleEdit}){
    return(
        <input 
            type="text" 
            className="textbox fs-450 ff-serif width-100" 
            value={updatedName} 
            onChange={(event)=>setUpdatedName(event.target.value)} 
            onKeyDown={(event)=>{ 
                if(event.key === 'Enter') handleEdit();
                if(event.key === 'Escape') handleCancel();
            }} 
            autoFocus />
    )
}