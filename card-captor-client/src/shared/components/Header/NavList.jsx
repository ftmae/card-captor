import { Link, useLocation, Form} from "react-router";

export default function NavList({flexStyle, toggleIcon}){
    const location = useLocation();
    
    return(
        <ul className={`${flexStyle} gap-2`}>
            {location.pathname !== '/home' &&
                <>
                    {
                        location.pathname !== '/decks' && 
                        <li>
                            <Link className="fs-400 text-light-1" to="/decks">Generate Flashcards</Link>
                        </li>
                    }
                    {
                        location.pathname !== '/deck_selection' &&  location.pathname !== '/study' && 
                        <li>
                            <Link className="fs-400 text-light-1" to="/deck_selection">Study Flashards</Link>
                        </li>
                    }
                </>
            }
            {
                location.pathname !== '/manage_account' && 
                <li className="text-white fs-400 flex-row align-center gap-05">
                    <Link className="fs-400 text-light-1" to="/manage_account">
                        {
                            toggleIcon ?
                            <span className="material-symbols-outlined flex-row align-center">
                                person
                            </span> 
                            :
                            'Manage Account'
                        }
                    </Link>
                </li>
            }
        </ul>
    )
}