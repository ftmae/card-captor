import './home.css';
import {Link} from 'react-router';

export default function Home(){
    return (
        <>  
            <section className="home-container">
                <article className="container bg-light-1 text-dark-2 text-center">
                    A customized flashcard generation tool with a space repetiton algorithm.
                </article>
                <div className="grid-2-col">
                    <article className="container bg-light-1 text-dark-2 text-center">
                       <Link className="text-dark-2" to='/decks'>Generate Flashcards</Link>
                    </article>
                    <article className="container bg-light-1 text-dark-2 text-center">
                       <Link className="text-dark-2" to='/home'>Study With Spaced Repetition</Link>
                    </article>
                </div>
            </section>
        </>
    )
}