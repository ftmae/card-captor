import { useEffect, useState } from "react";
import NavList from "./NavList";
import { Link, Form } from "react-router";
import './header.css'
export default function Header({user}){
    const [size, setSize] = useState(window.innerWidth);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(()=>{
        function handleResize(){
            setSize(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return ()=> window.removeEventListener('resize', handleResize);
    }, []);

    function handleClick(){
        setIsOpen(prev=> !prev);
    }
    
    return (
        <header className="fixed-top bg-dark-1 flex-row align-center justify-space-between padding-2 z-index-4">
           <Link to="/"><span className="fs-450 text-light-1 ff-serif">CardCaptor</span></Link>
            <nav className="flex-row gap-2">
                {
                    size <= 768 ?
                    <>
                        <button onClick={handleClick} className='bg-trans border-trans flex-row align-center text-white' aria-expanded={isOpen}>
                            <span className="fs-400 material-symbols-outlined">
                                {isOpen ? 'close_small' : 'menu'}
                            </span> 
                        </button> 
                        <div className={`header-menu ${isOpen ? 'opened' : ''}`}>
                            <NavList flexStyle='flex-column ' toggleIcon={false}/>
                        </div>
                    </>
                    :
                    <NavList flexStyle='flex-row align-center' toggleIcon={true}/>
                }
                <Form action='/logout' method="POST">
                    <button type="submit" className="icon-button border-trans bg-dark-1 text-light-1 flex-row align-center" title="Logout">
                        <span className="fs-400 material-symbols-outlined">
                            logout
                        </span> 
                    </button>
                </Form>
            </nav>
        </header>
    )
}