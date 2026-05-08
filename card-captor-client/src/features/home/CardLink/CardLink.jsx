import { Link } from "react-router";

export default function CardLink({title, body, icon}){
    return (
        <Link className="flex-container-center flex-column bg-white border-dark-2-trans50 text-dark-2 text-center border-radius-05 hover" to='/decks'>
            <h2 className="text-dark-2 ff-serif fs-450 flex-row align-center">
                <span className="material-symbols-outlined">
                    {icon}
                </span>
                {title}
            </h2>
            <p className="fs-400 ff-sans">{body}</p>
        </Link>
    )
}