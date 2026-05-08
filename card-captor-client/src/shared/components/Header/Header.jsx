import { Form } from "react-router";
import { Link, useLocation } from "react-router";
export default function Header(){
    const location = useLocation();
    
    return (
        <header className="fixed-top bg-dark-1 flex-row align-center justify-space-between padding-1 " style={{zIndex: '4'}}>
           <Link to="/"><span className="fs-450 text-light-1 ff-serif">CardCaptor</span></Link>
            <nav>
                <ul className="flex-row align-center" style={{'--gap': '2rem'}}>
                    {location.pathname !== '/home' &&
                        <>
                            {/* <li>
                                <Link className="fs-400 text-light-1" to="/home">Home</Link>
                            </li> */}
                            {
                                location.pathname !== '/decks' && 
                                <li>
                                    <Link className="fs-400 text-light-1" to="/decks">Generate Flashcards</Link>
                                </li>
                            }
                            
                            <li>
                                <Link className="fs-400 text-light-1" to="/">Study Flashards</Link>
                            </li>
                        </>
                    }
                    
                    <li>
                        <Form action='/logout' method="POST">
                            <button type="submit" className="small-button bg-dark-1 text-light-1" title="Logout">
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