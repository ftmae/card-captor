import { useEffect, useState } from "react"
import useAppStore from "../../../../store/appStore";
import { useLoaderData } from "react-router";
import ErrorMessage from "../../../../shared/components/ErrorMessage/ErrorMessage";
// import './flashcard.css';

export default function Flashcards() {
    const [flip, setFlip] = useState('question');
    const [current, setCurrent] = useState(0);
    const [error, setError] = useState(null);
    // const flashcards = useAppStore(state => state.flashcards);
    const fetchedData = useLoaderData();
    const flashcards = fetchedData.data;
    const card = flashcards ? flashcards[current] : null;

    useEffect(()=>{
        if(fetchedData.error) setError(fetchedData.error);
    }, [])

    function handleFlip() {
        setFlip(prev => prev === 'question' ? 'answer' : 'question')
    }

    function handleUp(){
        if(current < flashcards.length-1){
            setCurrent(prev=>prev+1)
            setFlip('question');
        };
    }

    function handleDown(){
        if(current > 0){
            setCurrent(prev=>prev-1);
            setFlip('question');
        }
    }

    return (
        <>
            {error && <ErrorMessage error={error} setError={setError}/>}
            
            <div className="flex-container-center min-height-100vh">
                <button 
                    className={`icon-button bg-trans text-dark-1 ${flashcards && current > 0 ? '' : 'opaque' }`}
                    style={{ alignSelf: 'center' }} 
                    onClick={handleDown} 
                    disabled={!(flashcards && current > 0)}
                >
                    <span className="material-symbols-outlined fs-600" >arrow_left</span>
                </button>

                <div className="flex-row align-center container-center padding-2 bg-light-1 text-dark-1 border-dark-2" onClick={handleFlip} >
                    <p className="fs-500">
                        {card ? flip === 'question' ? `Q) ${card.question}` : `A) ${card.answer}` : 'No Flashcards to Show'}
                    </p>
                </div>

                <button 
                    className={`icon-button bg-trans text-dark-1 ${flashcards && current < flashcards?.length - 1 ? '' : 'opaque' }`} 
                    style={{ alignSelf: 'center' }} 
                    onClick={handleUp} 
                    disabled={!(flashcards && current < flashcards?.length - 1)}
                >
                    <span className="material-symbols-outlined fs-600">arrow_right</span>
                </button>
            </div>
        </>
    )
}