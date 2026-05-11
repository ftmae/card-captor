export default function Deck({name, id}){    
   
    return (
        <div className='border-dark-2-trans50 bg-white container flex-column hover'> 
            <div className="fs-400">{name}</div>
        </div>
    )
}