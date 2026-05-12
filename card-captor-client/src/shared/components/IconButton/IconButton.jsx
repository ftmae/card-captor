export default function IconButton({title, onClick, icon, disabled}){
    return(
        <button className="icon-button flex-row align-center border-dark-2 bg-light-1" title={title} onClick={onClick} disabled={disabled}>
            <span className="material-symbols-outlined text-dark-2">
                {icon}
            </span>
        </button>
    )
}