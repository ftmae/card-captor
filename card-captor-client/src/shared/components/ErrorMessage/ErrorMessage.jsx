import './errormessage.css';
export default function ErrorMessage({error, setError}){
    return (
        <div className='error-message-container'>
            <div className="error-message">
                <p className="text-white">{error}</p>
                <button type="button" className="icon-button bg-trans">
                    <span className="material-symbols-outlined text-white" onClick={()=>setError(null)}>
                        close_small
                    </span>
                </button>
            </div>
        </div>
    )
}