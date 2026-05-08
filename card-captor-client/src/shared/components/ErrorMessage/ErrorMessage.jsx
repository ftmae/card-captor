import './errormessage.css';
export default function ErrorMessage({error, reset}){
    return (
        <div className='error-message-container'>
            <div className="error-message">
                <p className="text-white">{error}</p>
                <button type="button" className="icon-button bg-trans border-trans">
                    <span className="material-symbols-outlined text-white" onClick={()=>reset()}>
                        close_small
                    </span>
                </button>
            </div>
        </div>
    )
}