import { Link } from "react-router";

export default function AuthChange({title, linkText, to}){
    return(
        <div className="flex-row align-center padding-03">
            <p>{title}</p>
            <Link to={to} className="text-white padding-05 bg-dark-1 border-radius-05">{linkText}</Link>
        </div> 
    )
}