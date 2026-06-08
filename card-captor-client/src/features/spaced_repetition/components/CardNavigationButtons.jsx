export default function CardNavigationButtons({setSide, setCurrent, current, flashcards}){
    function handlePrev(){
        setSide('question');
        setCurrent(prev=>(
            (prev > 0 ) ? prev - 1 : prev 
        ));
    }

    function handleNext(){
        setSide('question');
        setCurrent(prev=>(
            (prev < flashcards?.length-1) ? prev + 1 : prev
        ));
    }

    const navigateButtons = [
        {condition: current === 0, onClick: handlePrev, text: "Previous"},
        {condition: current === flashcards?.length-1, onClick: handleNext, text: "Next"}
    ];

    return (
        <div className="flex-row justify-space-between">
            { 
            navigateButtons.map(button => (
                <button key={button.text} className={`small-button flex-row align-center ${button.condition ? "text-dark-2 bg-trans border-dark-2" : "text-white bg-dark-2 border-trans"}`} onClick={button.onClick} disabled={button.condition}>
                    {button.text}
                </button>
            ))
            }
        </div>
    )
}