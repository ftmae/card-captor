export default function TypeButton({text, onClick, currentType}){
    return (
        <button className={`fs-350 icon-button m-02 ${text === currentType ? "bg-dark-1 text-white border-light-3" : "border-dark-2 bg-white text-dark-2"}`} onClick={onClick} aria-selected={currentType === text}>
            {text}
        </button>
    )
}