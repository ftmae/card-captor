import { Link } from 'react-router';
export default function DeckLink({pathname, id, title, icon, name}){
    return (
         <Link to={{pathname, search: `?deckId=${id}&deckName=${name}`}} className="icon-button flex-row align-center border-dark-2 bg-light-1" title={title}>
            <span className="text-dark-2 fs-400 material-symbols-outlined">
                {icon}
            </span>
        </Link>
    )
}