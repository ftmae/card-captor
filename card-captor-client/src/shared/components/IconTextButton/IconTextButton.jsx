export default function IconTextButton({onClick, disabled, icon, text, style}){
    return(
        <button className={`small-button flex-row align-center ${style}`} onClick={onClick} disabled={disabled}>
            <span className="fs-400 material-symbols-outlined">
                {icon}
            </span>
            {text}
        </button>
    )
}