import { Form } from "react-router";
import { Link, useLocation } from "react-router";
export default function Header({user}){
    const location = useLocation();
    return (
        <header className="fixed-top bg-dark-1 flex-row align-center justify-space-between padding-2" style={{zIndex: '4'}}>
           <Link to="/"><span className="fs-450 text-light-1 ff-serif">CardCaptor</span></Link>
            <nav>
                <ul className="flex-row align-center" style={{'--gap': '2rem'}}>
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
                        <li className="text-white fs-400 flex-row align-center" style={{gap: '0.5rem'}}>
                            <Link className="fs-400 text-light-1" to="/manage_account">
                                <span class="material-symbols-outlined flex-row align-center">
                                    person
                                </span>
                            </Link>
                        </li>
                    }
                    <li>
                        <Form action='/logout' method="POST">
                            <button type="submit" className="icon-button border-trans bg-dark-1 text-light-1 flex-row align-center" title="Logout">
                                <span className="fs-400 material-symbols-outlined">
                                    logout
                                </span>    
                            </button>
                        </Form>
                    </li>
                </ul>
            </nav>
        </header>
    )
}