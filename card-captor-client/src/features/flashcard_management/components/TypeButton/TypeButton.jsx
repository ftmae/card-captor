export default function TypeButton({text, onClick, current}){
    return (
        <button className={`fs-350 icon-button m-02 ${text === current ? "bg-dark-1 text-white border-light-3" : "border-dark-2 bg-white text-dark-2"}`} onClick={onClick} aria-selected={current === text}>
            {text}
        </button>
    )
}