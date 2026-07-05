import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSpacedRepFlashcards } from "../hooks/useSpacedRep.jsx";
import StudyCard from "./StudyCard.jsx";
import CardNavigationButtons from "./CardNavigationButtons.jsx";

export default function StudyCards(){
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const deckIds = searchParams.getAll('deckId');
    const {data: flashcards, isLoading} = useSpacedRepFlashcards(deckIds);
    const [current, setCurrent] = useState(0);
    const [side, setSide] = useState('question');
    let progressBarWidth = 0;
    
    if(flashcards?.length > 0) progressBarWidth = ((current+1)/(flashcards.length) * 100);
    console.log(flashcards);
    
    return (
        <>
            { flashcards?.length > 0 ? 
                <div className="flex-container-center min-height-100vh mt-5 flex-column">
                    <p className="width-responsive fs-400"> {`${current+1} / ${flashcards.length}`} </p>
                    <div className="border-dark-2 bg-white border-radius-05 width-responsive">
                        <div style={{width: `${progressBarWidth}%`, height: '10px'}} className="bg-dark-2 text-white text-center border-radius-05"></div>
                    </div>
                    <div className="width-responsive flex-column">
                        <StudyCard flashcards={flashcards} current={current} setCurrent={setCurrent} side={side} setSide={setSide} />
                        <CardNavigationButtons flashcards={flashcards} setSide={setSide} current={current} setCurrent={setCurrent}/>
                    </div>
                </div>
                :  
                <div className="flex-container-center min-height-100vh border-dark-2 text-dark-2 fs-500">
                    {isLoading ? "Loading..." : "No Flashcards To Study Today"}
                </div>
            }
        </>
    )
}