import {Link} from 'react-router';
import './home.css';

export default function Home(){
    return ( 
        <section className="flex-column mt-5 padding-2">
            <article className="grid-2-col " style={{minHeight: '60vh'}}>
                <div className='flex-column text-dark-1 justify-center align-center container'>
                    <h1 className="ff-serif text-center fs-500 uppercase">Master All Your Study Material</h1>
                    <p className='fs-450 text-center text-dark-2'>Upload a PDF or text to get started. If you already have decks created, start studying them with the spaced-repitition module</p>
                </div>
                <div className='flex-column container'>
                    <div className="card-stack" >
                        <div className="card card-1"></div>
                        <div className="card card-2"></div>
                        <div className="card card-3">
                            <p className='ff-serif text-dark-1 text-center mt-2'>What is Spaced Repetition?</p>
                            <p className='ff-sans text-black text-center fw-150'>A learning technique that increases intervals between reviews to boost long-term retention.</p>
                        </div>
                    </div>
                </div>
            </article>
            <article className="grid-2-col">
                <Link className="container hover flex-column align-center bg-light-1 border-dark-2 text-dark-2 text-center" to='/decks'>
                    <span className="material-symbols-outlined">
                        cards_stack
                    </span>
                    <h2 className="text-dark-2 ff-serif fs-425">Generate Flashcards</h2>
                    <p className="fs-400">Upload lecture notes, textbook chapters or any study material in PDF or text format.</p>
                </Link>
                <Link className="container hover flex-column align-center bg-light-1 border-dark-2 text-dark-2 text-center" to='/home'>
                    <span className="material-symbols-outlined">
                        monitoring
                    </span>
                    <h2 className="text-dark-2 ff-serif fs-425">Study With Spaced Repetition</h2>
                    <p className="fs-400">An adaptive learning algorithm that shows the right card at the right time so that all your content is learned thoroughly.</p>
                </Link>
            </article>
        </section>
    )
}