import { Link } from 'react-router';

export default function Deck({name, id}){
    function handleDelete(){

    }
    return (
        <div className='border-dark-2 container flex-row align-center justify-space-between' style={{width: '100%'}}> 
            <p>{name}</p> 
            <div className="flex-row">
                 <Link to={{pathname: '/flashcards', search: `?deckId=${id}`}} className="icon-button bg-trans" title="View Cards In Deck">
                    <span className="text-dark-2 material-symbols-outlined">
                        visibility
                    </span>
                </Link>
                <Link to={{pathname: '/generate_flashcards', search: `?deckId=${id}`}} className="icon-button bg-trans" title="Add Cards to Deck">
                    <span className="text-dark-2 material-symbols-outlined">
                        add
                    </span>
                </Link>
                <button className="icon-button bg-trans" title="Delete Deck" onClick={handleDelete}>
                    <span className="text-dark-2 material-symbols-outlined">
                        delete
                    </span>
                </button>
            </div>
        </div>
    )
}