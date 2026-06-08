export default function IconButton({id, title, onClick, icon, disabled, buttonStyle, spanStyle}){
    return(
        <button type="button" className={`icon-button ${buttonStyle}`} title={title} onClick={onClick} disabled={disabled}>
            <span className={`material-symbols-outlined ${spanStyle}`}>
                {icon}
            </span>
        </button>
    )
}