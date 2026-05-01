import { Link } from "react-router"
import { useEffect, useState, useRef} from "react";
import Step from "../Step/Step.jsx";
import './landing.css';
export default function Landing(){
    const [isHowItWorks, setIsHowItWorks] = useState(false);
    const howItWorksSection = useRef(null);
    const steps = [
        {stepNum: 1, heading: 'Upload A PDF or Text', body: 'Upload lecture notes, textbook chapters or any study material.'},
        {stepNum: 2, heading: 'Select Flaschcard Format', body: 'Choose from a variety of question answer types - tailored to how you think.'},
        {stepNum: 3, heading: 'Study with Spaced Repetition', body: 'An adaptive learning algorithm that shows the right card at the right time so that all your content is learned thoroughly.'},
    ]

    function showHowItWorks(){
        howItWorksSection.current ? howItWorksSection.current.scrollIntoView({behavior: 'smooth'}) : null;
    }
    
    return (
      <>
        <header className="fixed-top ff-serif bg-dark-1 text-light-1 padding-2">
            <span className="fs-450">CardCaptor</span>
        </header>
        <main className="flex-container-center flex-column bg-dark-1">
            <section className="hero-container">
                <h1 className="ff-serif text-white fs-800 text-center">Study <span className="italic ff text-light-2">Smarter,</span> Not Harder</h1>
                <p className="ff-sans fw-150 fs-450 text-white text-center">Upload any PDF or text, and let AI generate personalized flashcards — then study with spaced repetition for maximum retention!</p>
                <div className="flex-row">
                    <Link to="/home" className="fs-425 large-button bg-white text-dark-2 fw-200">Get Started for Free</Link>
                    <button className="fs-425 large-button bg-dark-1 text-white fw-150" onClick={showHowItWorks}>How It Works</button>
                </div>
            </section>
            <section ref={ howItWorksSection } className="appear flex-column" style={{gap: '2rem', margin: '3rem'}}>
                <h2 className="ff-sans fw-150 text-white text-center uppercase">Three Steps To Mastery</h2>
                <div className="steps-container">
                    {steps.map(step => <Step stepNum={step.stepNum} heading={step.heading} body={step.body} />)}
                </div>
            </section>
       </main>
      </>
    )
}