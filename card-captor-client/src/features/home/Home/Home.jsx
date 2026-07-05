import {Link} from 'react-router';
import CardLink from '../CardLink/CardLink';
import './home.css';

const cards = [
    {title: "Generate Flashcards", body: "Upload lecture notes, textbook chapters or any study material in PDF or text format.", icon: "cards_stack", to: '/decks'},
    {title: "Study With Spaced Repetition", body: "An adaptive learning algorithm that shows the right card at the right time so that all your content is learned thoroughly.", icon: "monitoring", to: '/deck_selection'}
]
export default function Home(){
    return ( 
        <section className="flex-column mt-5 padding-2">
            <article className="grid-responsive min-height-60vh">
                <div className='flex-column text-dark-1 justify-center align-center container'>
                    <h1 className="ff-serif text-center fs-600 mb-1">Master All Your Study Material</h1>
                    <p className='fs-450 text-center text-dark-2 ff-sans fw-350'>Upload a PDF or text to get started. If you already have decks created, start studying them with the spaced-repitition module</p>
                </div>
                <div className='flex-column container'>
                    <div className="card-stack" >
                        <div className="card card-1"></div>
                        <div className="card card-2"></div>
                        <div className="card card-3">
                            <p className='ff-serif text-dark-1 text-center fs-425'>What is Spaced Repetition?</p>
                            <p className='ff-sans text-dark-2 black text-center fw-350'>A learning technique that increases intervals between reviews to boost long-term retention.</p>
                        </div>
                    </div>
                </div>
            </article>
            <article className="grid-responsive">
                {cards.map((card, index) => <CardLink key={card.title + index} title={card.title} body={card.body} icon={card.icon} to={card.to}/>)}
            </article>
        </section>
    )
}